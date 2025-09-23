import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TimeHistogram from "./TimeHistogram";
import ComparisionGraph from "./ComparisionGraph";
import "./searchPage.css";

// --- API Configuration ---
const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

// Search UI Components
const SearchableMultiSelectDropdown = ({
  label,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedOptions.includes(option)
  );

  return (
    <div className="form-group" ref={dropdownRef}>
      <label>{label}</label>
      <div className="multiselect-container">
        <div className="multiselect-control" onClick={() => setIsOpen(!isOpen)}>
          <div className="selected-pills">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <div key={option} className="selected-pill">
                  {option}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option);
                    }}
                    className="pill-remove-btn"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <span className="multiselect-placeholder">Select {label}...</span>
            )}
          </div>
          <span className="multiselect-arrow">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <ul className="multiselect-options">
            <input
              type="text"
              placeholder="Search..."
              className="multiselect-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option} onClick={() => toggleOption(option)}>
                  {option}
                </li>
              ))
            ) : (
              <li className="no-options">No options found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

const MultiInputField = ({ label, placeholder, inputs, setInputs }) => {
  const addField = () => setInputs([...inputs, ""]);
  const removeField = (index) => {
    if (inputs.length > 0) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };
  const updateField = (index, value) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      {inputs.map((value, index) => (
        <div key={index} className="input-row">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => updateField(index, e.target.value)}
            className="input-field"
          />
          <button
            type="button"
            onClick={() => removeField(index)}
            className="btn-remove"
          >
            −
          </button>
        </div>
      ))}
      <button type="button" onClick={addField} className="btn-add">
        + Add {label}
      </button>
    </div>
  );
};

const ContextSegment = ({ segment }) => (
  <div className="context-segment">
    <p className="context-segment-meta">
      {segment.speaker} (
      {new Date(segment.dt || segment.datetime).toLocaleString()})
    </p>
    <p className="context-segment-text">{segment.text || segment.snippet}</p>
  </div>
);

const SearchResultCard = ({
  result,
  contextMap,
  fetchContext,
  removeContext,
}) => {
  const hasBefore = contextMap[result.id]?.before?.length > 0;
  const hasAfter = contextMap[result.id]?.after?.length > 0;

  return (
    <div className="result-card">
      <div className="result-card-header">
        <h3>
          {result.speaker} – {result.station}
        </h3>
        <div className="result-card-meta">
          <p>{new Date(result.datetime).toLocaleString()}</p>
          <p>Rank: {result.rank.toFixed(5)}</p>
        </div>
      </div>

      {hasBefore && (
        <div className="context-container">
          {contextMap[result.id].before.map((seg) => (
            <ContextSegment key={seg.id} segment={seg} />
          ))}
        </div>
      )}

      <p className="result-snippet">{result.snippet}</p>

      {hasAfter && (
        <div className="context-container">
          {contextMap[result.id].after.map((seg) => (
            <ContextSegment key={seg.id} segment={seg} />
          ))}
        </div>
      )}

      <div className="result-card-actions">
        <div className="context-buttons">
          <button
            onClick={() => fetchContext(result.id, "before")}
            className="btn btn-small"
          >
            Before
          </button>
          <button
            onClick={() => fetchContext(result.id, "after")}
            className="btn btn-small"
          >
            After
          </button>
        </div>
        {(hasBefore || hasAfter) && (
          <div className="clear-buttons">
            {hasBefore && (
              <button
                onClick={() => removeContext(result.id, "before")}
                className="btn-clear"
              >
                Clear Before
              </button>
            )}
            {hasAfter && (
              <button
                onClick={() => removeContext(result.id, "after")}
                className="btn-clear"
              >
                Clear After
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function SearchPage() {
  const [queryInputs, setQueryInputs] = useState([""]);
  const [stationInputs, setStationInputs] = useState([]);
  const [stateInputs, setStateInputs] = useState([]);
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
  const [showComparison, setShowComparison] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [searched, setSearched] = useState(false);
  const [keywordGroups, setKeywordGroups] = useState([
    { label: "Group A", keywords: [""] },
  ]);

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
    setSearched(true);

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
        setAnswer(
          "Climate change is discussed frequently in political coverage."
        );
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

  const histogramFilters = {
    q: queryInputs.filter(Boolean).join("|"),
    station: stationInputs.filter(Boolean).join("|"),
    state: stateInputs.filter(Boolean).join("|"),
    speaker: speakerInputs.filter(Boolean).join("|"),
    startDate,
    endDate,
  };

  const renderPagination = () => {
    if (count <= resultsPerPage) return null;

    const totalPages = Math.ceil(count / resultsPerPage);
    const maxVisible = 5;
    const currentBlock = Math.floor((currentPage - 1) / maxVisible);
    const startPage = currentBlock * maxVisible + 1;
    const endPage = Math.min(startPage + maxVisible - 1, totalPages);

    const pages = [];

    if (currentBlock > 0) {
      pages.push(
        <button
          key="first"
          onClick={() => handleSearch(1)}
          className="pagination-button"
        >
          &laquo; First
        </button>
      );
      pages.push(
        <button
          key="prev"
          onClick={() => handleSearch(startPage - 1)}
          className="pagination-button"
        >
          &lsaquo; Prev
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleSearch(i)}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handleSearch(endPage + 1)}
          className="pagination-button"
        >
          Next &rsaquo;
        </button>
      );
      pages.push(
        <button
          key="last"
          onClick={() => handleSearch(totalPages)}
          className="pagination-button"
        >
          Last &raquo;
        </button>
      );
    }

    return <div className="pagination-container">{pages}</div>;
  };

  return (
    <div className="search-page-container">
      <div className="main-content">
        <header className="page-header">
          <h1 className="page-title">Transcript Search</h1>
          <div className="toggle-mode-container d-flex gap-3 align-items-center">
            <button
              className={`btn ${
                showComparison ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setShowComparison(!showComparison);
                setIsAskMode(false);
              }}
            >
              Comparison Graph
            </button>

            <button
              className={`btn ${
                isAskMode ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setIsAskMode(!isAskMode);
                setShowComparison(false);
              }}
            >
              Ask a Question
            </button>
          </div>
        </header>

        {isAskMode ? (
          <div className="card">
            <h2 className="card-title">Ask a Question</h2>
            <div className="ask-input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Type your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button onClick={handleAsk} className="btn btn-primary">
                Ask
              </button>
            </div>

            {loading && <div className="loading-indicator">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            {answer && (
              <div className="answer-container">
                <h5>Answer:</h5>
                <p>{answer}</p>
              </div>
            )}
            {snippets.length > 0 && (
              <div className="snippets-container">
                <h6>Related Transcripts</h6>
                {snippets.map((s, idx) => (
                  <ContextSegment key={idx} segment={s} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {showComparison ? (
               (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Keyword Comparison Groups</h5>

                    {keywordGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className="mb-2">
                        <label className="form-label">{group.label}</label>
                        {group.keywords.map((keyword, idx) => (
                          <div key={idx} className="input-group mb-1">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter keyword"
                              value={keyword}
                              onChange={(e) => {
                                const updated = [...keywordGroups];
                                updated[groupIndex].keywords[idx] =
                                  e.target.value;
                                setKeywordGroups(updated);
                              }}
                            />
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => {
                                const updated = [...keywordGroups];
                                updated[groupIndex].keywords.splice(idx, 1);
                                setKeywordGroups(updated);
                              }}
                            >
                              −
                            </button>
                          </div>
                        ))}

                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => {
                            const updated = [...keywordGroups];
                            updated[groupIndex].keywords.push("");
                            setKeywordGroups(updated);
                          }}
                        >
                          + Add Keyword to {group.label}
                        </button>

                        {keywordGroups.length > 1 && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              const updated = keywordGroups.filter(
                                (_, i) => i !== groupIndex
                              );
                              setKeywordGroups(updated);
                            }}
                          >
                            Remove {group.label}
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() =>
                        setKeywordGroups([
                          ...keywordGroups,
                          {
                            label: `Group ${String.fromCharCode(
                              65 + keywordGroups.length
                            )}`,
                            keywords: [""],
                          },
                        ])
                      }
                    >
                      + Add Group
                    </button>
                  </div>

                  <ComparisionGraph
                    comparisonGroups={keywordGroups.filter((group) =>
                      group.keywords.some(Boolean)
                    )}
                  />
                </div>
              )
            ) : (
              <>
                <div className="card">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch(1);
                    }}
                  >
                    <div className="form-grid">
                      <MultiInputField
                        label="Keyword"
                        placeholder="Enter keyword..."
                        inputs={queryInputs}
                        setInputs={setQueryInputs}
                      />
                      <SearchableMultiSelectDropdown
                        label="Station"
                        options={stationOptions}
                        selectedOptions={stationInputs}
                        setSelectedOptions={setStationInputs}
                      />
                      <SearchableMultiSelectDropdown
                        label="State"
                        options={stateOptions}
                        selectedOptions={stateInputs}
                        setSelectedOptions={setStateInputs}
                      />
                      <MultiInputField
                        label="Speaker"
                        placeholder="Enter speaker..."
                        inputs={speakerInputs}
                        setInputs={setSpeakerInputs}
                      />
                      <div className="form-group">
                        <label>From Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div className="form-group">
                        <label>To Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <div className="sort-control">
                        <label>Sort by:</label>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="select-field"
                        >
                          <option value="desc">Recent to Old</option>
                          <option value="asc">Old to Recent</option>
                        </select>
                      </div>
                      <div className="action-buttons">
                        <button type="submit" className="btn btn-primary">
                          Search
                        </button>
                        <button
                          type="button"
                          onClick={handleExportCSV}
                          className="btn btn-secondary"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {loading && (
                  <div className="loading-indicator">Searching...</div>
                )}

                {searched && !loading && (
                  <>
                    {count > 0 && (
                      <div className="card">
                        <h2 className="card-title">
                          Transcript Matches Over Time & By Stations
                        </h2>
                        <TimeHistogram filters={histogramFilters} />
                      </div>
                    )}
                    <div className="card">
                      <div id="search-results">
                        <div className="results-header">
                          <h2>Search Results</h2>
                          <span>Total: {count}</span>
                        </div>

                        {results.length > 0 ? (
                          <div className="results-grid">
                            {results.map((result) => (
                              <SearchResultCard
                                key={result.id}
                                result={result}
                                contextMap={contextMap}
                                fetchContext={fetchContext}
                                removeContext={removeContext}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="no-results-message">
                            <p>
                              No results found. Try different filters or
                              keywords.
                            </p>
                          </div>
                        )}
                        {renderPagination()}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
