import { AudioRecorder } from "react-audio-voice-recorder";
import styled from "styled-components";
import { useState } from "react";

const SetPeriods = (paragraph) => {
  const paragraph1 = paragraph.replace(/ slash period/g, ".");
  return paragraph1.replace(/ \/ period/g, ".");
};

const SetCapital = (paragraph) => {
  let result = "";

  result += paragraph[0].toUpperCase();

  for (let i = 1; i < paragraph.length; i++) {
    if (
      i < paragraph.length - 2 &&
      paragraph[i] === "." &&
      paragraph[i + 1] === " "
    ) {
      result += ". ";
      result += paragraph[i + 2].toUpperCase();
      i += 2;
    } else {
      result += paragraph[i];
    }
  }

  return result;
};

const SpeechRecorder = () => {
  const [speechText, setSpeechText] = useState(null);

  const handleRecordFinish = async (blob) => {
    setSpeechText("Loading...");
    const response = await fetch("http://127.0.0.1:5000/api/upload", {
      method: "POST",
      body: blob,
    });

    const data = await response.json();

    const periodData = SetPeriods(data.text);
    const capitalData = SetCapital(periodData);

    setSpeechText(capitalData);
  };

  return (
    <StyledContainer>
      <h1>Voice to Text Recorder</h1>
      <AudioRecorder
        onRecordingComplete={handleRecordFinish}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
      />

      <div className="export-box">
        <h3>Analyzed text will go here:</h3>
        <div className="text-box">{speechText && <h2>{speechText}</h2>}</div>
      </div>
    </StyledContainer>
  );
};

export default SpeechRecorder;

const StyledContainer = styled.div`
  font-family: Roboto;
  h1 {
    margin: 0;
    font-weight: 900;
    letter-spacing: 2px;
    font-size: 40px;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }

  h2 {
    font-weight: 500;
    font-size: 20px;
    margin: 0;
  }

  h3 {
    font-size: 16px;
    margin: 0;
    margin-bottom: 10px;
    margin-left: 3px;
  }

  .text-box {
    width: 800px;
    border: 1px solid black;
    padding: 30px;
    border-radius: 10px;
    background: none;
  }

  .export-box {
  }

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;

  border: 1px solid black;

  padding: 120px 80px;
  border-radius: 10px;

  background: white;
`;
