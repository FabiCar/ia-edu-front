import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (keyword && keyword.length > 0) {
      const debounceTimer = setTimeout(async () => {
        try {
          const response = await axios.post("http://149.50.137.171:3000/chat", { prompt: keyword });
          setResponse(response?.data?.audio);
        } catch (error) {
          console.error("❌ Error enviando el audio:", error);
        }
      }, 3000);
      return () => clearTimeout(debounceTimer);
    }
  }, [keyword]);

  // 📌 Función para iniciar la grabación y transcribir voz a texto
  const startListening = () => {
    // 📌 Declaramos el tipo manualmente
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("❌ Tu navegador no soporta reconocimiento de voz.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES"; // 📌 Configuramos español
    recognition.interimResults = true;
    recognition.continuous = false;
  
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setKeyword(transcript);
    };
  
    recognition.onerror = (event: any) => {
      console.error("❌ Error en reconocimiento de voz:", event);
      setIsListening(false);
    };
  
    recognition.onend = () => {
      setIsListening(false);
    };
  
    recognition.start();
  };

  return (
    <div className="App">
      <h2>🎤 Habla y envía tu mensaje</h2>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? "🎙 Escuchando..." : "🎤 Presiona para hablar"}
      </button>

      <p><strong>Lo que dijiste:</strong> {keyword || "Esperando..."}</p>

      {response && (
        <Fragment>
          <p><strong>Respuesta en audio:</strong></p>
          <audio src={"http://localhost:3000" + response} controls autoPlay />
        </Fragment>
      )}
    </div>
  );
}

export default App;
