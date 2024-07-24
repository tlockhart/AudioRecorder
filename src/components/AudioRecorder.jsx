import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import ChatHistory from './ChatHistory';
import '../App.css';

const secretKey = process.env.REACT_APP_OPEN_AI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
  dangerouslyAllowBrowser: true,
});

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const silenceTimeout = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioChunks.current = [];
        processAudio(audioBlob);
      };

      const audioInput = audioContext.current.createMediaStreamSource(stream);
      const analyser = audioContext.current.createAnalyser();
      audioInput.connect(analyser);

      const dataArray = new Uint8Array(analyser.fftSize);
      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        const isSilent = dataArray.every(value => value === 128);
        if (isSilent) {
          if (silenceTimeout.current) {
            clearTimeout(silenceTimeout.current);
          }
          silenceTimeout.current = setTimeout(() => setIsRecording(false), 5000);
        } else {
          if (silenceTimeout.current) {
            clearTimeout(silenceTimeout.current);
          }
        }
        if (isRecording) {
          requestAnimationFrame(checkSilence);
        }
      };
      requestAnimationFrame(checkSilence);

      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
  };

  const processAudio = async (audioBlob) => {
    const file = new File([audioBlob], 'output.wav', { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'text');

    try {
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
        body: formData,
      });

      const transcribedText = await transcriptionResponse.text();
      console.log(`>> You said: ${transcribedText}`);
      console.log("TRANSCRIPTION:", transcribedText);

      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant providing concise responses in at most two sentences.',
        },
        ...chatHistory,
        { role: 'user', content: transcribedText },
      ];

      const chatResponse = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-4',
      });

      const chatResponseText = chatResponse.choices[0].message.content;
      setChatHistory([...chatHistory, { role: 'user', content: transcribedText }, { role: 'assistant', content: chatResponseText }]);
      console.log(`>> Assistant said: ${chatResponseText}`);
      await playAudio(chatResponseText);
    } catch (error) {
      console.error('Error during transcription or chat:', error);
    }
  };

  const playAudio = async (text) => {
    const url = "https://api.openai.com/v1/audio/speech";
    const headers = {
      Authorization: `Bearer ${secretKey}`,
    };

    const data = {
      model: "tts-1",
      input: text,
      voice: "echo",
      response_format: "mp3",
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error in playAudio:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Voice Chat</h1>
        <button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <p>{isRecording ? 'Recording... Speak now!' : 'Press the button to start recording'}</p>
        <ChatHistory chatHistory={chatHistory} />
      </header>
    </div>
  );
};

export default AudioRecorder;
