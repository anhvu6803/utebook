import webrtcvad
import collections
import pyaudio
import wave
import speech_recognition as sr

socketio = None  # sẽ được gán từ app

def set_socket(io):
    global socketio
    socketio = io

def clean_filler_words(text):
    fillers = [
        "ờ", "ừ", "à", "ừm", "à ờ", "ờm", "ờ...", "ừ...", "à...",
        "ư...", "hừ", "ơ", "hmm", "ờ thì", "kiểu như", "kiểu kiểu"
    ]
    words = text.lower().split()
    filtered_words = [word for word in words if word not in fillers]
    return ' '.join(filtered_words)

def record_vad(filename="my_voice.wav", timeout=10):
    vad = webrtcvad.Vad(2)
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    FRAME_DURATION = 30  # milliseconds
    FRAME_SIZE = int(RATE * FRAME_DURATION / 1000)
    NUM_FRAMES = int(RATE / FRAME_SIZE * timeout)

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE,
                    input=True, frames_per_buffer=FRAME_SIZE)

    ring_buffer = collections.deque(maxlen=int(1000 / FRAME_DURATION))
    triggered = False
    voiced_frames = []

    print("🎤 Chờ phát hiện tiếng nói...")
    if socketio:
        socketio.emit("start_recording", {"message": "🎤 Hãy nói gì đó!"})

    for i in range(NUM_FRAMES):
        frame = stream.read(FRAME_SIZE, exception_on_overflow=False)
        is_speech = vad.is_speech(frame, RATE)

        if not triggered:
            ring_buffer.append((frame, is_speech))
            if len([f for f, speech in ring_buffer if speech]) > 0.9 * ring_buffer.maxlen:
                triggered = True
                if socketio:
                    socketio.emit("voice_detected", {"message": "🗣️ Đang nói..."})
                voiced_frames.extend([f for f, _ in ring_buffer])
                ring_buffer.clear()
        else:
            voiced_frames.append(frame)
            ring_buffer.append((frame, is_speech))
            if len([f for f, speech in ring_buffer if not speech]) > 0.9 * ring_buffer.maxlen:
                break

    stream.stop_stream()
    stream.close()
    p.terminate()

    if socketio:
        socketio.emit("end_recording")

    if not voiced_frames:
        print("⚠️ Không phát hiện được tiếng nói.")
        return None

    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(voiced_frames))
    wf.close()

    print(f"✅ Đã lưu giọng nói thành {filename}")
    return filename

def record_and_transcribe():
    audio_path = record_vad()
    if not audio_path:
        result = {"status": "error", "message": "Không phát hiện được tiếng nói."}
        if socketio:
            socketio.emit("result_text", result)
        return result

    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio, language="vi-VN")
        cleaned_text = clean_filler_words(text)
        print(f"👂 Nội dung đã nói: {cleaned_text}")
        result = {"status": "success", "text": cleaned_text}
    except sr.UnknownValueError:
        result = {"status": "error", "message": "Không hiểu bạn nói gì."}
    except sr.RequestError as e:
        result = {"status": "error", "message": f"Lỗi khi gửi yêu cầu: {e}"}

    if socketio:
        socketio.emit("result_text", result)

    return result
