import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from text_to_speech import doc_theo_dong, pause_audio, resume_audio, stop_audio, get_is_reading
from Get_filedrive import doc_tu_drive
from threading import Thread

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins=["http://localhost:5173"] )

# API để đọc văn bản từ Google Drive
@app.route('/api/get_drive', methods=['POST'])
def doc_tu_drive_api():
    try:
        # Nhận dữ liệu từ yêu cầu
        data = request.get_json()
        drive_link = data.get('drive_link', '')
        
        if not drive_link:
            return jsonify({'error': 'Link Google Drive không hợp lệ'}), 400
        
        # Gọi hàm xử lý văn bản từ Google Drive và lấy kết quả
        text = doc_tu_drive(drive_link)
        
        if text is None:
            return jsonify({'error': 'Không thể tải file từ Google Drive'}), 500
        
        # Trả về kết quả dưới dạng JSON
        return jsonify({'text': text}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/speech_line', methods=['POST'])
def doc_theo_dong_api():
    try:
        # Nhận dữ liệu từ yêu cầu
        data = request.get_json()
        text = data.get('text', [])
        delay = data.get('delay', 0.2)
        
        if not text:
            return jsonify({'error': 'Văn bản không hợp lệ'}), 400
        
        # Gọi hàm đọc theo dòng trong một thread riêng
        thread = Thread(target=doc_theo_dong, args=(text, delay, socketio))
        thread.start()
        
        return jsonify({'message': 'Đọc văn bản theo dòng thành công'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# API để pause âm thanh
@app.route('/api/speech/pause', methods=['POST'])
def pause_audio_api():
    try:
        pause_audio()
        return jsonify({'message': 'Đã tạm dừng'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API để resume âm thanh
@app.route('/api/speech/resume', methods=['POST'])
def resume_audio_api():
    try:
        resume_audio()
        return jsonify({'message': 'Tiếp tục phát âm thanh'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API để stop âm thanh
@app.route('/api/speech/stop', methods=['POST'])
def stop_audio_api():
    try:
        stop_audio()
        return jsonify({'message': 'Đã dừng'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/speech/get_reading', methods=['GET'])
def get_reading():
    try:
        return jsonify({'reading': get_is_reading()}), 200
    except Exception as e:
            return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3000)