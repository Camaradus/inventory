export function StatsPanel({ stats }) {
  const totalProduits = stats.reduce((sum, s) => sum + s.nb_produits, 0);
  const totalStock = stats.reduce((sum, s) => sum + s.stock_total, 0);
  const totalAlertes = stats.reduce((sum, s) => sum + s.alertes, 0);

  return (
    <div className="stats-panel">
      <div className="stat-card total">
        <div className="stat-icon">📦</div>
        <div className="stat-info">
          <div className="stat-value">{totalProduits}</div>
          <div className="stat-label">Produits totaux</div>
        </div>
      </div>
      <div className="stat-card stock">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <div className="stat-value">{totalStock}</div>
          <div className="stat-label">Stock global</div>
        </div>
      </div>
      <div className="stat-card alerts">
        <div className="stat-icon">⚠️</div>
        <div className="stat-info">
          <div className="stat-value">{totalAlertes}</div>
          <div className="stat-label">Ruptures de stock</div>
        </div>
      </div>
    </div>
  );
}
