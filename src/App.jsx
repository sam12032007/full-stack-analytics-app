import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/analytics`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <main className="page"><div className="error">Error: {error}</div></main>;
  }

  if (!data) {
    return <main className="page"><div className="loading">Loading dashboard...</div></main>;
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map((item) => item.value));

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">FULL-STACK ANALYTICS</p>
          <h1>Analytics Dashboard</h1>
          <p className="subtitle">Track users, sessions, revenue and conversion.</p>
        </div>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </header>

      <section className="cards">
        <KPI title="Total Users" value={data.kpis.users.toLocaleString()} />
        <KPI title="Sessions" value={data.kpis.sessions.toLocaleString()} />
        <KPI title="Revenue" value={`$${data.kpis.revenue.toLocaleString()}`} />
        <KPI title="Conversion" value={`${data.kpis.conversion}%`} />
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panel-heading">
            <h2>Monthly Revenue</h2>
            <span>Last 6 months</span>
          </div>
          <div className="chart">
            {data.monthlyRevenue.map((item) => (
              <div className="bar-wrap" key={item.month}>
                <span className="bar-value">${(item.value / 1000).toFixed(1)}k</span>
                <div
                  className="bar"
                  style={{ height: `${(item.value / maxRevenue) * 180}px` }}
                  title={`$${item.value}`}
                />
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Recent Activity</h2>
            <span>Live API data</span>
          </div>
          <div className="activity">
            {data.activities.map((item, index) => (
              <div className="activity-row" key={index}>
                <div className="avatar">{item.user[0]}</div>
                <div>
                  <strong>{item.user}</strong>
                  <p>{item.action}</p>
                </div>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function KPI({ title, value }) {
  return (
    <div className="kpi">
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
