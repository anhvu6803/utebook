# app.py
from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
from flask_socketio import SocketIO
from voice_to_text import record_and_transcribe, set_socket
import threading
import time

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
socketio = SocketIO(app, cors_allowed_origins="*")
set_socket(socketio)

loop_flags = {}

@socketio.on("connect")
def handle_connect():
    print("🟢 Client kết nối:", request.sid)
    loop_flags[request.sid] = False

@socketio.on("disconnect")
def handle_disconnect():
    print("🔌 Client ngắt kết nối:", request.sid)
    loop_flags.pop(request.sid, None)

@socketio.on("start_loop")
def handle_start_loop():
    sid = request.sid
    loop_flags[sid] = True

    def background_task():
        while loop_flags.get(sid, False):
            print(f"🎤 [SID: {sid}] Bắt đầu nhận diện giọng nói...")
            result = record_and_transcribe()
            socketio.emit("result_text", result, to=sid)
            time.sleep(1)  # nghỉ 1 giây giữa các lần

    threading.Thread(target=background_task).start()

@socketio.on("stop_loop")
def handle_stop_loop():
    sid = request.sid
    print(f"🛑 [SID: {sid}] Yêu cầu dừng vòng lặp.")
    loop_flags[sid] = False


@app.route("/api/voice-to-text", methods=["GET"])
def voice_api():
    def background_task():
        socketio.emit("status", {"message": "🎤 Đang khởi động nhận diện..."})
        result = record_and_transcribe()
        socketio.emit("result_text", result)

    t = threading.Thread(target=background_task)
    t.daemon = True
    t.start()

    return jsonify({"status": "pending", "message": "Đang xử lý..."})

if __name__ == "__main__":
    socketio.run(app, port=8080, debug=True)
