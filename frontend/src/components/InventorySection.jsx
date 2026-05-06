import { useState } from 'react';
import { Plus, Minus, Trash2, RotateCcw, Download, Search } from 'lucide-react';

export function InventorySection({ 
  category, 
  produits, 
  onUpdateStock, 
  onAddProduit, 
  onDeleteProduit, 
  onResetProduit,
  onExport,
  onResetCategory
}) {
  const [newProduit, setNewProduit] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const handleAdd = () => {
    if (newProduit.trim()) {
      onAddProduit(newProduit.trim(), category.id);
      setNewProduit('');
    }
  };

  const handleInputChange = (produitId, value) => {
    setInputValues({ ...inputValues, [produitId]: value });
  };

  const handleAddQuantity = (produit) => {
    const value = parseFloat(inputValues[produit.id]) || 0;
    if (value > 0) {
      onUpdateStock(produit.id, value);
      setInputValues({ ...inputValues, [produit.id]: '' });
    }
  };

  const handleRemoveQuantity = (produit) => {
    const value = parseFloat(inputValues[produit.id]) || 0;
    if (value > 0) {
      onUpdateStock(produit.id, -value);
      setInputValues({ ...inputValues, [produit.id]: '' });
    }
  };

  const totalStock = produits.reduce((sum, p) => sum + p.stock, 0);
  const alertes = produits.filter(p => p.stock === 0).length;

  return (
    <div className="inventory-section">
      <div className="section-header">
        <h2>{getIcon(category.type)} Inventaire {category.nom}</h2>
        <div className="section-actions">
          <button 
            className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            Cartes
          </button>
          <button 
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            Tableau
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-value">{produits.length}</div>
          <div className="stat-label">Références</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalStock}</div>
          <div className="stat-label">Stock total</div>
        </div>
        <div className="stat-box alert">
          <div className="stat-value">{alertes}</div>
          <div className="stat-label">Alertes</div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Stock</th>
                <th>Actions rapides</th>
                <th>Quantité personnalisée</th>
                <th>Suppr</th>
              </tr>
            </thead>
            <tbody>
              {produits.map(produit => (
                <tr key={produit.id} className={produit.stock === 0 ? 'empty' : ''}>
                  <td className="produit-nom">{produit.nom}</td>
                  <td className={`stock-value ${produit.stock === 0 ? 'empty' : produit.stock < 10 ? 'low' : 'ok'}`}>
                    {produit.stock}
                  </td>
                  <td className="actions-rapides">
                    <button className="btn-icon btn-plus" onClick={() => onUpdateStock(produit.id, 1)}>
                      <Plus size={16} />
                    </button>
                    <button className="btn-icon btn-minus" onClick={() => onUpdateStock(produit.id, -1)}>
                      <Minus size={16} />
                    </button>
                    <button className="btn-icon btn-reset" onClick={() => onResetProduit(produit.id)}>
                      <RotateCcw size={14} />
                    </button>
                  </td>
                  <td className="actions-custom">
                    <input
                      type="number"
                      placeholder="Qté"
                      value={inputValues[produit.id] || ''}
                      onChange={(e) => handleInputChange(produit.id, e.target.value)}
                      className="qty-input"
                    />
                    <button className="btn-small btn-success" onClick={() => handleAddQuantity(produit)}>
                      ✔
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleRemoveQuantity(produit)}>
                      ✖
                    </button>
                  </td>
                  <td>
                    <button className="btn-icon btn-delete" onClick={() => onDeleteProduit(produit.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards-grid">
          {produits.map(produit => (
            <div key={produit.id} className={`product-card ${produit.stock === 0 ? 'empty' : produit.stock < 10 ? 'low' : 'ok'}`}>
              <div className="card-header">
                <h3>{produit.nom}</h3>
                <span className={`stock-badge ${produit.stock === 0 ? 'empty' : produit.stock < 10 ? 'low' : 'ok'}`}>
                  {produit.stock}
                </span>
              </div>
              <div className="card-actions">
                <button className="btn-icon btn-plus" onClick={() => onUpdateStock(produit.id, 1)}>
                  <Plus size={20} />
                </button>
                <button className="btn-icon btn-minus" onClick={() => onUpdateStock(produit.id, -1)}>
                  <Minus size={20} />
                </button>
              </div>
              <div className="card-quick-add">
                <input
                  type="number"
                  placeholder="Qté"
                  value={inputValues[produit.id] || ''}
                  onChange={(e) => handleInputChange(produit.id, e.target.value)}
                  className="qty-input"
                />
                <button className="btn-small btn-success" onClick={() => handleAddQuantity(produit)}>
                  ✔
                </button>
                <button className="btn-small btn-danger" onClick={() => handleRemoveQuantity(produit)}>
                  ✖
                </button>
              </div>
              <div className="card-footer">
                <button className="btn-icon btn-reset" onClick={() => onResetProduit(produit.id)}>
                  <RotateCcw size={16} />
                </button>
                <button className="btn-icon btn-delete" onClick={() => onDeleteProduit(produit.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="add-product">
        <h3>➕ Ajouter un produit</h3>
        <div className="add-form">
          <input
            type="text"
            placeholder="Nom du produit"
            value={newProduit}
            onChange={(e) => setNewProduit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      <div className="export-section">
        <button className="btn-export" onClick={onExport}>
          <Download size={16} /> Excel
        </button>
        <button className="btn-reset-all" onClick={onResetCategory}>
          <RotateCcw size={16} /> Reset tout
        </button>
      </div>
    </div>
  );
}

function getIcon(type) {
  switch (type) {
    case 'vins': return '🍷';
    case 'alcools': return '🥃';
    case 'softs': return '🥤';
    default: return '📦';
  }
}
