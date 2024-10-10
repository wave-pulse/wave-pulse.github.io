import React, { useEffect, useState } from "react";
import { Geographies, Geography } from "react-simple-maps";
import { partyMap, candidateMap, partyMapAbsolute, candidateMapAbsolute } from './Legends';
import axios from 'axios';
import "../styles.css";

const geoUrlCounties = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
const geoUrlStates = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const countyCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/county-data/';
const stateCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/state-data/';

const GeographiesMap = ({ 
  setTooltipContent, 
  setTooltipPosition, 
  setSentimentTooltip, 
  setStateData, 
  setCountyTooltip,
  stateParty,
  stateCandidate,
  statePartyAbs,
  stateCandidateAbs,
  selectedFromDate,
  selectedToDate,
  showCounty
}) => {

  const [countyData, setCountyData] = useState([]);
  const [stateSentiment, setStateSentiment] = useState();
  const [hoveredCountyId, setHoveredCountyId] = useState(null);
  const [activeGeoId, setActiveGeoId] = useState(null); 

  const formatDateToYMD = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };  

  useEffect(() => {
    Promise.all([
      axios.get(stateCSV),
      axios.get(countyCSV)
    ])
      .then(([stateResponse, countyResponse]) => {
        setStateData(stateResponse.data);
        setCountyData(countyResponse.data);
      })
      .catch(error => {
        console.error('Error fetching state or county data:', error);
      });
  }, [setStateData]);  

  useEffect(() => {
    setTooltipContent('');
    setSentimentTooltip(false);
    setHoveredCountyId(null);
    setActiveGeoId(null);
    setCountyTooltip('');
  
    const fromDate = formatDateToYMD(selectedFromDate);
    const toDate = formatDateToYMD(selectedToDate);
    const stateUrl = `https://wave-pulse-o5tct.ondigitalocean.app/api/state-sentiment/${fromDate}/${toDate}/`;
    axios.get(stateUrl)
      .then(stateResponse => {
        setStateSentiment(stateResponse.data);
      })
      .catch(error => {
        console.error('Error fetching sentiment data:', error);
      });
  }, [stateParty, stateCandidate, statePartyAbs, stateCandidateAbs, 
    setCountyTooltip, setSentimentTooltip, setTooltipContent,
    selectedFromDate, selectedToDate ]);  

  useEffect(() => {
    if (stateSentiment && activeGeoId && (stateParty || statePartyAbs || stateCandidate || stateCandidateAbs)) {
      const activeGeoIdAsInt = parseInt(activeGeoId);
      const state = stateSentiment.Sentiment.find(state => state.ID === activeGeoIdAsInt);

      const {
        State: name = state.State,
        Biden_Combined_Sentiment = 0,
        Biden_Positive_Count = 0,
        Biden_Neutral_Count = 0,
        Biden_Negative_Count = 0,
        Biden_Count = 0,
        Harris_Combined_Sentiment = 0,
        Harris_Positive_Count = 0,
        Harris_Neutral_Count = 0,
        Harris_Negative_Count = 0,
        Harris_Count = 0,
        Trump_Combined_Sentiment = 0,
        Trump_Positive_Count = 0,
        Trump_Neutral_Count = 0,
        Trump_Negative_Count = 0,
        Trump_Count = 0,
        Democrats_Combined_Sentiment = 0,
        Democrats_Positive_Count = 0,
        Democrats_Neutral_Count = 0,
        Democrats_Negative_Count = 0,
        Democrats_Count = 0,
        Republicans_Combined_Sentiment = 0,
        Republicans_Positive_Count = 0,
        Republicans_Neutral_Count = 0,
        Republicans_Negative_Count = 0,
        Republicans_Count = 0,
      } = state || {};

      const tooltipContent = `
        ${name};
        ${Biden_Combined_Sentiment}%; 
        ${Harris_Combined_Sentiment}%;
        ${Trump_Combined_Sentiment}%;
        ${Democrats_Combined_Sentiment}%;
        ${Republicans_Combined_Sentiment}%;
        ${Biden_Count};
        ${Harris_Count};
        ${Trump_Count};
        ${Democrats_Count};
        ${Republicans_Count};
        ${Biden_Positive_Count};
        ${Harris_Positive_Count};
        ${Trump_Positive_Count};
        ${Democrats_Positive_Count};
        ${Republicans_Positive_Count};
        ${Biden_Neutral_Count};
        ${Harris_Neutral_Count};
        ${Trump_Neutral_Count};
        ${Democrats_Neutral_Count};
        ${Republicans_Neutral_Count};
        ${Biden_Negative_Count};
        ${Harris_Negative_Count};
        ${Trump_Negative_Count};
        ${Democrats_Negative_Count};
        ${Republicans_Negative_Count};
      `;      
      setTooltipContent(tooltipContent); 
    }
  }, [stateSentiment, activeGeoId, selectedFromDate, selectedToDate, setTooltipContent,
    stateParty, statePartyAbs, stateCandidate, stateCandidateAbs]);
    
  const handleStateClick = (event, geo) => {
    const state = stateSentiment.Sentiment.find(state => state.ID === parseInt(geo.id));
    if (!state) {
      console.error('No state data found for:', geo.properties.name);
      return;
    }

    const {
      State: name = state ? state.State : geo.properties.name,
      Biden_Combined_Sentiment = 0,
      Biden_Positive_Count = 0,
      Biden_Neutral_Count = 0,
      Biden_Negative_Count = 0,
      Biden_Count = 0,
      Harris_Combined_Sentiment = 0,
      Harris_Positive_Count = 0,
      Harris_Neutral_Count = 0,
      Harris_Negative_Count = 0,
      Harris_Count = 0,
      Trump_Combined_Sentiment = 0,
      Trump_Positive_Count = 0,
      Trump_Neutral_Count = 0,
      Trump_Negative_Count = 0,
      Trump_Count = 0,
      Democrats_Combined_Sentiment = 0,
      Democrats_Positive_Count = 0,
      Democrats_Neutral_Count = 0,
      Democrats_Negative_Count = 0,
      Democrats_Count = 0,
      Republicans_Combined_Sentiment = 0,
      Republicans_Positive_Count = 0,
      Republicans_Neutral_Count = 0,
      Republicans_Negative_Count = 0,
      Republicans_Count = 0,
    } = state || {};
    
    const tooltipContent = `
      ${name};

      ${Biden_Combined_Sentiment}%; 
      ${Harris_Combined_Sentiment}%;
      ${Trump_Combined_Sentiment}%;
      ${Democrats_Combined_Sentiment}%;
      ${Republicans_Combined_Sentiment}%;

      ${Biden_Count};
      ${Harris_Count};
      ${Trump_Count};
      ${Democrats_Count};
      ${Republicans_Count};

      ${Biden_Positive_Count};
      ${Harris_Positive_Count};
      ${Trump_Positive_Count};
      ${Democrats_Positive_Count};
      ${Republicans_Positive_Count};

      ${Biden_Neutral_Count};
      ${Harris_Neutral_Count};
      ${Trump_Neutral_Count};
      ${Democrats_Neutral_Count};
      ${Republicans_Neutral_Count};

      ${Biden_Negative_Count};
      ${Harris_Negative_Count};
      ${Trump_Negative_Count};
      ${Democrats_Negative_Count};
      ${Republicans_Negative_Count};
    `;
    
    const tooltipTop = "10px";
    const tooltipLeft = "10px";

    if (activeGeoId === parseInt(geo.id)) {
      setTooltipContent('');
      setActiveGeoId(null);
      setSentimentTooltip(false);
    } 
    else {
      setTooltipContent(tooltipContent); 
      setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
      setActiveGeoId(parseInt(geo.id));
      setSentimentTooltip(true);
    }
  };

  const handleMouseEnter = (event, geo) => {
    const county = countyData.find(county => county.ID === parseInt(geo.id));
    const name = county ? county.CountyName : geo.properties.name;
    setCountyTooltip(name);
    setTooltipPosition({ top: event.clientY, left: event.clientX });
    setHoveredCountyId(parseInt(geo.id)); 
  };

  const handleMouseLeave = () => {
    setCountyTooltip('');
    setHoveredCountyId(null); 
  };

  if (selectedFromDate && selectedToDate && stateSentiment && stateSentiment.Sentiment) {
    stateSentiment.Sentiment.forEach(state => {
      // Party sentiment calculations
      const demSentiment = state.Democrats_Combined_Sentiment;
      const repSentiment = state.Republicans_Combined_Sentiment;
      const partyDiff = Math.abs(demSentiment - repSentiment);
  
      if (demSentiment > repSentiment) {
        state.MaxParty = partyDiff <= 5 ? 1 : 3;
      } 
      else if (demSentiment < repSentiment) {
        state.MaxParty = partyDiff <= 5 ? 2 : 4;
      } 
      else {
        state.MaxParty = 5;
      }
  
      // Candidate sentiment calculations
      const bidenSentiment = state.Biden_Combined_Sentiment;
      const harrisSentiment = state.Harris_Combined_Sentiment;
      const trumpSentiment = state.Trump_Combined_Sentiment;
  
      const maxSentiment = Math.max(bidenSentiment, harrisSentiment, trumpSentiment);
      const sentiments = [bidenSentiment, harrisSentiment, trumpSentiment];
      const candidateDiff = Math.abs(bidenSentiment - harrisSentiment) <= 5 || 
                            Math.abs(bidenSentiment - trumpSentiment) <= 5 || 
                            Math.abs(harrisSentiment - trumpSentiment) <= 5;
  
      if (sentiments.filter(s => s === maxSentiment).length > 1) {
        state.MaxCandidate = 7; 
      } 
      else if (bidenSentiment === maxSentiment) {
        state.MaxCandidate = candidateDiff ? 1 : 4; 
      } 
      else if (harrisSentiment === maxSentiment) {
        state.MaxCandidate = candidateDiff ? 2 : 5; 
      } 
      else if (trumpSentiment === maxSentiment) {
        state.MaxCandidate = candidateDiff ? 3 : 6;
      } 
      else {
        state.MaxCandidate = 7;
      }
    });
  }  
  
  return (
    <>
      {/* Conditionally render relative party states */}
      {stateParty && (
        <Geographies geography={geoUrlStates}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const state = stateSentiment.Sentiment.find(state => state.ID === parseInt(geo.id));
              const fillColor = state ? partyMap[state.MaxParty] : "#CCCCCC";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="state"
                  fill={(activeGeoId === parseInt(geo.id)) ? "#CCCCCC" : fillColor}
                  onClick={(event) => 
                    !stateCandidate && !statePartyAbs && !stateCandidateAbs &&
                    handleStateClick(event, geo)
                  }
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      )}

      {/* Conditionally render absolute party states */}
      {statePartyAbs && (
        <Geographies geography={geoUrlStates}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const state = stateSentiment.Sentiment.find(state => state.ID === parseInt(geo.id));
              const fillColor = state ? partyMapAbsolute[state.MaxParty] : "#CCCCCC";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="state"
                  fill={(activeGeoId === parseInt(geo.id)) ? "#CCCCCC" : fillColor}
                  onClick={(event) => 
                    !stateParty && !stateCandidate && !stateCandidateAbs &&
                    handleStateClick(event, geo)
                  }
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      )}

      {/* Conditionally render relative candidate states */}
      {stateCandidate && (
        <Geographies geography={geoUrlStates}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const state = stateSentiment.Sentiment.find(state => state.ID === parseInt(geo.id));
              const fillColor = state ? candidateMap[state.MaxCandidate] : "#CCCCCC";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="state"
                  fill={(activeGeoId === parseInt(geo.id)) ? "#CCCCCC" : fillColor}
                  onClick={(event) => 
                    !stateParty && !statePartyAbs && !stateCandidateAbs && 
                    handleStateClick(event, geo)}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      )}

      {/* Conditionally render absolute candidate states */}
      {stateCandidateAbs && (
        <Geographies geography={geoUrlStates}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const state = stateSentiment.Sentiment.find(state => state.ID === parseInt(geo.id));
              const fillColor = state ? candidateMapAbsolute[state.MaxCandidate] : "#CCCCCC";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="state"
                  fill={(activeGeoId === parseInt(geo.id)) ? "#CCCCCC" : fillColor}
                  onClick={(event) => 
                    !stateParty && !stateCandidate && !statePartyAbs && 
                    handleStateClick(event, geo)}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      )}

      {/* Conditionally render county map */}
      {showCounty && (
        <Geographies geography={geoUrlCounties}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHovered = hoveredCountyId === parseInt(geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="county"
                  onMouseEnter={(event) => handleMouseEnter(event, geo)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: { 
                      outline: "none",
                      fill: isHovered ? "#555555" : ((!stateParty && !stateCandidate && !statePartyAbs && !stateCandidateAbs) ?
                        "#CCCCCC" : "none")
                    },
                    hover: { 
                      outline: "none", 
                      fill: "#555555"
                    },
                    pressed: { 
                      outline: "none", 
                      fill: "none"
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      )}

        {/* Render state boundaries */}
        <Geographies geography={geoUrlStates}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography 
                key={geo.rsmKey} 
                geography={geo} 
                className="state"
                style={{
                  default: { 
                    outline: "none", 
                    fill: (stateParty || stateCandidate || statePartyAbs || stateCandidateAbs || showCounty
                    ) ? "none" : "#CCCCCC" 
                  },
                  hover: { 
                    outline: "none", 
                    fill: (stateParty || stateCandidate || statePartyAbs || stateCandidateAbs || showCounty
                    ) ? "none" : "#CCCCCC" 
                  },
                  pressed: { 
                    outline: "none", 
                    fill: (stateParty || stateCandidate || statePartyAbs || stateCandidateAbs || showCounty
                    ) ? "none" : "#CCCCCC" 
                  },
                }}
              />
            ))
          }
        </Geographies>
    </>
  );
};

export default GeographiesMap;