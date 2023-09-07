import React, { useState } from "react";
import "./App.css";
import SegmentPopup from "../src/segement/SegmentPopup";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [buttonPosition, setButtonPosition] = useState("center");

  const togglePopup = () => {
    setShowPopup(!showPopup);

    // Update the button position
    if (buttonPosition === "center") {
      setButtonPosition("center-left");
    } else {
      setButtonPosition("center");
    }
  };

  return (
    <div className="App">
      <button
        className={`save-segment-button ${buttonPosition}`}
        onClick={togglePopup}
      >
        Save segment
      </button>
      {showPopup && <SegmentPopup onClose={togglePopup} />}
    </div>
  );
}

export default App;
