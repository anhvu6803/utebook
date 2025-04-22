import os
import time
import gdown
from gtts import gTTS
import pygame
import tempfile
from threading import Event

# Biến toàn cục để quản lý âm thanh
is_paused = Event()  # Dùng event để kiểm soát pause/resume
is_paused.set()  # Ban đầu là không paused
is_stopped = False  # Biến để kiểm soát việc dừng âm thanh

# Hàm để đọc văn bản theo dòng
def doc_theo_dong(text, delay=0.2):
    global is_stopped
    
    # Tách văn bản theo dòng mới (\n)
    lines = text.splitlines()
    
    for i, line in enumerate(lines):
        if line.strip() == "":
            continue  # bỏ qua dòng trống
        print(f"Đang đọc dòng {i+1}: {line.strip()}")
        
        # Tạo tệp âm thanh từ gTTS
        tts = gTTS(line.strip(), lang='vi')
        tts.save("temp.mp3")

        if not os.path.exists("temp.mp3"):
            print("Không tìm thấy tệp temp.mp3. Dừng quá trình.")
            return
        # Sử dụng pygame để phát âm thanh
        pygame.mixer.init()  # Khởi tạo pygame mixer
        sound = pygame.mixer.Sound("temp.mp3")
        sound.play()
        
        # Đợi cho đến khi âm thanh hoàn thành hoặc tạm dừng
        while pygame.mixer.get_busy():
            if not is_paused.is_set():
                print("Đang tạm dừng...")
                pygame.mixer.stop()  # Dừng phát âm thanh
                while not is_paused.is_set():  # Chờ đến khi tiếp tục
                    time.sleep(0.1)
                print("Tiếp tục phát âm thanh...")
                sound.play()  # Tiếp tục phát âm thanh
            if is_stopped:
                pygame.mixer.stop()
                os.remove("temp.mp3")
                return
            
            time.sleep(0.1)  # Đảm bảo không chạy vòng lặp quá nhanh
        
        os.remove("temp.mp3")  # Xóa file tạm
        time.sleep(delay)  # Thêm một khoảng dừng giữa các dòng

# Hàm đọc nội dung từ Google Drive
def doc_tu_drive(drive_link):
    try:
        # Lấy ID của file từ link Drive
        file_id = drive_link.split('/')[5]
        
        # Tạo URL tải xuống
        download_url = f'https://drive.google.com/uc?id={file_id}'
        
        # Tạo file tạm để lưu nội dung tải xuống
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
        temp_file.close()
        
        # Tải file từ Google Drive
        print("Đang tải file từ Google Drive...")
        gdown.download(download_url, temp_file.name, quiet=False)
        
        # Đọc nội dung file
        with open(temp_file.name, 'r', encoding='utf-8') as file:
            text = file.read()
        # Xóa file tạm sau khi đọc
        os.unlink(temp_file.name)
        
        return text
    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")

# Các hàm quản lý tạm dừng, tiếp tục và dừng
def pause_audio():
    global is_paused
    is_paused.clear()  # Tạm dừng âm thanh

def resume_audio():
    global is_paused
    is_paused.set()  # Tiếp tục phát âm thanh

def stop_audio():
    global is_stopped
    is_stopped = True  # Dừng hẳn âm thanh
