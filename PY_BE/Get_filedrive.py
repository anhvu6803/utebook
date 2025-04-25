import requests
import tempfile
import os

def doc_tu_drive(drive_link):
    try:
        # Lấy ID của file từ link Drive
        file_id = drive_link.split('/')[5]

        # Tạo file tạm để lưu nội dung tải xuống
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
        temp_file.close()

        # Tạo URL tải xuống
        download_url = f'https://drive.google.com/uc?id={file_id}'

        # Tải file từ Google Drive sử dụng requests
        print("Đang tải file từ Google Drive...")
        session = requests.Session()
        
        # Truy cập URL tải xuống
        response = session.get(download_url, stream=True)
        
        # Kiểm tra nếu có trang xác nhận tải xuống (đối với file lớn)
        for key, value in response.cookies.items():
            if key.startswith('download_warning'):
                download_url = f"{download_url}&confirm={value}"
                response = session.get(download_url, stream=True)
                break
        
        # Lưu nội dung vào file tạm
        with open(temp_file.name, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        
        # Đọc nội dung file
        with open(temp_file.name, 'r', encoding='utf-8') as file:
            text = file.read()

        # Xóa file tạm sau khi đọc
        os.unlink(temp_file.name)

        return text

    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
        return None