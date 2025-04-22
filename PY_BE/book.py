import requests
from bs4 import BeautifulSoup
import os
import time
import pandas as pd
import glob
import re

# Hàm tạo thư mục nếu chưa tồn tại
def create_directory(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Đã tạo thư mục {directory}")

# Hàm để xử lý và lưu nội dung theo từng thẻ h3
def process_content_by_h3(content_area, book_dir, chapter_title):
    if not content_area:
        print(f"Không có nội dung để xử lý cho chương: {chapter_title}")
        return 0
    
    # Tìm tất cả các thẻ h3 trong content_area
    h3_tags = content_area.find_all('h3')
    
    # Nếu không có thẻ h3 nào, lưu toàn bộ nội dung vào một file
    if not h3_tags:
        print(f"Không tìm thấy thẻ h3 nào trong chương: {chapter_title}. Lưu toàn bộ nội dung.")
        formatted_content = ""
        
        # Xử lý các phần tử để lấy nội dung
        for element in content_area.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'br']):
            if element.name == 'div' and not element.get_text(strip=True):
                continue
                
            text = element.get_text(strip=True)
            if text:
                formatted_content += text + "\n\n"
        
        if not formatted_content:
            formatted_content = content_area.get_text(strip=True)
        
        # Lưu nội dung vào file
        safe_title = re.sub(r'[^\w\s-]', '_', chapter_title)
        filepath = f"{book_dir}/{safe_title}.txt"
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(formatted_content)
            print(f"Đã lưu nội dung vào file: {filepath}")
            return 1
        except Exception as e:
            print(f"Lỗi khi lưu file {filepath}: {e}")
            return 0
    
    # Nếu có các thẻ h3, tách nội dung theo từng thẻ h3
    saved_files = 0
    
    # Tạo thư mục con cho chương này nếu có nhiều phần
    chapter_dir = f"{book_dir}/{re.sub(r'[^\w\s-]', '_', chapter_title)}"
    create_directory(chapter_dir)
    
    # Lặp qua từng thẻ h3
    for i, h3 in enumerate(h3_tags):
        # Lấy tiêu đề từ h3
        section_title = h3.get_text(strip=True)
        if not section_title:
            section_title = f"Section_{i+1}"
        
        # Tìm nội dung cho phần này (từ h3 này đến h3 tiếp theo hoặc đến hết)
        content = []
        current = h3.next_sibling
        
        while current and (not isinstance(current, type(h3)) or current.name != 'h3'):
            if hasattr(current, 'get_text'):
                text = current.get_text(strip=True)
                if text:
                    content.append(text)
            elif isinstance(current, str) and current.strip():
                content.append(current.strip())
            
            if not hasattr(current, 'next_sibling'):
                break
            current = current.next_sibling
        
        # Nếu không tìm thấy nội dung, thử cách khác
        if not content:
            # Lấy tất cả các phần tử cho đến h3 tiếp theo
            next_h3 = h3.find_next('h3')
            current = h3.next_element
            
            while current and current != next_h3:
                if hasattr(current, 'get_text') and not current.name == 'h3':
                    text = current.get_text(strip=True)
                    if text and text != section_title:
                        content.append(text)
                elif isinstance(current, str) and current.strip():
                    content.append(current.strip())
                
                if not hasattr(current, 'next_element'):
                    break
                current = current.next_element
        
        # Tạo nội dung đã định dạng
        formatted_content = "\n\n".join(content)
        
        # Thêm tiêu đề vào đầu nội dung
        formatted_content = f"{section_title}\n\n{formatted_content}"
        
        # Tạo tên file an toàn
        safe_section_title = re.sub(r'[^\w\s-]', '_', section_title)
        filepath = f"{chapter_dir}/{safe_section_title}.txt"
        
        # Lưu nội dung vào file
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(formatted_content)
            print(f"Đã lưu phần: {section_title}")
            saved_files += 1
        except Exception as e:
            print(f"Lỗi khi lưu file {filepath}: {e}")
    
    return saved_files

# Hàm để lấy nội dung từ div zoomarea trong box-noidung và xử lý theo h3
def get_chapter_content(chapter_url, book_dir, chapter_title):
    try:
        # Gửi yêu cầu HTTP để tải trang của chương
        response = requests.get(chapter_url)
        response.raise_for_status()  # Kiểm tra lỗi HTTP
        
        # Phân tích nội dung HTML của trang
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Tìm phần chứa nội dung (div id="zoomarea")
        content_area = soup.find('div', id='zoomarea')
        
        # Nếu vẫn không tìm thấy, tìm trong box-noidung
        if not content_area:
            box_noidung = soup.find('div', class_='box-noidung')
            if box_noidung:
                content_area = box_noidung.find('div', id='zoomarea')
        
        # Xử lý nội dung theo thẻ h3
        if content_area:
            return process_content_by_h3(content_area, book_dir, chapter_title)
        else:
            print(f"Không tìm thấy phần nội dung zoomarea trong {chapter_url}")
            return 0
    except Exception as e:
        print(f"Lỗi khi lấy nội dung từ {chapter_url}: {e}")
        return 0

# Hàm để xử lý một truyện từ link chính của truyện
def process_book(book_url, book_title):
    try:
        print(f"\nĐang xử lý truyện: {book_title}")
        print(f"URL: {book_url}")
        
        # Tạo thư mục cho truyện
        book_dir = f"contents/{book_title}"
        create_directory(book_dir)
        
        # Gửi yêu cầu HTTP để tải trang
        response = requests.get(book_url)
        response.raise_for_status()
        
        # Phân tích nội dung HTML của trang
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Tìm tất cả các mục chương trong trang
        chapter_links = soup.find_all('a', class_='achuong')
        
        if not chapter_links:
            print("Không tìm thấy link chương nào. Kiểm tra lại selector.")
            return False
            
        print(f"Tìm thấy {len(chapter_links)} chương.")
        
        # Đếm số lượng chương đã xử lý và số section đã lưu
        processed_chapters = 0
        saved_sections = 0
        
        # Lặp qua từng link của các chương để lấy nội dung
        for i, link in enumerate(chapter_links):
            chapter_url = link['href']
            if not chapter_url.startswith('http'):
                # Thêm domain nếu URL là đường dẫn tương đối
                if chapter_url.startswith('/'):
                    chapter_url = 'https://audiosite.net' + chapter_url
                else:
                    base_url = '/'.join(book_url.split('/')[:-1])
                    chapter_url = f"{base_url}/{chapter_url}"
                
            chapter_title = link.text.strip()
            print(f"Đang xử lý chương {i+1}/{len(chapter_links)}: {chapter_title}")
            
            # Lấy và xử lý nội dung của chương theo các thẻ h3
            sections_saved = get_chapter_content(chapter_url, book_dir, chapter_title)
            
            if sections_saved > 0:
                processed_chapters += 1
                saved_sections += sections_saved
                print(f"Đã lưu {sections_saved} phần trong chương: {chapter_title}")
            else:
                print(f"Không lưu được nội dung nào cho chương: {chapter_title}")
            
            # Tạm dừng để tránh gửi quá nhiều request
            time.sleep(1)
        
        print(f"Tổng kết truyện {book_title}: Đã xử lý {processed_chapters}/{len(chapter_links)} chương, lưu {saved_sections} phần")
        return True
        
    except Exception as e:
        print(f"Lỗi khi xử lý truyện {book_title}: {e}")
        return False

# Hàm chính để đọc file Excel và xử lý
def main():
    try:
        # Tạo thư mục chính
        create_directory("contents")
        
        # Tìm file Excel trong thư mục hiện tại
        excel_files = glob.glob("Tien_hiep_data_detailed.xlsx")
        
        if not excel_files:
            print("Không tìm thấy file Excel (.xlsx) trong thư mục hiện tại!")
            return
        
        # Nếu có nhiều file Excel, cho người dùng chọn
        if len(excel_files) > 1:
            print("Tìm thấy nhiều file Excel:")
            for i, file in enumerate(excel_files):
                print(f"{i+1}. {file}")
            choice = input("Chọn số thứ tự file Excel muốn sử dụng: ")
            try:
                file_index = int(choice) - 1
                if 0 <= file_index < len(excel_files):
                    excel_file = excel_files[file_index]
                else:
                    print("Lựa chọn không hợp lệ.")
                    return
            except ValueError:
                print("Lựa chọn không hợp lệ.")
                return
        else:
            excel_file = excel_files[0]
            
        # Đọc dữ liệu từ file Excel
        print(f"Đang đọc file {excel_file}...")
        df = pd.read_excel(excel_file)
        
        # Kiểm tra các cột cần thiết
        required_columns = ['Link', 'Title']  # Điều chỉnh tên cột theo file Excel của bạn
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            print(f"Thiếu các cột sau trong file Excel: {', '.join(missing_columns)}")
            print(f"Các cột hiện có: {', '.join(df.columns)}")
            return
            
        # Xử lý từng truyện trong file Excel
        total_books = len(df)
        success_count = 0
        
        for i, row in df.iterrows():
            book_url = row['Link']
            book_title = row['Title']
            
            # Tạo tên thư mục an toàn từ tên truyện
            safe_book_title = re.sub(r'[^\w\s-]', '_', str(book_title))
            
            print(f"\nĐang xử lý truyện {i+1}/{total_books}: {book_title}")
            if process_book(book_url, safe_book_title):
                success_count += 1
            
            # Tạm dừng giữa các truyện để tránh quá tải server
            time.sleep(2)
            
        print(f"\nĐã hoàn tất! Xử lý thành công {success_count}/{total_books} truyện.")
        
    except Exception as e:
        print(f"Lỗi trong quá trình chạy: {e}")

if __name__ == "__main__":
    main()