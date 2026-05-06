import { useState } from 'react';
import { X } from 'lucide-react';

export function AddCategoryModal({ onClose, onAdd }) {
  const [nom, setNom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nom.trim()) {
      onAdd(nom.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Nouveau volet</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom du volet</label>
            <input
              type="text"
              placeholder="Ex: Snacks, Café, etc."
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={!nom.trim()}>
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
