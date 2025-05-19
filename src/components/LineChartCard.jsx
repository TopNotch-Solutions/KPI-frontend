import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import CircularProgress from "@mui/material/CircularProgress";

const LineChartCard = ({ data, isLoading }) => {
  const legendItems = [
    { color: "rgba(21, 78, 138, 1)", label: "Current Year" },
    { color: "rgba(210, 31, 53, 1)", label: "Previous Year" }
  ];

  if (isLoading) {
    return (
      <div className="col-12 p-4 shadow rounded-2" style={{ width: '100%' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: 301 }}>
          <div style={{ textAlign: "center" }}>
            <CircularProgress color="inherit" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12 p-4 shadow rounded-2" style={{ width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center border-bottom">
        <h6>MSMEs Registration</h6>
        <div className="d-flex justify-content-center align-items-center" style={{ gap: '20px' }}>
          {legendItems.map(({ color, label }) => (
            <div key={label} className="d-flex align-items-center">
              <div 
                className="circle"
                style={{ backgroundColor: color, width: 10, height: 10, borderRadius: '50%', marginRight: '8px' }}
              />
              <p className="small-padding mb-0">{label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <ResponsiveContainer width="100%" height={301}>
            <LineChart data={data} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis interval={0} padding={{ top: 20 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="currentMonth"
                name="Current Year"
                stroke="rgba(21, 78, 138, 1)"
                activeDot={{ r: 8 }}
              >
                <LabelList dataKey="currentMonth" position="top" />
              </Line>
              <Line
                type="monotone"
                dataKey="previousMonth"
                name="Previous Year"
                stroke="rgba(210, 31, 53, 1)"
              >
                <LabelList dataKey="previousMonth" position="top" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LineChartCard;