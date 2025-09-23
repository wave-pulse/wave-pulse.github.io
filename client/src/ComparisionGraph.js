import React, { useEffect, useState } from 'react';
import { Line} from 'react-chartjs-2';
import axios from 'axios';
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

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
const getLineColor = (idx) => {
  const colors = [
    "#ff6384", "#36a2eb", "#cc65fe", "#ffce56",
    "#2ecc71", "#e67e22", "#1abc9c", "#9b59b6", "#34495e"
  ];
  return colors[idx % colors.length];
};

const ComparisionGraph = ({ filters, comparisonGroups = [] }) => {
  const [groupBy] = useState('date');
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const responses = await Promise.all(
          comparisonGroups.map((group) => {
            const params = {
              ...filters,
              q: group.keywords.join("|"),
              groupBy: groupBy,
            };
            return axios.get(`${API}/aggregate`, { params });
          })
        );
  
        const labels = responses[0]?.data.map(d => d.label) || [];
  
        const datasets = responses.map((res, idx) => ({
          label: comparisonGroups[idx].label,
          data: res.data.map(d => d.count),
          borderColor: getLineColor(idx),
          backgroundColor: 'rgba(0,0,0,0)',
          fill: false,
          tension: 0.4,
        }));
  
        setComparisonData({ labels, datasets });
      } catch (err) {
        console.error("Error loading keyword comparison data", err);
      }
    };
  
    if (comparisonGroups.length > 0) {
      fetchComparisonData();
    }
  }, [filters, comparisonGroups, groupBy]);


  return (
    <div style={{ maxWidth: '1000px', marginTop: '30px' }}>
      {comparisonGroups.length > 0 && comparisonData && (
  <div style={{ marginTop: '50px' }}>
    <h4>Keyword Group Comparison</h4>
    <Line
      data={comparisonData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Keyword Group Trends Over Time',
          },
        },
        scales: {
          x: {
            type: 'time',
            time: { unit: groupBy === 'week' ? 'week' : groupBy === 'month' ? 'month' : 'day' },
            title: { display: true, text: 'Date' },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Mentions' },
          },
        },
      }}
    />
  </div>
)}
    </div>
  );
};

export default ComparisionGraph;
 