import React, { useState, useEffect } from "react";
import "../styles.css"; 

const ToggleButton = ({
  showCoverage,
  setShowCoverage,
  showPopulation,
  setShowPopulation,
  showCounty,
  setShowCounty,
  setStateParty,
  setStateCandidate,
  setStatePartyAbs,
  setStateCandidateAbs,
  showNarrative,
  setShowNarrative
}) => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedOverlay, setSelectedOverlay] = useState("");
  const [selectedNarrative, setSelectedNarrative] = useState("");

  const handleButtonClick = (toggleFunction, currentState, toastMessage, narrativeNumber = null) => {
    if (narrativeNumber) {
      if (showNarrative && showNarrative !== narrativeNumber) {
        setToast({ message: "Cannot select a new narrative while another is active", visible: true });
        return;
      }
      setShowNarrative(currentState ? 0 : narrativeNumber);
    }
    toggleFunction(!currentState);
    setToast({ message: toastMessage, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast({ ...toast, visible: false }), 500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleMapSelection = (event) => {
    const map = event.target.value;
    setSelectedMap(map);

    setStateParty(false);
    setStateCandidate(false);
    setStatePartyAbs(false);
    setStateCandidateAbs(false);

    let toastMessage = "";

    switch (map) {
      case "statePartyRelative":
        setStateParty(true);
        toastMessage = "State Party Relative map selected";
        break;
      case "statePartyAbsolute":
        setStatePartyAbs(true);
        toastMessage = "State Party Absolute map selected";
        break;
      case "stateCandidateRelative":
        setStateCandidate(true);
        toastMessage = "State Candidate Relative map selected";
        break;
      case "stateCandidateAbsolute":
        setStateCandidateAbs(true);
        toastMessage = "State Candidate Absolute map selected";
        break;
      default:
        break;
    }

    if (toastMessage) {
      setToast({ message: toastMessage, visible: true });
    }
  };

  const handleOverlaySelection = (event) => {
    const overlay = event.target.value;
    setSelectedOverlay(overlay);

    switch (overlay) {
      case "showCoverage":
        handleButtonClick(setShowCoverage, showCoverage, showCoverage ? "Radio coverage removed" : "Radio coverage shown");
        break;
      case "showPopulation":
        handleButtonClick(setShowPopulation, showPopulation, showPopulation ? "Area population removed" : "Area population shown");
        break;
      case "showCounty":
        handleButtonClick(setShowCounty, showCounty, showCounty ? "County map removed" : "County map shown");
        break;
      default:
        break;
    }
    setSelectedOverlay("");
  };

  const handleNarrativeSelection = (event) => {
    const narrative = event.target.value;
    setSelectedNarrative(narrative);

    switch (narrative) {
      case "narrative1":
        handleButtonClick(() => {}, showNarrative === 1, 
          showNarrative === 1 ? "'Georgia Election Stolen' narrative markers removed" : "'Georgia Election Stolen' narrative markers shown",
          1);
        break;
      case "narrative2":
        handleButtonClick(() => {}, showNarrative === 2, 
          showNarrative === 2 ? "Narrative 2 removed" : "Narrative 2 shown",
          2);
        break;
      case "narrative3":
        handleButtonClick(() => {}, showNarrative === 3, 
          showNarrative === 3 ? "Narrative 3 removed" : "Narrative 3 shown",
          3);
        break;
      default:
        break;
    }
    setSelectedNarrative("");
  };

  const isNarrativeDisabled = (narrativeNumber) => {
    return showNarrative !== 0 && showNarrative !== narrativeNumber;
  };

  return (
    <div>
      {toast.visible && <div className="toast">{toast.message}</div>}

      <div className="dropdown-container" style={{ marginRight: "auto", float: "left" }}>
        <label htmlFor="mapDropdown"> Select Map: </label>
        <select
          id="mapDropdown"
          value={selectedMap}
          onChange={handleMapSelection}
          className="dropdown"
        >
          <option value="">--Select Map--</option>
          <option value="statePartyRelative">State Party - Relative</option>
          <option value="statePartyAbsolute">State Party - Absolute</option>
          <option value="stateCandidateRelative">State Candidate - Relative</option>
          <option value="stateCandidateAbsolute">State Candidate - Absolute</option>
        </select>
      </div>

      <div className="dropdown-container" style={{ right: "350px"}}>
        <label htmlFor="overlayDropdown"> Select Overlay: </label>
        <select
          id="overlayDropdown"
          value={selectedOverlay}
          onChange={handleOverlaySelection}
          className="dropdown"
        >
          <option value="">--Select Overlay--</option>
          <option value="showCoverage">{showCoverage ? "Remove Coverage" : "Show Coverage"}</option>
          <option value="showPopulation">{showPopulation ? "Remove Population" : "Show Population"}</option>
          <option value="showCounty">{showCounty ? "Remove County Map" : "Show County Map"}</option>
        </select>
      </div>

      <div className="dropdown-container" style={{ right: "650px"}}>
        <label htmlFor="narrativeDropdown"> Select Narrative: </label>
        <select
          id="narrativeDropdown"
          value={selectedNarrative}
          onChange={handleNarrativeSelection}
          className="dropdown"
        >
          <option value="">--Select Narrative--</option>
          <option value="narrative1" disabled={isNarrativeDisabled(1)}>
            {showNarrative === 1 ? "Remove 'Georgia Election Stolen'" : "Show 'Georgia Election Stolen'"}
          </option>
          <option value="narrative2" disabled={isNarrativeDisabled(2)}>
            {showNarrative === 2 ? "Remove Narrative 2" : "Show Narrative 2"}
          </option>
          <option value="narrative3" disabled={isNarrativeDisabled(3)}>
            {showNarrative === 3 ? "Remove Narrative 3" : "Show Narrative 3"}
          </option>
        </select>
      </div>
    </div>
  );
};

export default ToggleButton;
