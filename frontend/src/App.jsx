import SpeechRecorder from "./page/SpeechRecorder.jsx";
import styled from "styled-components";

function App() {
  return (
    <StyledContainer>
      <SpeechRecorder />
    </StyledContainer>
  );
}

export default App;

const StyledContainer = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf9f6;
`;
