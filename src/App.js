import logo from "./logo.svg";
import { React, useState, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

function App() {
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  const loadModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT");
    console.log("Model loaded");
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());
    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  useEffect(() => {
    loadModel();
  }, []);

  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const recognizeCommands = async () => {
    console.log("Listening...");
    model.listen(
      (result) => {
        console.log(result);
        setAction(labels[argMax(Object.values(result.scores))]);
        console.log(action);
      },
      { includeSpectrogram: true, probabilityThreshold: 0.75 }
    );
    // setTimeout(() => {
    //   model.stopListening();
    // }, 10e3);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Your Wish Is My Command</h1>
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={recognizeCommands}>Recognize</button>
        <h3>{action ? action : "I can't hear you yet"}</h3>
      </header>
    </div>
  );
}

export default App;
