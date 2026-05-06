import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={20} />
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="clear-search" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  );
}
