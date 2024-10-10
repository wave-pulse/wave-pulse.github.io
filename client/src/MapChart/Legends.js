import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles.css';

export const partyMap = {
  1: "#9999ff", // Democrats < 5
  2: "#ff9999", // Republicans < 5
  3: "#0000FF", // Democrats > 5
  4: "#FF0000", // Republicans > 5
  5: "#666666", // Democrats = Republicans
};

export const partyMapAbsolute = {
  1: "#9999ff", // Democrats < 5
  2: "#ff9999", // Republicans < 5
  3: "#9999ff", // Democrats > 5
  4: "#ff9999", // Republicans > 5
  5: "#666666", // Democrats = Republicans
};

export const candidateMap = {
  1: "#99CC99", // Biden < 5 
  2: "#9999ff", // Harris < 5
  3: "#ff9999", // Trump < 5
  4: "#006400", // Biden > 5
  5: "#0000FF", // Harris > 5
  6: "#FF0000", // Trump > 5
  7: "#666666", // Equal preference
};

export const candidateMapAbsolute = {
  1: "#99CC99", // Biden < 5 
  2: "#9999ff", // Harris < 5
  3: "#ff9999", // Trump < 5
  4: "#99CC99", // Biden > 5
  5: "#9999ff", // Harris > 5
  6: "#ff9999", // Trump > 5
  7: "#666666", // Equal preference
};

const InfoIcon = ({ toggleExplanation, isActive }) => (
  <FontAwesomeIcon
    icon={faInfoCircle}
    className={`info-icon ${isActive ? 'active' : ''}`}
    onClick={toggleExplanation}
  />
);

const Explanation = ({ text }) => (
  <div className="explanation">
    {text}
  </div>
);

const LegendHeader = ({ title, isOpen, toggleLegend, toggleExplanation, isExplanationVisible }) => (
  <div className="legend-header" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
    <div onClick={toggleExplanation}>
      <InfoIcon isActive={isExplanationVisible} />
    </div>
    <div onClick={toggleLegend} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <span style={{ marginLeft: '8px' }}>{isOpen ? '▼' : '▲'}</span>
    </div>
  </div>
);

const LegendContent = ({ legendData }) => (
  <div className="legend-content">
    {legendData.map((item, index) => (
      <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <span
          className="legend-color"
          style={{ backgroundColor: item.color, width: '20px', height: '20px', marginRight: '8px' }}
        ></span>
        <span className="legend-label">{item.label}</span>
      </div>
    ))}
  </div>
);

const Legend = ({ title, categoryLabels, displayOrder, colorMap, explanationText }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleLegend = () => setIsOpen(!isOpen);
  const toggleExplanation = () => setShowExplanation(!showExplanation);

  const legendData = displayOrder.map(key => ({
    label: categoryLabels[key - 1],
    color: colorMap[key]
  }));

  return (
    <div className="legend">
      {showExplanation && <Explanation text={explanationText} />}
      <LegendHeader
        title={title}
        isOpen={isOpen}
        toggleLegend={toggleLegend}
        toggleExplanation={toggleExplanation}
        isExplanationVisible={showExplanation}
      />
      {isOpen && <LegendContent legendData={legendData} />}
    </div>
  );
};

const StatePartyLegend = () => (
  <Legend
    title="Preferred Party"
    categoryLabels={[
      "Democrats (slightly preferred)",
      "Republicans (slightly preferred)",
      "Democrats (strongly preferred)",
      "Republicans (strongly preferred)",
      "Equal preference"
    ]}
    displayOrder={[1, 3, 2, 4, 5]}
    colorMap={partyMap}
    explanationText="This map shows the normalized maximum positive sentiment score between both parties, 
    'Democrats' and 'Republicans', across any given state.
    The positive sentiment score ranges from 0% to 100% and the normalized positive sentiment score ranges from 0 to 1.
    'Strongly preferred' indicates that the difference between the normalized positive sentiment score of the 
    highest scored party and second highest is more than 5%, 
    while 'slightly preferred' means that the difference is less than or equal to 5%.
    'Equal preference' means that both parties have the same normalized positive sentiment score."
  />
);

const StatePartyAbsLegend = () => (
  <Legend
    title="Preferred Party"
    categoryLabels={[
      "Democrats", 
      "Republicans", 
      "", "", 
      "Equal preference"
    ]}
    displayOrder={[1, 2, 5]}
    colorMap={partyMapAbsolute}
    explanationText="This map shows the normalized maximum positive sentiment score between both parties, 
    'Democrats' and 'Republicans', across any given state. 
    The positive sentiment score ranges from 0% to 100% and the normalized positive sentiment score ranges from 0 to 1.
    'Equal preference' means that both parties have the same normalized positive sentiment score."
  />
);

const StateCandidateLegend = () => (
  <Legend
    title="Preferred Candidate"
    categoryLabels={[
      "Biden (slightly preferred)",
      "Harris (slightly preferred)",
      "Trump (slightly preferred)",
      "Biden (strongly preferred)",
      "Harris (strongly preferred)",
      "Trump (strongly preferred)",
      "Equal preference"
    ]}
    displayOrder={[1, 4, 2, 5, 3, 6, 7]}
    colorMap={candidateMap}
    explanationText="This map shows the maximum positive sentiment score amongst the candidates - 
    'Biden', 'Harris', and 'Trump' - across any given state.
    The positive sentiment ranges score from 0% to 100%.
    'Strongly preferred' indicates that the difference between the positive sentiment score of the highest scored candidate and second highest is more than 5%, 
    while 'slightly preferred' means that the difference is less than or equal to 5%.
    'Equal preference' means that any two of the three candidates have the same positive sentiment score."
  />
);

const StateCandidateAbsLegend = () => (
  <Legend
    title="Preferred Candidate"
    categoryLabels={[
      "Biden", 
      "Harris", 
      "Trump",
      "", "", "",
      "Equal preference"
    ]}
    displayOrder={[1, 2, 3, 7]}
    colorMap={candidateMapAbsolute}
    explanationText="This map shows the maximum positive sentiment score amongst the candidates - 
    'Biden', 'Harris', and 'Trump' - across any given state.
    The positive sentiment ranges from 0% to 100%.
    'Equal preference' means that any two of the three candidates have the same positive sentiment score."
  />
);

export {
  StatePartyLegend,
  StateCandidateLegend,
  StatePartyAbsLegend,
  StateCandidateAbsLegend
};
