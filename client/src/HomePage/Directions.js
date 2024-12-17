import React from "react";

function Directions() {
  return (
    <div className="about-section">
      <hr />
      <h4>Directions for Navigating Wave Pulse</h4>

      <p>
        Welcome to <strong>Wave Pulse</strong>! This platform provides an
        intuitive way to explore data through geographical visualizations and
        analytical charts. Upon loading the website, you will arrive at the{" "}
        <strong>Home Page</strong>. Here, you’ll be greeted with a welcome
        message and an introduction in the <strong>About</strong> section,
        which gives you insights into the purpose and functionality of Wave
        Pulse.
      </p>

      <hr />

      <p>To explore the platform, click on:</p>

      <p>
        <strong>"Show Map"</strong> to view an <strong>interactive map</strong> of
        state and county-level data.
      </p>

      <p>
        Use the <strong>"Select Map"</strong> dropdown to choose:
        <br />
        - <strong>State Party - Relative</strong>: Relative sentiment by party. <br />
        - <strong>State Party - Absolute</strong>: Absolute counts by party. <br />
        - <strong>State Candidate - Relative</strong>: Relative sentiment by candidate. <br />
        - <strong>State Candidate - Absolute</strong>: Absolute counts by candidate.
      </p>

      <p>
        Use the <strong>"Select Overlay"</strong> dropdown to toggle:
        <br />
        - <strong>Show Coverage</strong>: Displays radio coverage. <br />
        - <strong>Show Population</strong>: Highlights population data. <br />
        - <strong>Show County Map</strong>: Adds county boundaries.
      </p>

      <p>
        Use the <strong>"Select Narrative"</strong> dropdown to display specific
        narratives like <strong>'Georgia Election Stolen'</strong>. Only one
        narrative can be active at a time.
      </p>

      <hr />

      <p>
        <strong>"Show Daily Average"</strong> displays analytical charts and plots
        summarizing daily trends in the data.
      </p>

      <hr />

      <p>
        When you are viewing either the <strong>Map</strong> or the{" "}
        <strong>Daily Average</strong> chart, you can always return to the{" "}
        <strong>Home Page</strong> by clicking the <strong>Home</strong> icon
        in the top-left corner.
      </p>

      <hr />

      <p>
        Enjoy exploring the rich features of Wave Pulse, and use the map and
        overlays to gain detailed insights into state and candidate-level
        data. Toast notifications will confirm changes as you explore.
      </p>
    </div>
  );
}

export default Directions;
