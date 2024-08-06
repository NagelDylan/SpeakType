import pyaudio
import wave
import speech_recognition
import os
from pynput.keyboard import Controller

def record_audio(filename, duration, sample_rate=44100, channels=1, chunk_size=1024):
    audio = pyaudio.PyAudio()

    stream = audio.open(format=pyaudio.paInt16, channels=channels, rate=sample_rate, input=True, frames_per_buffer=chunk_size)

    frames = []
    
    for _ in range(0, int(sample_rate / chunk_size * duration)):
        data = stream.read(chunk_size)
        frames.append(data)
        if( _ % int(sample_rate / chunk_size) == 0):
            print(f"Recording up until {duration} seconds: {int(_ / int(sample_rate / chunk_size))}",)


    stream.stop_stream()
    stream.close()
    audio.terminate()

    sound_file = wave.open(filename, "wb")
    sound_file.setnchannels(channels)
    sound_file.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
    sound_file.setframerate(sample_rate)
    sound_file.writeframes(b''.join(frames))
    sound_file.close()

def speech_to_text(filename):
    recognizer = speech_recognition.Recognizer()

    with speech_recognition.AudioFile(filename) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data)
        return text
    except speech_recognition.UnknownValueError:
        print("Google Speech Recognition could not understand audio\n")
    except speech_recognition.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}\n")
    return ""

def type_text(text):
    keyboard = Controller()
    for char in text:
        keyboard.type(char)

rec_time = input("How many seconds would you like to record: ")

record_audio('output.wav', int(rec_time))
text = speech_to_text('output.wav')
type_text(text)