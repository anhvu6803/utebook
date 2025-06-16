import speech_recognition as sr
from flask_socketio import SocketIO

socketio = None  # sẽ được gán từ app

def set_socket(io):
    global socketio
    socketio = io


def clean_filler_words(text):
    # Danh sách các âm thừa phổ biến (bạn có thể bổ sung thêm)
    fillers = [
        "ờ", "ừ", "à", "ừm", "à ờ", "ờm", "ờ...", "ừ...", "à...",
        "ư...", "hừ", "ơ", "hmm", "ờ thì", "kiểu như", "kiểu kiểu"
    ]

    # Biến đổi về chữ thường, tách từ
    words = text.lower().split()

    # Loại bỏ những từ nằm trong danh sách âm thừa
    filtered_words = [word for word in words if word not in fillers]

    # Ghép lại câu sau khi lọc
    cleaned_text = ' '.join(filtered_words)

    return cleaned_text


def record_and_transcribe():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        if socketio:
            socketio.emit("start_recording", {"message": "🎤 Bắt đầu ghi âm, hãy nói gì đó!"})

        print("🎤 Nói gì đó (đang ghi âm)...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source, timeout=10)

        with open("my_voice.wav", "wb") as f:
            f.write(audio.get_wav_data())
        print("✅ Đã lưu file thành 'my_voice.wav'")

        try:
            text = recognizer.recognize_google(audio, language="vi-VN")
            cleaned_text = clean_filler_words(text)
            print(f"👂 Nói gì đó: {cleaned_text}")

            result = {"status": "success", "text": cleaned_text}
        except sr.UnknownValueError:
            result = {"status": "error", "message": "Không hiểu được bạn nói gì."}
        except sr.RequestError as e:
            result = {"status": "error", "message": f"Lỗi khi gửi yêu cầu: {e}"}

        if socketio:
            socketio.emit("result_text", result)
            socketio.emit("end_recording")

        return result
