import os
import time
from gtts import gTTS
import pygame
from threading import Event
from pydub import AudioSegment
from pydub.playback import play
import io
from threading import Event

# Biến toàn cục để quản lý âm thanh
is_paused = Event()  # Dùng event để kiểm soát pause/resume
is_paused.set()  # Ban đầu là không paused
is_stopped = False  # Biến để kiểm soát việc dừng âm thanh
is_reading = False
reading_speed = 1.0  # Tốc độ đọc mặc định (1.0 = bình thường)

def set_reading_speed(speed):
    """
    Thiết lập tốc độ đọc
    Args:
        speed (float): Tốc độ đọc (0.5 = chậm 2 lần, 1.0 = bình thường, 2.0 = nhanh 2 lần)
    """
    global reading_speed
    if 0.25 <= speed <= 4.0:  # Giới hạn tốc độ từ 0.25x đến 4x
        reading_speed = speed
        print(f"Tốc độ đọc đã được thiết lập: {speed}x")
    else:
        print("Tốc độ đọc phải nằm trong khoảng 0.25 - 4.0")

def get_reading_speed():
    """Lấy tốc độ đọc hiện tại"""
    return reading_speed

def change_audio_speed(audio_file, speed):
    """
    Thay đổi tốc độ của file audio
    Args:
        audio_file (str): Đường dẫn đến file audio
        speed (float): Tốc độ mong muốn
    Returns:
        AudioSegment: Audio đã được điều chỉnh tốc độ
    """
    try:
        # Load audio file
        audio = AudioSegment.from_mp3(audio_file)
        
        # Thay đổi tốc độ phát (frame rate)
        # Tăng frame rate = tăng tốc độ, giảm frame rate = giảm tốc độ
        new_sample_rate = int(audio.frame_rate * speed)
        
        # Tạo audio mới với tốc độ đã thay đổi
        speed_changed_audio = audio._spawn(audio.raw_data, overrides={"frame_rate": new_sample_rate})
        
        # Chuyển về sample rate gốc để đảm bảo tương thích
        return speed_changed_audio.set_frame_rate(audio.frame_rate)
    except Exception as e:
        print(f"Lỗi khi thay đổi tốc độ audio: {e}")
        return None

def play_audio_with_speed(audio_segment):
    """
    Phát audio với pygame từ AudioSegment
    Args:
        audio_segment (AudioSegment): Audio segment để phát
    """
    # Convert AudioSegment to bytes
    audio_data = audio_segment.export(format="wav")
    
    # Load vào pygame
    pygame.mixer.init(frequency=audio_segment.frame_rate, size=-16, channels=2, buffer=1024)
    sound = pygame.mixer.Sound(audio_data)
    sound.play()
    
    return sound

def get_audio_duration(file_path, speed=1.0):
    try:
        audio = AudioSegment.from_mp3(file_path)
        duration = audio.duration_seconds
        print(f"Thời lượng audio: {duration}")
        return duration / speed  # thời lượng thực tế khi phát
    except Exception as e:
        print(f"Lỗi khi đọc thời lượng audio: {e}")
        return 1.0
# Hàm để đọc văn bản theo dòng với tốc độ tùy chỉnh
def doc_theo_dong(text, delay=0.2, socketio=None):
    global is_stopped, is_reading, reading_speed
    is_stopped = False
    is_reading = True

    if isinstance(text, list):
        lines = text
    else:
        lines = text.splitlines()

    # Tạo event dùng để chờ từng dòng được phát xong
    line_done_event = Event()

    # Hàm xử lý khi frontend gửi "đã phát xong"
    def on_audio_done(data):
        print("✅ Frontend đã phát xong dòng.")
        line_done_event.set()  # Bật cờ để dòng tiếp theo chạy

    if socketio:
        socketio.on('audio_played_done', on_audio_done)

    for i, line in enumerate(lines):
        is_paused.wait()

        if is_stopped:
            return
        if line.strip() == "":
            continue

        print(f"🔊 Đang xử lý dòng {i+1}: {line.strip()}")
        tts = gTTS(line.strip(), lang='vi')
        tts.save("temp.mp3")

        audio_path = "temp.mp3"

        with open(audio_path, "rb") as f:
            audio_bytes = f.read()

        if socketio:
            socketio.emit('audio_data', {
                'line_index': i + 1,
                'text': line.strip(),
                'audio': audio_bytes.hex(),
                'speed': reading_speed
            })

            # Reset cờ trước khi chờ dòng đó phát xong

            duration = get_audio_duration(audio_path, reading_speed)
            line_done_event.clear()
            
            waited_time = 0
            while not line_done_event.is_set() and waited_time < duration:
                if is_stopped:
                    break
                is_paused.wait()  # Nếu đang bị pause thì sẽ dừng ở đây
                time.sleep(0.1)
                waited_time += 0.1

        # Xoá file tạm
        for temp in ["temp.mp3", "temp_speed.mp3"]:
            if os.path.exists(temp):
                os.remove(temp)

        time.sleep(delay)

    is_reading = False
    if socketio:
        socketio.emit('reading_completed', {'is_reading': False})

def get_is_reading():
    global is_reading
    is_reading = True
    return is_reading

def pause_audio():
    global is_paused
    is_paused.clear()  # Tạm dừng âm thanh

def resume_audio():
    global is_paused
    is_paused.set()  # Tiếp tục phát âm thanh

def stop_audio():
    global is_stopped, is_paused
    is_paused.set()
    is_stopped = True  # Dừng hẳn âm thanh
