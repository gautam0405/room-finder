function DashboardHeader({ eyebrow, title, subtitle, onLogout }) {
  return (
    <div className="dashboard-header">
      <div>
        <p className="eyebrow eyebrow-solid">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="dashboard-subtitle">{subtitle}</p>
      </div>

      <button className="button button-secondary" onClick={onLogout} type="button">
        Logout
      </button>
    </div>
  );
}

export default DashboardHeader;
