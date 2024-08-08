import { AudioRecorder } from "react-audio-voice-recorder";
import styled from "styled-components";
import { useState } from "react";
import copyIcon from "/copy-icon.svg";

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

  const handleCopyClick = () => {
    // Create a temporary textarea element to hold the text
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = speechText;

    // Append the textarea to the body (it will not be visible)
    document.body.appendChild(tempTextArea);

    // Select the text in the textarea
    tempTextArea.select();

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Remove the temporary textarea element
    document.body.removeChild(tempTextArea);

    alert("Text copied to clipboard!");
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
        <div className="text-box">
          {speechText && <h2>{speechText}</h2>}
          {speechText && speechText !== "Loading..." && (
            <button onClick={handleCopyClick}>
              <img src={copyIcon} alt="copy icon" />
            </button>
          )}
        </div>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    button {
      background: none;
      border: none;

      &:hover {
        cursor: pointer;
      }

      img {
        width: 48px;
      }
    }
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
