"use client";
import { useState, useEffect } from "react";

export default function Calculadora() {
  const [modeloActual, setModeloActual] = useState(null);
  const [operacion, setOperacion] = useState("suma"); // 'suma' o 'resta'
  const [valA, setValA] = useState("");
  const [valB, setValB] = useState("");
  const [resultado, setResultado] = useState(null);

    // Carga TensorFlow.js SOLO en cliente
  useEffect(() => {
    async function cargarTF() {
      const tfjs = await import("@tensorflow/tfjs");
      setTf(tfjs);
    }
    cargarTF();
  }, []);

  // Cargar el modelo cuando cambia la operación
  useEffect(() => {
    async function cambiarModelo() {
      setModeloActual(null);
      setResultado(null);

      const path =
        operacion === "suma"
          ? "/modelo_suma/model.json"
          : "/modelo_resta/model.json";

      try {
        const m = await tf.loadLayersModel(path);
        setModeloActual(m);
        console.log(`Modelo de ${operacion} cargado`);
      } catch (err) {
        console.error(err);
      }
    }
    cambiarModelo();
  }, [operacion]);

  const calcular = async () => {
    if (!modeloActual || valA === "" || valB === "") return;

    const input = tf.tensor2d([[parseFloat(valA), parseFloat(valB)]]);

    const prediccion = modeloActual.predict(input);
    const data = await prediccion.data();

    setResultado(data[0].toFixed(2));

    input.dispose();
    prediccion.dispose();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Calculadora Neuronal</h1>

      {/* Selector de operación */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setOperacion("suma")}
          className={`px-4 py-2 rounded ${
            operacion === "suma"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Suma (+)
        </button>

        <button
          onClick={() => setOperacion("resta")}
          className={`px-4 py-2 rounded ${
            operacion === "resta"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Resta (-)
        </button>
      </div>

      {/* Inputs */}
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <label className="block mb-2 font-semibold">Número A</label>
        <input
          type="number"
          value={valA}
          onChange={(e) => setValA(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Número B</label>
        <input
          type="number"
          value={valB}
          onChange={(e) => setValB(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={calcular}
          disabled={!modeloActual}
          className="w-full bg-green-500 text-white py-2 rounded mt-2 disabled:bg-gray-400"
        >
          {modeloActual ? "Calcular con IA" : "Cargando Modelo..."}
        </button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="mt-6 text-center bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">Resultado Predicho:</h2>
          <p className="text-3xl font-bold mt-2">{resultado}</p>
        </div>
      )}
    </div>
  );
}
