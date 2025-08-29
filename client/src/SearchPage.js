// SearchPage.js with backend-based sorting support
import React, { useState, useEffect } from "react";
import axios from "axios";
//import Papa from "papaparse";
import TimeHistogram from "./TimeHistogram";
import "./styles.css";
import { maxTime } from "date-fns/constants";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:2000";

function SearchPage() {
  const [queryInputs, setQueryInputs] = useState([""]);
  const [stationInputs, setStationInputs] = useState([""]);
  const [stateInputs, setStateInputs] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speakerInputs, setSpeakerInputs] = useState([""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stationOptions, setStationOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [contextMap, setContextMap] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");
  const resultsPerPage = 20;
  const [isAskMode, setIsAskMode] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [snippets, setSnippets] = useState([]);

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

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        q: queryInputs.filter(Boolean).join("|"),
        station: stationInputs.filter(Boolean).join("|"),
        state: stateInputs.filter(Boolean).join("|"),
        speaker: speakerInputs.filter(Boolean).join("|"),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sort: sortOrder,
        limit: resultsPerPage,
        offset: (page - 1) * resultsPerPage,
      };

      const response = await axios.get(`${API}/search`, { params });
      setResults(response.data.results);
      setCount(response.data.count);
      setCurrentPage(page);
      setContextMap({});
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*const handleAsk = async () => {
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Error retrieving answer.");
    }

    setLoading(false);
  };*/

  const removeContext = (id, direction) => {
    setContextMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [direction]: [],
      },
    }));
  };

  const fetchContext = async (id, direction) => {
    const existingSegments = contextMap[id]?.[direction] || [];
    const referenceId =
      direction === "before"
        ? existingSegments[0]?.id || id
        : existingSegments[existingSegments.length - 1]?.id || id;

    try {
      const response = await axios.get(`${API}/segment_context`, {
        params: { id: referenceId, direction },
      });

      setContextMap((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          [direction]:
            direction === "before"
              ? [...response.data, ...(prev[id]?.before || [])]
              : [...(prev[id]?.after || []), ...response.data],
        },
      }));
    } catch (error) {
      console.error(`Error fetching ${direction} context:`, error);
    }
  };

  const handleExportCSV = async () => {
    try {
      // Build context map
      const contextRequested = Object.entries(contextMap).reduce(
        (acc, [id, segments]) => {
          acc[id] = {
            before: segments.before?.length || 0,
            after: segments.after?.length || 0,
          };
          return acc;
        },
        {}
      );

      // Send POST to backend with filters and context map
      const response = await fetch(`${API}/export_csv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filters: {
            q: queryInputs.filter(Boolean).join("|"),
            station: stationInputs.filter(Boolean).join("|"),
            state: stateInputs.filter(Boolean).join("|"),
            speaker: speakerInputs.filter(Boolean).join("|"),
            startDate,
            endDate,
            sort: sortOrder,
          },
          contextRequested,
        }),
      });

      if (!response.ok) throw new Error("CSV export failed");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transcript_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Error exporting CSV.");
    }
  };

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    setSnippets([]);
    setError("");

    console.log("Question asked:", question);
  
    try {
      const trimmed = question.trim().toLowerCase();
  
      if (trimmed.includes("election")) {
        setAnswer("Ranked choice voting allows voters to rank candidates.");
        setSnippets([
          {
            speaker: "John Doe",
            date: "2024-08-05",
            text: "Ranked voting was used in the 2022 elections in Alaska.",
          },
          {
            speaker: "Jane Smith",
            date: "2024-08-07",
            text: "Some groups have criticized ranked voting for being confusing.",
          },
        ]);
      } else if (trimmed.includes("climate")) {
        setAnswer("Climate change is discussed frequently in political coverage.");
        setSnippets([
          {
            speaker: "Rep. Green",
            date: "2024-08-02",
            text: "We must reduce emissions immediately.",
          },
        ]);
      } else {
        setAnswer("");
        setSnippets([]);
      }
    } catch (err) {
      console.error("UI Ask Error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const renderInputList = (
    label,
    inputs,
    setInputs,
    options = [],
    isDropdown = false
  ) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {inputs.map((val, idx) => (
        <div key={idx} className="input-group mb-2">
          {isDropdown ? (
            <select
              className="form-select"
              value={val}
              onChange={(e) => {
                const updated = [...inputs];
                updated[idx] = e.target.value;
                setInputs(updated);
              }}
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className="form-control"
              value={val}
              placeholder={`Enter ${label.toLowerCase()}...`}
              onChange={(e) => {
                const updated = [...inputs];
                updated[idx] = e.target.value;
                setInputs(updated);
              }}
            />
          )}
          <button
            className="btn btn-outline-danger"
            onClick={() => setInputs(inputs.filter((_, i) => i !== idx))}
          >
            −
          </button>
        </div>
      ))}
      <button
        className="btn btn-outline-primary"
        onClick={() => setInputs([...inputs, ""])}
      >
        + Add {label}
      </button>
    </div>
  );

  const histogramFilters = {
    q: queryInputs.filter(Boolean).join("|"),
    station: stationInputs.filter(Boolean).join("|"),
    state: stateInputs.filter(Boolean).join("|"),
    speaker: speakerInputs.filter(Boolean).join("|"),
    startDate,
    endDate,
  };

  return (
    <div className="container mt-5">
      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleMode"
          checked={isAskMode}
          onChange={() => setIsAskMode(!isAskMode)}
        />
        <label className="form-check-label" htmlFor="toggleMode">
          {isAskMode ? "Switch to Search Mode" : "Switch to Ask Mode"}
        </label>
      </div>

      {isAskMode ? (
        <div className="mb-4">
          <h3>Ask a Question</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAsk}>
            Ask
          </button>

          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

          {answer && (
            <div className="alert alert-success mt-4">
              <h5 className="mb-2">Answer:</h5>
              <p>{answer}</p>
            </div>
          )}

          {snippets.length > 0 && (
            <div className="mt-4">
              <h6>Related Transcripts</h6>
              {snippets.map((s, idx) => (
                <div key={idx} className="border p-2 mb-2 bg-light">
                  <strong>{s.speaker}</strong> (
                  {new Date(s.date).toLocaleString()})
                  <br />
                  {s.text}
                </div>
              ))}
            </div>
          )}

          {!answer && !loading && question.trim() && (
            <div className="alert alert-warning mt-3">
              Sorry, we couldn’t find an answer to your question.
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="mb-4">Transcript Search</h2>

          {renderInputList("Keyword", queryInputs, setQueryInputs)}
          {renderInputList(
            "Station",
            stationInputs,
            setStationInputs,
            stationOptions,
            true
          )}
          {renderInputList(
            "State",
            stateInputs,
            setStateInputs,
            stateOptions,
            true
          )}
          {renderInputList("Speaker", speakerInputs, setSpeakerInputs)}

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">From Date:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">To Date:</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label mb-0">Sort by date:</label>
            <select
              className="form-select w-auto"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Recent to Old</option>
              <option value="asc">Old to Recent</option>
            </select>
          </div>

          <div className="mb-4 d-flex gap-3">
            <button className="btn btn-primary" onClick={() => handleSearch(1)}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              Export CSV
            </button>
          </div>

          {count > 0 && (
            <div className="mb-4">
              <TimeHistogram filters={histogramFilters} />
            </div>
          )}
          {/* <div>
      <h2>Ask a Question</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
      />
      <button onClick={handleAsk}>Ask</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        answer && <div><strong>Answer:</strong> {answer}</div>
      )}
    </div>*/}
          {!loading && results.length === 0 && (
            <div className="alert alert-warning" role="alert">
              No results found. Try different filters or keywords.
            </div>
          )}

          <h4>Search Results</h4>
          <p>Total: {count}</p>

          <div className="row">
            {results.map((r) => (
              <div className="col-md-6 mb-4" key={r.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div
                      style={{
                        maxHeight:
                          contextMap[r.id]?.before?.length ||
                          contextMap[r.id]?.after?.length
                            ? "400px"
                            : "none",
                        overflowY:
                          contextMap[r.id]?.before?.length ||
                          contextMap[r.id]?.after?.length
                            ? "auto"
                            : "hidden",
                        border:
                          contextMap[r.id]?.before?.length ||
                          contextMap[r.id]?.after?.length
                            ? "1px solid #ddd"
                            : "none",
                        paddingRight: "10px",
                        transition: "max-height 0.3s ease",
                        padding: "10px",
                      }}
                    >
                      {/* Before Segments */}
                      {contextMap[r.id]?.before?.length > 0 && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="text-muted mb-0">Segments Before</h6>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeContext(r.id, "before")}
                            >
                              Remove
                            </button>
                          </div>
                          <hr />
                          {contextMap[r.id].before.map((seg) => (
                            <div
                              key={seg.id}
                              className="border p-2 mb-2 bg-light"
                            >
                              <strong>{seg.speaker}</strong> (
                              {new Date(seg.dt).toLocaleString()})<br />
                              {seg.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Main Segment */}
                      <h6 className="card-title mb-2">
                        {r.speaker} – {r.station}
                      </h6>
                      <p className="text-muted mb-1">
                        <small>{new Date(r.datetime).toLocaleString()}</small>
                      </p>
                      <p className="card-text">{r.snippet}</p>
                      <p className="text-muted">
                        <small>Rank: {r.rank.toFixed(5)}</small>
                      </p>

                      {/* Buttons */}
                      <div className="d-flex gap-2 my-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => fetchContext(r.id, "before")}
                        >
                          − Before
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => fetchContext(r.id, "after")}
                        >
                          + After
                        </button>
                      </div>

                      {/* After Segments */}
                      {contextMap[r.id]?.after?.length > 0 && (
                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="text-muted mb-0">Segments After</h6>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeContext(r.id, "after")}
                            >
                              Remove
                            </button>
                          </div>
                          <hr />
                          {contextMap[r.id].after.map((seg) => (
                            <div
                              key={seg.id}
                              className="border p-2 mb-2 bg-light"
                            >
                              <strong>{seg.speaker}</strong> (
                              {new Date(seg.dt).toLocaleString()})<br />
                              {seg.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {count > resultsPerPage &&
            (() => {
              const totalPages = Math.ceil(count / resultsPerPage);
              const maxVisible = 5;
              const currentBlock = Math.floor((currentPage - 1) / maxVisible);
              const startPage = currentBlock * maxVisible + 1;
              const endPage = Math.min(startPage + maxVisible - 1, totalPages);

              const pages = [];

              if (currentBlock > 0) {
                pages.push(
                  <li key="first" className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handleSearch(1)}
                    >
                      « First
                    </button>
                  </li>
                );
                pages.push(
                  <li key="prev" className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handleSearch(startPage - 1)}
                    >
                      ‹ Prev
                    </button>
                  </li>
                );
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <li
                    key={i}
                    className={`page-item ${currentPage === i ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handleSearch(i)}
                    >
                      {i}
                    </button>
                  </li>
                );
              }

              if (endPage < totalPages) {
                pages.push(
                  <li key="next" className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handleSearch(endPage + 1)}
                    >
                      Next ›
                    </button>
                  </li>
                );
                pages.push(
                  <li key="last" className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handleSearch(totalPages)}
                    >
                      Last »
                    </button>
                  </li>
                );
              }

              return (
                <nav className="mt-4">
                  <ul className="pagination flex-wrap">{pages}</ul>
                </nav>
              );
            })()}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
