import { Plus, Trash2 } from 'lucide-react';

export function Tabs({ categories, activeTab, onTabChange, onAddClick, onDeleteClick }) {
  return (
    <div className="tabs-container">
      <div className="tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => onTabChange(cat.id)}
          >
            {getIcon(cat.type)} {cat.nom}
            {cat.type === 'custom' && (
              <span 
                className="tab-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(cat.id);
                }}
              >
                <Trash2 size={14} />
              </span>
            )}
          </button>
        ))}
        <button className="tab tab-add" onClick={onAddClick}>
          <Plus size={18} /> Volet
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
