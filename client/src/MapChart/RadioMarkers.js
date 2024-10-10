import React, { useEffect, useState, useRef, useCallback } from "react";
import { Marker } from "react-simple-maps";
import axios from 'axios';
import "../styles.css";

const radioCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/radio-news/';
const networksCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/networks/';

const RadioMarkers = ({ 
  zoom, 
  showCoverage, 
  showNarrative, 
  setShowNarrative 
}) => {
  const [markers, setMarkers] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [hoveredTooltipDims, setHoveredTooltipDims] = useState({ width: 0, height: 0 });
  const [networks, setNetworks] = useState([]);
  const [activeMarkers, setActiveMarkers] = useState(new Map()); 
  const hoveredTooltipRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [radioData, networksData] = await Promise.all([
        axios.get(radioCSV),
        axios.get(networksCSV)
      ]);

      setMarkers(radioData.data);
      clusterMarkers(radioData.data);

      setNetworks(networksData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clusterMarkers = (data) => {
    const newClusters = [];
    const threshold = 0.2;

    data.forEach((d) => {
      const latitude = parseFloat(d.Latitude);
      const longitude = parseFloat(d.Longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        let added = false;
        for (let cluster of newClusters) {
          const [clusterLat, clusterLon] = cluster[0].coordinates;
          const dx = clusterLon - longitude;
          const dy = clusterLat - latitude;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < threshold) {
            cluster.push({ coordinates: [latitude, longitude], data: d });
            added = true;
            break;
          }
        }
        if (!added) {
          newClusters.push([{ coordinates: [latitude, longitude], data: d }]);
        }
      }
    });

    setClusters(newClusters);
  };

  const setActiveNarrative = useCallback((narrativeNumber) => {
    setShowNarrative(narrativeNumber);
  }, [setShowNarrative]);

  useEffect(() => {
    if (showNarrative) {
      setActiveNarrative(showNarrative);
    }
  }, [showNarrative, setActiveNarrative]);

  const updateActiveMarkers = useCallback((level, narrativeKey) => {
    const newActiveMarkers = new Map(); 

    networks.forEach(network => {
      if (network.NarrativeKey === narrativeKey && network.Level <= level) {
        const sourceParts = network.Source.split('_');
        const callSign = sourceParts[1];

        if (newActiveMarkers.has(callSign)) {
          newActiveMarkers.get(callSign).push(network.Level); 
        } else {
          newActiveMarkers.set(callSign, [network.Level]);
        }
      }
    });

    setActiveMarkers(newActiveMarkers);
    setCurrentLevel(level);
  }, [networks]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setActiveMarkers(new Map());

    if (showNarrative) {
      let level = 0;
      intervalRef.current = setInterval(() => {
        level++;
        updateActiveMarkers(level, showNarrative);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [showNarrative, networks, updateActiveMarkers]);

  const getMarkerSize = (clusterLength = 1) => {
    const baseSize = showNarrative === 0 ? (clusterLength > 1 ? 2.3 : 1.7) : 2.3;
    return baseSize / Math.max(1, zoom / 2);
  };

  const getTrianglePoints = (radius) => {
    const height = radius * 2.5;
    const halfBase = radius * 2;
    return `${-halfBase},${halfBase} ${halfBase},${halfBase} 0,${-height}`;
  };

  useEffect(() => {
    if (hoveredElement !== null && hoveredTooltipRef.current) {
      const bbox = hoveredTooltipRef.current.getBBox();
      setHoveredTooltipDims({ width: bbox.width, height: bbox.height });
    }
  }, [hoveredElement]);

  const isMarkerActive = useCallback((callSign) => {
    return activeMarkers.has(callSign) || !showNarrative;
  }, [activeMarkers, showNarrative]);

  const renderMarker = (marker, index) => {
    const latitude = parseFloat(marker.Latitude);
    const longitude = parseFloat(marker.Longitude);
    const radius = getMarkerSize();
    const callSign = marker.CallSign;

    const networkLevels = activeMarkers.get(callSign); 
    const levelText = networkLevels ? `Levels: ${networkLevels.join(', ')}` : "N/A";
    const tooltipText = `${callSign} - ${marker.City} (${levelText})`;

    if (!isMarkerActive(callSign)) {
      return null;
    }

    return (
      <Marker
        key={index}
        coordinates={[longitude, latitude]}
        onMouseEnter={() => setHoveredElement(index)}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <g>
          {(showCoverage || hoveredElement === index) && (
            <circle className="coverage" r={5} />
          )}

          <circle
            className="marker"
            r={hoveredElement === index ? radius * 1.2 : radius}
            style={{ fill: "#555555" }}
          />

          {networkLevels && networkLevels.includes(currentLevel) && (
            <circle className="blinking" r={radius * 5} />
          )}

          {hoveredElement === index && (
            <g>
              <rect
                x={-hoveredTooltipDims.width / 2 - 4}
                y={-radius - hoveredTooltipDims.height - 8}
                width={hoveredTooltipDims.width + 8}
                height={hoveredTooltipDims.height + 6}
                className="radio-tooltip-background"
              />
              <text
                y={-radius - 8}
                textAnchor="middle"
                className="radio-tooltip"
                ref={hoveredTooltipRef}
              >
                <tspan x="0">{tooltipText}</tspan>
              </text>
            </g>
          )}
        </g>
      </Marker>
    );
  };

  const renderCluster = (cluster, index) => {
    const avgLat = cluster.reduce((sum, m) => sum + m.coordinates[0], 0) / cluster.length;
    const avgLon = cluster.reduce((sum, m) => sum + m.coordinates[1], 0) / cluster.length;
    const radius = getMarkerSize(cluster.length);
    const clusterHasNetwork = cluster.some(m => 
      networks.some(network => 
        network.Source.includes(m.data.CallSign) 
        && network.NarrativeKey === 1
      )
    );

    return (
      <Marker
        key={`cluster-${index}`}
        coordinates={[avgLon, avgLat]}
        onMouseEnter={() => setHoveredElement(`cluster-${index}`)}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <g>
          {(showCoverage || hoveredElement === `cluster-${index}`) && (
            <circle className="coverage" r={5} />
          )}

          {clusterHasNetwork ? (
            <polygon
              points={getTrianglePoints(radius)}
              className="marker"
              style={{ fill: "#555555" }}
            />
          ) : (
            <circle
              className="marker"
              r={hoveredElement === `cluster-${index}` ? radius * 1.2 : radius}
              style={{ fill: "#555555" }}
            />
          )}

          {hoveredElement === `cluster-${index}` && (
            <g>
              <rect
                width={hoveredTooltipDims.width + 6}
                height={hoveredTooltipDims.height + 6}
                className="radio-tooltip-background"
              />
              <text
                x={hoveredTooltipDims.width / 2 + 5}
                y="1.2em"
                textAnchor="start"
                className="radio-tooltip"
                ref={hoveredTooltipRef}
              >
                {cluster.map((m, i) => (
                  <tspan key={i} x="0" dy={i === 0 ? 0 : "1.2em"}>
                    {m.data.CallSign} - {m.data.City}
                  </tspan>
                ))}
              </text>
            </g>
          )}
        </g>
      </Marker>
    );
  };

  const areAllNarrativesFalse = showNarrative === 0;

  return (
    <>
      {areAllNarrativesFalse
        ? clusters.map((cluster, index) => renderCluster(cluster, index))
        : markers.map((marker, index) => renderMarker(marker, index))}
    </>
  );
};

export default RadioMarkers;
