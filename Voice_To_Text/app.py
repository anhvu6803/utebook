# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import threading
from voice_to_text import record_and_transcribe, set_socket

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# SocketIO setup
socketio = SocketIO(app, cors_allowed_origins="*")
set_socket(socketio)  # Gán socket vào voice_handler

@app.route("/api/voice-to-text", methods=["GET"])
def voice_api():
    def background_task():
        result = record_and_transcribe()
        socketio.emit("result_text", result)

    threading.Thread(target=background_task).start()
    return jsonify({"status": "pending", "message": "Đang xử lý..."})

if __name__ == "__main__":
    socketio.run(app, port=8080, debug=True)
