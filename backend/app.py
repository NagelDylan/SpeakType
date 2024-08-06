from flask import Flask, jsonify, request
from flask_cors import CORS
from moviepy.editor import AudioFileClip
import speech_recognition

app = Flask(__name__)
CORS(app)

def speech_to_text(filename):
    recognizer = speech_recognition.Recognizer()

    input_path = 'recording.webm'
    output_path = 'recording.wav'

    audio_clip = AudioFileClip(input_path)
    audio_clip.write_audiofile(output_path)

    audio_clip.close()

    with speech_recognition.AudioFile("recording.wav") as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data)
        return text
    except speech_recognition.UnknownValueError:
        print("Google Speech Recognition could not understand audio\n")
    except speech_recognition.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}\n")
    return ""

@app.route('/api/upload', methods=['POST'])
def upload_audio():
    if not request.data:
        return jsonify({"error": "No data received"}), 400
    
    with open("./recording.webm", "wb") as audio_file:
        audio_file.write(request.data)

    return jsonify({"text": speech_to_text("recording.webm")})

if __name__ == '__main__':
    app.run(debug=True)
