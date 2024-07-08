import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import "./global.css"
import AssessmentABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

const nameAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function HomePage() {
  // Property Variables

  const [message, setMessage] = useState("");
  const [currentNaming, setCurrentNaming] = useState("");

  // Requests access to the user's Meta Mask Account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchNaming() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        nameAddress,
        AssessmentABI.abi,
        provider
      );
      try {
        const data = await contract.name();
        console.log("data: ", data);
        setCurrentNaming(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function setNaming() {
    if (!message) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nameAddress,
        AssessmentABI.abi,
        signer
      );

      try {
        const transaction = await contract.setNaming(message);
        setMessage("");
        await transaction.wait();
        fetchNaming();
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  return (
    <div
      className="bg-neutral-900 h-screen p-2 flex flex-col justify-center items-center"
    >
      <div className="App-header">
        {/* DESCRIPTION  */}
        <div className="description text-4xl font-semibold text-white py-10">
          <h1>Hello, Crafter!</h1>
          <h2>Smart Contract Management</h2>
          <h3>Project: Function Frontend</h3>
        </div>
        {/* BUTTONS - Fetch and Set */}
        <div className="space-y-3">

          <div className="flex justify-center items-center gap-5">
            <button
              onClick={fetchNaming}
              className="w-1/2 border border-white py-6 rounded-xl bg-white"

            >
              Fetch Names
            </button>
            <button
              onClick={setNaming}
              className="py-6 w-1/2 rounded-xl bg-red-700 border "
            >
              Set Names
            </button>
          </div>
          {/* INPUT TEXT - String  */}
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Set Naming Message"
            className="w-full py-6 rounded-xl border-2 border-neutral-900 px-7"
          />

          {/* Current Value stored on Blockchain */}
          <h2
            className="naming"
            style={{
              padding: "20px",
              backgroundColor: "white",
              color: "green",
              border: "3px solid black",
              borderRadius: "10px",
              justifyContent: "center",
            }}
          >
            Names: {currentNaming}
          </h2>
        </div>
      </div>
    </div>
  );
}
