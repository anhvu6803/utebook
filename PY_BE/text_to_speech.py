import os
import time
from gtts import gTTS
import pygame
from threading import Event


# Biến toàn cục để quản lý âm thanh
is_paused = Event()  # Dùng event để kiểm soát pause/resume
is_paused.set()  # Ban đầu là không paused
is_stopped = False  # Biến để kiểm soát việc dừng âm thanh
is_reading = False

# Hàm để đọc văn bản theo dòng
def doc_theo_dong(text, delay=0.2, socketio=None):
    global is_stopped, is_reading
    is_stopped = False
  
    if isinstance(text, list):  # Kiểm tra nếu text là một list
        text_str = "\n".join(text)  # Chuyển list thành chuỗi với các dòng ngăn cách bằng ký tự newline
        lines = text_str.splitlines()  # Chia chuỗi thành các dòng
    else:
        lines = text.splitlines()  # Nếu text đã là chuỗi, trực tiếp sử dụng splitlines()

    for i, line in enumerate(lines):
        if line.strip() == "":
            continue  # bỏ qua dòng trống
        print(f"Đang đọc dòng {i+1}: {line.strip()}")
        # Tạo tệp âm thanh từ gTTS
        tts = gTTS(line.strip(), lang='vi')
        tts.save("temp.mp3")

        if not os.path.exists("temp.mp3"):
            pygame.mixer.stop()
            print("Không tìm thấy tệp temp.mp3. Dừng quá trình.")
            return
        pygame.mixer.init()
        sound = pygame.mixer.Sound("temp.mp3")
        sound.play()
        is_reading = True

        # Đợi cho đến khi âm thanh hoàn thành hoặc tạm dừng
        while pygame.mixer.get_busy():
            if is_stopped:
                pygame.mixer.stop()
                print("Stop...")
                os.remove("temp.mp3")
                return
            else:
                if not is_paused.is_set():
                    print("Đang tạm dừng...")
                    pygame.mixer.stop()  # Dừng phát âm thanh
                    while not is_paused.is_set():  # Chờ đến khi tiếp tục
                        time.sleep(0.1)
                    print("Tiếp tục phát âm thanh...")
                    sound.play() 
            
            time.sleep(0.1)  # Đảm bảo không chạy vòng lặp quá nhanh
        
        os.remove("temp.mp3")  # Xóa file tạm
        time.sleep(delay)  # Thêm một khoảng dừng giữa các dòng
    is_reading = False
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