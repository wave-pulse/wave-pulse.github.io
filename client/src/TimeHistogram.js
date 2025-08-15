// TimeHistogram.js - includes export buttons for PNG via html2canvas
import React, { useEffect, useRef, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:2000';

const TimeHistogram = ({ filters }) => {
  const [timeData, setTimeData] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [groupBy, setGroupBy] = useState('date');
  const timeChartRef = useRef(null);
  const stationChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeParams = { groupBy, ...filters };
        const stationParams = { groupBy: 'station', ...filters };

        const [timeRes, stationRes] = await Promise.all([
          axios.get(`${API}/aggregate`, { params: timeParams }),
          axios.get(`${API}/aggregate`, { params: stationParams }),
        ]);

        setTimeData({
          labels: timeRes.data.map((d) => d.label),
          datasets: [
            {
              label: `Matches per ${groupBy === 'date' ? 'Day' : groupBy === 'week' ? 'Week' : 'Month'}`,
              data: timeRes.data.map((d) => d.count),
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.3)',
              tension: 0.4,
            },
          ],
        });

        setStationData({
          labels: stationRes.data.map((d) => d.label),
          datasets: [
            {
              label: 'Transcript Matches by Station',
              data: stationRes.data.map((d) => d.count),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });
      } catch (err) {
        console.error('Failed to fetch chart data', err);
      }
    };

    fetchData();
  }, [filters, groupBy]);

  const timeUnit = groupBy === 'date' ? 'day' : groupBy === 'week' ? 'week' : 'month';

  const downloadChartAsImage = (ref, filename) => {
    if (!ref.current) return;
    html2canvas(ref.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div style={{ maxWidth: '1000px', marginTop: '30px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>Group By:&nbsp;</label>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="date">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {timeData ? (
        <div>
          <div ref={timeChartRef}>
            <Line
              data={timeData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: `Transcript Matches Over Time (${groupBy})` },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: { unit: timeUnit },
                    title: { display: true, text: 'Date' },
                  },
                  y: {
                    title: { display: true, text: 'Matches' },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <button onClick={() => downloadChartAsImage(timeChartRef, 'time_chart.png')} style={{ marginTop: '10px' }}>
            Download Time Chart as PNG
          </button>
        </div>
      ) : (
        <p>Loading time chart...</p>
      )}

      {stationData ? (
        <div style={{ marginTop: '40px' }}>
          <div ref={stationChartRef}>
            <Bar
              data={stationData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Transcript Matches by Station' },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Station' },
                  },
                  y: {
                    title: { display: true, text: 'Matches' },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <button onClick={() => downloadChartAsImage(stationChartRef, 'station_chart.png')} style={{ marginTop: '10px' }}>
            Download Station Chart as PNG
          </button>
        </div>
      ) : (
        <p>Loading station chart...</p>
      )}
    </div>
  );
};

export default TimeHistogram;
 