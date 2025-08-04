import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Content from "./HomePage/Content";
import MapChart from "./MapChart/MapChart";
import Plots from "./Plots/Plots";

function App() {
  const [showChart, setShowChart] = useState(null);
  const [q, setQ] = useState("");
  const [station, setStation] = useState("");
  const [state, setState] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [stationOptions, setStationOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const API = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${API}/filters`);
        setStationOptions(res.data.stations);
        setStateOptions(res.data.states);
      } catch (err) {
        console.error("Failed to fetch filter options", err);
      }
    };
    fetchFilters();
  }, []);

  const handleSearch = async () => {
    try {
      const params = { q, station, state, speaker, startDate, endDate };
      const response = await axios.get(`${API}/search`, {
        params,
      });
      setResults(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleShowMap = () => {
    setShowChart("map");
  };

  const handleShowPlot = () => {
    setShowChart("bar");
  };

  const handleGoBackHome = () => {
    setShowChart(null);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          {showChart && (
            <IconButton edge="start" color="inherit" onClick={handleGoBackHome}>
              <HomeIcon />
            </IconButton>
          )}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            WavePulse
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Home Page */}
      {!showChart ? (
        <>
          <br />
          <div className="title-container">
            <h1 className="title">WavePulse</h1>
            <h2 className="subtitle">
              Real-time Content Analytics of Radio Livestreams
            </h2>
            <h3 className="subtitle text-sm italic">
              To Appear at The Web Conference (WWW) 2025
            </h3>
          </div>
          <Box mt={5}>
            <Content />
          </Box>
          <Box textAlign="center" mt={5}>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowMap}
                style={{ marginRight: "10px" }}
              >
                Show Map
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowPlot}
              >
                Show Daily Average
              </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowModal(true)}
                  style={{ marginLeft: "10px" }}
                >
                  SEARCH
                </Button>
                {showModal && (
                  <div className="search_modal"
                  >
                    <div className="Search_modal_window"
                    >
                      <h2>Search Transcript</h2>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Search text..."
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                        />

                        <select
                          value={station}
                          onChange={(e) => setStation(e.target.value)}
                        >
                          <option value="">Select Station</option>
                          {stationOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>

                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          <option value="">Select State</option>
                          {stateOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="Speaker"
                          value={speaker}
                          onChange={(e) => setSpeaker(e.target.value)}
                        />

                        <div style={{ display: "flex", gap: "1rem" }}>
                          <label>
                            From:{" "}
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </label>
                          <label>
                            To:{" "}
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </label>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "1rem",
                          }}
                        >
                          <button
                            onClick={handleSearch}
                            style={{ padding: "0.5rem", fontWeight: "bold" }}
                          >
                            Search
                          </button>
                          <button
                            onClick={() => setShowModal(false)}
                            style={{ padding: "0.5rem" }}
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: "1.5rem" }}>
                        <p>{count} result(s) found</p>
                        {results.length > 0 ? (
                          <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                            {results.map((result) => (
                              <div
                                key={result.id}
                                style={{
                                  border: "1px solid #ccc",
                                  margin: "1rem 0",
                                  padding: "1rem",
                                }}
                              >
                                <p>
                                  <strong>Station:</strong> {result.station}
                                </p>
                                <p>
                                  <strong>Date:</strong>{" "}
                                  {new Date(result.datetime).toLocaleString()}
                                </p>
                                <p>
                                  <strong>Speaker:</strong>{" "}
                                  {result.speaker || "Unknown"}
                                </p>
                                <p>
                                  <strong>Snippet:</strong> {result.snippet}
                                </p>
                                {result.rank !== undefined && (
                                  <p>
                                    <strong>Rank:</strong>{" "}
                                    {result.rank.toFixed(5)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: "#888" }}>No results found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </Box>
          </Box>
        </>
      ) : showChart === "map" ? (
        <MapChart />
      ) : (
        <Plots />
      )}
    </div>
  );
}

export default App;
