import React from 'react';
import "../styles.css";

export const StatePartyTooltip = ({
  stateParty,
  stateCandidate,
  statePartyAbs,
  stateCandidateAbs,
  sentimentTooltip,
  stateName,
  getPartySentimentData,
  getPartyCountsData,
  getPartyPositiveData,
  getPartyNeutralData,
  getPartyNegativeData
}) => {
  return (
    (stateParty || statePartyAbs) && !stateCandidate && !stateCandidateAbs && 
    sentimentTooltip && (
      <div
        className="data-tooltip"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            marginBottom: '5px',
            fontSize: '18px',
            alignItems: 'center',
            textAlign: 'center'
          }}>
          {stateName}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Sentiment: {getPartySentimentData()}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Positive Count: {getPartyPositiveData()}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Neutral Count: {getPartyNeutralData()}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Negative Count: {getPartyNegativeData()}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          Total Count: {getPartyCountsData()}
        </div>
      </div>
    )
  );
};

export const StateCandidateTooltip = ({
  stateParty,
  stateCandidate,
  statePartyAbs,
  stateCandidateAbs,
  sentimentTooltip,
  stateName,
  getCandidateSentimentData,
  getCandidateCountsData,
  getCandidatePositiveData,
  getCandidateNeutralData,
  getCandidateNegativeData
}) => {
  return (
    (stateCandidate || stateCandidateAbs) && !stateParty && !statePartyAbs && 
    sentimentTooltip && (
      <div
        className="data-tooltip"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            marginBottom: '5px',
            fontSize: "18px",
            alignItems: 'center',
            textAlign: 'center'
          }}>
          {stateName}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Sentiment: {getCandidateSentimentData()}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Positive Count: {getCandidatePositiveData()}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Neutral Count: {getCandidateNeutralData()}
        </div>
        <div style={{ marginBottom: '5px', whiteSpace: 'nowrap' }}>
          Negative Count: {getCandidateNegativeData()}
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          Total Count: {getCandidateCountsData()}
        </div>
      </div>
    )
  );
};

export const CountyTooltip = ({
  countyTooltip,
  tooltipPosition
}) => {
  return (
    countyTooltip && (
      <div
        className="county-tooltip"
        style={{
          position: 'fixed',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {countyTooltip}
      </div>
    )
  );
};
