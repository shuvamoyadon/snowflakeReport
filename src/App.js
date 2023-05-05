import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import 'react-pivottable/pivottable.css';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import TableRenderers from 'react-pivottable/TableRenderers';
import './App.css';
import pivotTableStyles from './PivotTable.module.css';


function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)', // Change the background color to black
          color: 'white', // Change the text color to white
          border: '1px solid #ccc',
          padding: '4px',
          borderRadius: '5px',
        }}
      >
        <p>
          <strong>Warehouse:</strong> {label}
        </p>
        <p>
          <strong>Credits Used:</strong> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}



function App() {
  const [reportData, setReportData] = useState([]);
  const [pivotSettings, setPivotSettings] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/report');
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  // Define an array of colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="App">
      <h1>Snowflake Report</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart width={400} height={400}>
          <Pie
            data={reportData}
            dataKey="CREDITS_USED"
            nameKey="WAREHOUSE_NAME"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          >
            {reportData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
        <div style={{ marginLeft: '20px' }}>
        <PivotTableUI
          className={pivotTableStyles.pivotTable}
          data={reportData}
          onChange={(settings) => setPivotSettings(settings)}
          renderers={Object.assign({}, TableRenderers)}
          {...pivotSettings}
        />
        </div>
      </div>
    </div>
  );
}

export default App;
