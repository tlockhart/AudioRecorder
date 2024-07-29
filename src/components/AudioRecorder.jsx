import React, { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import ChatHistoryAudio from "./ChatHistoryAudio";
import ChatHistoryText from "./ChatHistoryText";
// import '../App.css';

const secretKey = process.env.REACT_APP_OPEN_AI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
  dangerouslyAllowBrowser: true,
});

/**
 * AudioRecorder component.
 *
 * This component handles audio recording, transcription using OpenAI Whisper,
 * and conversation handling with OpenAI GPT-4. It also displays the chat history
 * in a separate component.
 */
const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false); // Recording state
  const [chatHistory, setChatHistory] = useState([]); // Chat history
  const [silenceDuration, setSilenceDuration] = useState(5000); // Silence duration in milliseconds
  const [isTextMode, setIsTextMode] = useState(true); // Toggle state for chat mode
  const audioChunks = useRef([]); // Stores audio data chunks
  const mediaRecorder = useRef(null); // MediaRecorder instance
  const audioContext = useRef(null); // Audio context
  const silenceTimeout = useRef(null); // Timeout for silence detection

  // Effect hook to start or stop recording based on isRecording state
  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
    };
  }, [isRecording]);

  // useEffect(()=>{

  // }, [isTextMode]);

  /**
   * Starts audio recording.
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioChunks.current = [];
        processAudio(audioBlob);
      };

      const audioInput = audioContext.current.createMediaStreamSource(stream);
      const analyser = audioContext.current.createAnalyser();
      audioInput.connect(analyser);

      const dataArray = new Uint8Array(analyser.fftSize);
      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        const isSilent = dataArray.every((value) => value === 128);
        if (isSilent) {
          if (silenceTimeout.current) {
            clearTimeout(silenceTimeout.current);
          }
          silenceTimeout.current = setTimeout(
            () => setIsRecording(false),
            silenceDuration
          );
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
      console.error("Error accessing microphone:", error);
    }
  };

  /**
   * Stops audio recording.
   */
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  };

  /**
   * Processes the recorded audio by sending it to OpenAI's Whisper API for transcription.
   * @param {Blob} audioBlob - The recorded audio blob.
   */
  const processAudio = async (audioBlob) => {
    const file = new File([audioBlob], "output.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");

    try {
      const transcriptionResponse = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
          body: formData,
        }
      );

      const transcribedText = await transcriptionResponse.text();
      console.log(`>> You said: ${transcribedText}`);
      console.log("TRANSCRIPTION:", transcribedText);

      const messages = [
        {
          role: "system",
          content:
            "You are a helpful assistant providing concise responses in at most two sentences.",
        },
        ...chatHistory,
        { role: "user", content: transcribedText },
      ];

      const chatResponse = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4",
      });

      const chatResponseText = chatResponse.choices[0].message.content;
      setChatHistory([
        ...chatHistory,
        { role: "user", content: transcribedText },
        { role: "assistant", content: chatResponseText },
      ]);
      console.log(`>> Assistant said: ${chatResponseText}`);
      await playAudio(chatResponseText);
    } catch (error) {
      console.error("Error during transcription or chat:", error);
    }
  };

    /**
   * Processes the text input by sending it to OpenAI's GPT-4 API for a response.
   * @param {string} userInput - The text input from the user.
   */
    const processText = async (userInput) => {
      try {
        console.log(`>> You typed: ${userInput}`);
        const messages = [
          {
            role: 'system',
            content: 'You are a helpful assistant providing concise responses in at most two sentences.',
          },
          ...chatHistory,
          { role: 'user', content: userInput },
        ];
  
        const chatResponse = await openai.chat.completions.create({
          messages: messages,
          model: 'gpt-4',
        });
  
        const chatResponseText = chatResponse.choices[0].message.content;
        setChatHistory([
          ...chatHistory,
          { role: 'user', content: userInput },
          { role: 'assistant', content: chatResponseText },
        ]);
        console.log(`>> Assistant typed: ${chatResponseText}`);
        // await playAudio(chatResponseText);
      } catch (error) {
        console.error('Error during chat:', error);
      }
    };

  /**
   * Plays the audio response using OpenAI's Text-to-Speech API.
   * @param {string} text - The text to convert to speech.
   */
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error("Error in playAudio:", error);
    }
  };

  const handleSendMessage = (message) => {
      console.log("Message:", message);
      processText(message)
      // setIsRecording(!isRecording);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Voice Chat</h1>
        <button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <p>
          {isRecording
            ? "Recording... Speak now!"
            : "Press the button to start recording"}
        </p>
        <label>
          Silence Duration (ms):
          <input
            type="number"
            value={silenceDuration}
            onChange={(e) => setSilenceDuration(Number(e.target.value))}
          />
        </label>
        <button onClick={() => setIsTextMode(!isTextMode)}>
          {isTextMode ? "Switch to Audio Mode" : "Switch to Text Mode"}
        </button>
        {isTextMode ? (
          <ChatHistoryText
            sendMessage={handleSendMessage}
            chatHistory={chatHistory}
          />
        ) : (
          <ChatHistoryAudio chatHistory={chatHistory} />
        )}
      </header>
    </div>
  );
};

export default AudioRecorder;
