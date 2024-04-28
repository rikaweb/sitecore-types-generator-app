// pages/index.js
"use client";
import { useState } from "react";
import { generateTypeDefinitions } from "./lib/generateTypes";

export default function Home() {
  const [baseName, setBaseName] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [typeOutput, setTypeOutput] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleGenerate = () => {
    try {
      const json = JSON.parse(jsonData);
      const types = generateTypeDefinitions(baseName, json);
      setTypeOutput(types);
      setCopySuccess(""); // Reset copy success message
    } catch (error) {
      console.log(error);
      setTypeOutput(`Error: ${error}`);
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(typeOutput).then(
        () => {
          setCopySuccess("Copied!");
          setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
        },
        () => {
          setCopySuccess("Failed to copy!");
        }
      );
    } else {
      setCopySuccess("Copy not supported in this browser.");
    }
  };

  return (
    <div className="flex flex-col h-screen  overflow-hidden">
      <h1 className="text-3xl font-bold text-center my-6">
        Sitecore JSS Next.js TypeScript Type Generator
      </h1>
      <div className="grid grid-cols-1  xl:grid-cols-12 gap-4 p-5 justify-center items-center xl:grow w-full max-w-screen-2xl mx-auto">
        <div className="xl:col-span-5 flex min-h-96 xl:min-h-full flex-col bg-gray-100 p-3 rounded overflow-auto ">
          <input
            type="text"
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            placeholder="Enter base type name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Enter JSON data here"
            className="w-full p-2 border border-gray-300 rounded grow"
          />
        </div>
        <div className="xl:col-span-2 flex items-center justify-center">
          <button
            onClick={handleGenerate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate Types
          </button>
        </div>
        <div
          className={` xl:col-span-5 min-h-96 xl:min-h-full relative bg-gray-100 p-3 rounded overflow-auto ${
            typeOutput.length < 1 && "invisible xl:visible"
          }`}
        >
          <div className="h-2 ">
            {typeOutput.length > 0 && (
              <button
                onClick={copyToClipboard}
                className="absolute top-0 right-0 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >
                {copySuccess || "Copy"}
              </button>
            )}
            <pre className="w-full p-2  ">{typeOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
