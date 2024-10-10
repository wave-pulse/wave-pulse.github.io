import React, { useEffect, useState, useRef } from "react";
import { Marker } from "react-simple-maps";
import axios from "axios";
import "../styles.css";

const populationCSV = "https://wave-pulse-o5tct.ondigitalocean.app/api/city-population/";

const PopulationMarkers = ({ zoom, showPopulation }) => {
  const [populationData, setPopulationData] = useState([]);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [hoveredTooltipDims, setHoveredTooltipDims] = useState({ width: 0, height: 0 });
  const hoveredTooltipRef = useRef(null);

  useEffect(() => {
    axios.get(populationCSV)
      .then(response => {
        setPopulationData(response.data);
      })
      .catch(error => {
        console.error("Error loading or parsing data", error);
      });
  }, []);

  useEffect(() => {
    if (hoveredMarker !== null && hoveredTooltipRef.current) {
      const bbox = hoveredTooltipRef.current.getBBox();
      setHoveredTooltipDims({ width: bbox.width, height: bbox.height });
    }
  }, [hoveredMarker]);

  const getCircleSize = (population) => {
    const baseSize = 1.7;
    const populationFactor = population / 500000 * 0.1; 
    let adjustedSize = baseSize + populationFactor;

    if (zoom > 5) {
      return adjustedSize * 3 / zoom; // Decrease size for higher zoom levels
    } else if (zoom > 2) {
      return adjustedSize * 2 / zoom; // Slightly decrease size for medium zoom levels
    } else {
      return adjustedSize / zoom; // Default size adjustment for lower zoom levels
    }
  };

  const getTooltipScale = () => {
    if (zoom > 5) {
      return 3; // Decrease size for higher zoom levels
    } else if (zoom > 2) {
      return 2; // Slightly decrease size for medium zoom levels
    } else {
      return 1; // Default size adjustment for lower zoom levels
    }
  };

  return (
    <>
      {showPopulation && populationData.map((city, index) => {
        const latitude = parseFloat(city.latitude);
        const longitude = parseFloat(city.longitude);
        const radius = getCircleSize(city.population);
        const cityName = city.city.split(' ').slice(0, -1).join(' ').replace(',', '');
        const tooltipScale = getTooltipScale();

        return (
          <Marker
            key={index}
            coordinates={[longitude, latitude]}
            onMouseEnter={() => setHoveredMarker(index)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            <g>
              <circle
                className="population"
                r={hoveredMarker === index ? radius * 0.7 : radius}
              />
              {hoveredMarker === index && (
                <g>
                  <rect
                    width={hoveredTooltipDims.width + 8}
                    height={hoveredTooltipDims.height + 6}
                    className="radio-tooltip-background"
                    transform={`scale(${1 / tooltipScale})`}
                  />
                  <text
                    x={hoveredTooltipDims.width / 2 + 5}
                    y="1.2em"
                    textAnchor="middle"
                    className="radio-tooltip"
                    ref={hoveredTooltipRef}
                    transform={`scale(${1 / tooltipScale})`}
                  >
                    <tspan x={hoveredTooltipDims.width / 2 + 5}>
                      {cityName}, {city.state}
                    </tspan>
                    <tspan x={hoveredTooltipDims.width / 2 + 5} dy="1.2em">
                      Population: {city.population.toLocaleString()}
                    </tspan>
                    <tspan x={hoveredTooltipDims.width / 2 + 5} dy="1.2em">
                      Black Population: {city.black_population.toLocaleString()}
                    </tspan>
                    <tspan x={hoveredTooltipDims.width / 2 + 5} dy="1.2em">
                      Hispanic Population: {city.hispanic_population.toLocaleString()}
                    </tspan>
                  </text>
                </g>
              )}
            </g>
          </Marker>
        );
      })}
    </>
  );
};

export default PopulationMarkers;
