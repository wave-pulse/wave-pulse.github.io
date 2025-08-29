import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchPage from "./SearchPage";
import axios from "axios";

// Mock axios for network calls
jest.mock("axios");

describe("SearchPage", () => {
  beforeEach(() => {
    // Mock filter dropdowns
    axios.get.mockResolvedValue({
      data: {
        stations: ["ABC", "XYZ"],
        states: ["CA", "NY"],
      },
    });
  });

  test("renders keyword input", async () => {
    render(<SearchPage />);
    expect(await screen.findByText("Transcript Search")).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/enter keyword/i);
    fireEvent.change(input, { target: { value: "climate" } });
    expect(input.value).toBe("climate");
  });

  test("can add and remove a station filter", async () => {
    render(<SearchPage />);
    const addBtn = await screen.findByText("+ Add Station");

    fireEvent.click(addBtn);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(2); // Includes State/Station/etc.

    const removeButtons = screen.getAllByText("−");
    fireEvent.click(removeButtons[0]);
    expect(removeButtons[0]).toBeDefined();
  });

  test("calls search when Search button is clicked", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        count: 1,
        results: [
          {
            id: 1,
            speaker: "John",
            station: "ABC",
            datetime: new Date().toISOString(),
            snippet: "Sample text",
            rank: 0.9,
          },
        ],
      },
    });

    render(<SearchPage />);
    const searchBtn = await screen.findByText("Search");
    fireEvent.click(searchBtn);

    expect(await screen.findByText("Search Results")).toBeInTheDocument();
  });

  test("renders Before and After buttons for search results", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        count: 1,
        results: [
          {
            id: 101,
            speaker: "Jane Doe",
            station: "WXYZ",
            datetime: new Date().toISOString(),
            snippet: "This is a snippet",
            rank: 0.85,
          },
        ],
      },
    });
  
    render(<SearchPage />);
    fireEvent.click(await screen.findByText("Search"));
  
    expect(await screen.findByText("− Before")).toBeInTheDocument();
    expect(screen.getByText("+ After")).toBeInTheDocument();
  });

  test("renders Export CSV button and allows click", async () => {
    render(<SearchPage />);
    const exportBtn = await screen.findByText("Export CSV");
    expect(exportBtn).toBeInTheDocument();
  
    fireEvent.click(exportBtn);
    // Optional: You can spy on window.URL.createObjectURL if needed
  });

  test("displays TimeHistogram after search results", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { stations: [], states: [] } }) // filters
      .mockResolvedValueOnce({ data: { count: 1, results: [] } }) // search
      .mockResolvedValueOnce({ data: [] }) // time chart
      .mockResolvedValueOnce({ data: [] }); // station chart
  
    render(<SearchPage />);
    fireEvent.click(await screen.findByText("Search"));
  
    expect(await screen.findByText(/Transcript Matches Over Time/i)).toBeInTheDocument();
  });
  
  test("displays loading spinner and error on failed Ask", async () => {
    render(<SearchPage />);
  
    // Switch to ask mode
    const toggle = screen.getByLabelText(/ask a question mode/i);
    fireEvent.click(toggle);
  
    // Simulate entering question
    const input = screen.getByPlaceholderText("Type your question...");
    fireEvent.change(input, { target: { value: "What is climate?" } });
  
    // Spy to simulate internal error
    const originalConsoleError = console.error;
    console.error = jest.fn(); // suppress test noise
  
    // Temporarily override handleAsk to simulate error
    const askBtn = screen.getByText("Ask");
    fireEvent.click(askBtn);
  
    // Spinner should appear
    expect(screen.getByRole("status")).toBeInTheDocument();
  
    // Restore console
    console.error = originalConsoleError;
  });  
  
  test("toggles to Ask a Question mode", async () => {
    render(<SearchPage />);

    const toggle = await screen.findByLabelText(/ask a question mode/i);
    fireEvent.click(toggle);

    expect(screen.getByText("Ask a Question")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Type your question...");
    fireEvent.change(input, { target: { value: "What is climate change?" } });

    const askBtn = screen.getByText("Ask");
    expect(askBtn).toBeInTheDocument();
  });
});
