import React, { useState, useEffect } from "react";
import { ComposableMap, ZoomableGroup, Marker } from "react-simple-maps";
import axios from "axios";
import "../styles.css";
import GeographiesMap from "./GeographiesMap";
import RadioMarkers from "./RadioMarkers";
import PopulationMarkers from "./PopulationMarkers";
import ToggleButton from "./ToggleButton";
import DatePickerComponent from './DatePicker';
import {
  StatePartyTooltip,
  StateCandidateTooltip,
  CountyTooltip
} from "./Tooltips";
import {
  StatePartyLegend,
  StateCandidateLegend,
  StatePartyAbsLegend,
  StateCandidateAbsLegend,
} from "./Legends";

const MapChart = () => {

  const dateMax = 'https://wave-pulse-o5tct.ondigitalocean.app/api/date-max/';

  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [stateData, setStateData] = useState([]);
  const [position, setPostion] = useState({ coordinates: [0, 0], zoom: 1 });
  const [stateParty, setStateParty] = useState(false);
  const [stateCandidate, setStateCandidate] = useState(false);
  const [statePartyAbs, setStatePartyAbs] = useState(false);
  const [stateCandidateAbs, setStateCandidateAbs] = useState(false);
  const [sentimentTooltip, setSentimentTooltip] = useState(false);
  const [countyTooltip, setCountyTooltip] = useState(false);
  const [selectedFromDate, setFromDate] = useState(null);
  const [selectedToDate, setToDate] = useState(null);
  const [selectedEndDate, setEndDate] = useState(null);
  const [legendState, setLegendState] = useState({
    stateParty: false,
    stateCandidate: false,
    statePartyAbs: false,
    stateCandidateAbs: false,
  });
  const [showCounty, setShowCounty] = useState(false);
  const [showCoverage, setShowCoverage] = useState(false);
  const [showPopulation, setShowPopulation] = useState(false);
  const [showNarrative, setShowNarrative] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    axios.get(dateMax)
      .then(response => {
        const data = response.data;       
        const fromDateParts = data.fromDate.split('-');
        const toDateParts = data.toDate.split('-');
        const fromDate = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
        const toDate = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
        setFromDate(fromDate);
        setToDate(toDate);
        setEndDate(toDate);
      })
      .catch(error => 
        console.error('Error fetching date max:', error  
      ));
  }, []); 

  useEffect(() => {
    setLegendState({
      stateParty,
      stateCandidate,
      statePartyAbs,
      stateCandidateAbs,
    });
  }, [stateParty, stateCandidate, statePartyAbs, stateCandidateAbs]);

  const handleMoveEnd = (position) => {
    setPostion(position);
  };

  const parseTooltipContent = (content) => {
    const [name, ...data] = content.split(';').map(item => item.trim());
    return { name, data };
  };

  const { name: stateName, data: stateSentiment } = parseTooltipContent(tooltipContent);

  const getPartySentimentData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}> Democrats:</span> {stateSentiment[3]};
      <span style={{ fontWeight: 'bold' }}> Republicans:</span> {stateSentiment[4]}
    </>
  );

  const getPartyCountsData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}> Democrats:</span> {stateSentiment[8]};
      <span style={{ fontWeight: 'bold' }}> Republicans:</span> {stateSentiment[9]}
    </>
  );

  const getPartyPositiveData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}> Democrats:</span> {stateSentiment[13]};
      <span style={{ fontWeight: 'bold' }}> Republicans:</span> {stateSentiment[14]}
    </>
  );

  const getPartyNeutralData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}> Democrats:</span> {stateSentiment[18]};
      <span style={{ fontWeight: 'bold' }}> Republicans:</span> {stateSentiment[19]}
    </>
  );

  const getPartyNegativeData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}> Democrats:</span> {stateSentiment[23]};
      <span style={{ fontWeight: 'bold' }}> Republicans:</span> {stateSentiment[24]}
    </>
  );

  const getCandidateSentimentData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}>Biden:</span> {stateSentiment[0]};
      <span style={{ fontWeight: 'bold' }}> Harris:</span> {stateSentiment[1]};
      <span style={{ fontWeight: 'bold' }}> Trump:</span> {stateSentiment[2]}
    </>
  );

  const getCandidateCountsData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}>Biden:</span> {stateSentiment[5]};
      <span style={{ fontWeight: 'bold' }}> Harris:</span> {stateSentiment[6]};
      <span style={{ fontWeight: 'bold' }}> Trump:</span> {stateSentiment[7]}
    </>
  );

  const getCandidatePositiveData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}>Biden:</span> {stateSentiment[10]};
      <span style={{ fontWeight: 'bold' }}> Harris:</span> {stateSentiment[11]};
      <span style={{ fontWeight: 'bold' }}> Trump:</span> {stateSentiment[12]}
    </>
  );

  const getCandidateNeutralData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}>Biden:</span> {stateSentiment[15]};
      <span style={{ fontWeight: 'bold' }}> Harris:</span> {stateSentiment[16]};
      <span style={{ fontWeight: 'bold' }}> Trump:</span> {stateSentiment[17]}
    </>
  );

  const getCandidateNegativeData = () => (
    <>
      <span style={{ fontWeight: 'bold' }}>Biden:</span> {stateSentiment[20]};
      <span style={{ fontWeight: 'bold' }}> Harris:</span> {stateSentiment[21]};
      <span style={{ fontWeight: 'bold' }}> Trump:</span> {stateSentiment[22]}
    </>
  );

  return (
    <div className="map-container">
      <DatePickerComponent
        selectedFromDate={selectedFromDate}
        selectedToDate={selectedToDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        selectedEndDate={selectedEndDate}
      />

      <ComposableMap projection="geoAlbersUsa">
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={handleMoveEnd}>
          <g>
            <GeographiesMap
              setTooltipContent={setTooltipContent}
              setTooltipPosition={setTooltipPosition}
              setSentimentTooltip={setSentimentTooltip}
              setCountyTooltip={setCountyTooltip}
              setStateData={setStateData}
              stateParty={stateParty}
              stateCandidate={stateCandidate}
              statePartyAbs={statePartyAbs}
              stateCandidateAbs={stateCandidateAbs}
              selectedFromDate={selectedFromDate}
              selectedToDate={selectedToDate}
              showCounty={showCounty}
            />
            
            {stateData.map(state => {
              const isSmallState = ["Connecticut", "Delaware", "Maryland", "Massachusetts", "New Hampshire",
                "New Jersey", "Rhode Island", "Vermont"].includes(state.State);
              const isDC = state.State === "District of Columbia";
              const text = isSmallState ? state.Abbreviation : isDC ? state.Abbreviation : state.State;
              const fontSize = isSmallState ? 5 : isDC ? 0 : 6;

              const calculateTextWidth = (text, fontSize) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                context.font = `${fontSize}px Arial`;
                const metrics = context.measureText(text);
                return metrics.width;
              };

              const textWidth = calculateTextWidth(text, fontSize);

              return (
                position.zoom < 1.5 && (
                  <Marker key={state.State} coordinates={[state.Longitude, state.Latitude]}>
                    <g transform={`translate(${-textWidth / 2 - 2}, -${fontSize / 2 - 2})`}>
                      <rect className="state-label-rect"
                        width={textWidth + 8}
                        height={fontSize + 2}
                      />
                      <text className="state-label"
                        fontSize={`${fontSize}px`}
                        x={(textWidth / 2) + 4}
                        y={(fontSize / 2) + 3}
                      >
                        {text}
                      </text>
                    </g>
                  </Marker>
                )
              );
            })}

            <RadioMarkers 
              zoom={position.zoom} 
              showCoverage={showCoverage} 
              showNarrative={showNarrative} 
              setShowNarrative={setShowNarrative}
            />
            <PopulationMarkers zoom={position.zoom} showPopulation={showPopulation} />
          </g>
        </ZoomableGroup>
      </ComposableMap>

      <StatePartyTooltip
        stateParty={stateParty}
        stateCandidate={stateCandidate}
        statePartyAbs={statePartyAbs}
        stateCandidateAbs={stateCandidateAbs}
        sentimentTooltip={sentimentTooltip}
        stateName={stateName}
        getPartySentimentData={getPartySentimentData}
        getPartyCountsData={getPartyCountsData}
        getPartyPositiveData={getPartyPositiveData}
        getPartyNeutralData={getPartyNeutralData}
        getPartyNegativeData={getPartyNegativeData}
      />

      <StateCandidateTooltip
        stateParty={stateParty}
        stateCandidate={stateCandidate}
        statePartyAbs={statePartyAbs}
        stateCandidateAbs={stateCandidateAbs}
        sentimentTooltip={sentimentTooltip}
        stateName={stateName}
        getCandidateSentimentData={getCandidateSentimentData}
        getCandidateCountsData={getCandidateCountsData}
        getCandidatePositiveData={getCandidatePositiveData}
        getCandidateNeutralData={getCandidateNeutralData}
        getCandidateNegativeData={getCandidateNegativeData}
      />

      <CountyTooltip
        stateParty={stateParty}
        stateCandidate={stateCandidate}
        statePartyAbs={statePartyAbs}
        stateCandidateAbs={stateCandidateAbs}
        countyTooltip={countyTooltip}
        tooltipPosition={tooltipPosition}
      />

      <ToggleButton 
        showCoverage={showCoverage}
        setShowCoverage={setShowCoverage} 
        showPopulation={showPopulation} 
        setShowPopulation={setShowPopulation} 
        showCounty={showCounty} 
        setShowCounty={setShowCounty} 
        setStateParty={setStateParty} 
        setStateCandidate={setStateCandidate} 
        setStatePartyAbs={setStatePartyAbs} 
        setStateCandidateAbs={setStateCandidateAbs}
        showNarrative={showNarrative}
        setShowNarrative={setShowNarrative}
      />

      {legendState.stateParty && <StatePartyLegend />}
      {legendState.stateCandidate && <StateCandidateLegend />}
      {legendState.statePartyAbs && <StatePartyAbsLegend />}
      {legendState.stateCandidateAbs && <StateCandidateAbsLegend />}
   
    </div>
  );
};

export default MapChart;
