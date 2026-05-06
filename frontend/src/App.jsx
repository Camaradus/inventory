import { useState, useEffect } from 'react';
import { api } from './api';
import { Tabs } from './components/Tabs';
import { InventorySection } from './components/InventorySection';
import { StatsPanel } from './components/StatsPanel';
import { SearchBar } from './components/SearchBar';
import { AddCategoryModal } from './components/AddCategoryModal';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [stats, setStats] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, prods, statsData] = await Promise.all([
        api.fetchCategories(),
        api.fetchProduits(),
        api.fetchStats()
      ]);
      setCategories(cats);
      setProduits(prods);
      setStats(statsData);
      if (cats.length > 0 && !activeTab) {
        setActiveTab(cats[0].id);
      }
      setError(null);
    } catch (err) {
      setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (nom) => {
    try {
      const newCat = await api.createCategory(nom);
      setCategories([...categories, newCat]);
      setShowAddCategory(false);
    } catch (err) {
      alert('Erreur lors de la création du volet');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Supprimer ce volet et tous ses produits ?')) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      if (activeTab === id && categories.length > 1) {
        setActiveTab(categories.find(c => c.id !== id)?.id);
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateStock = async (produitId, delta, nouveauStock) => {
    try {
      await api.updateStock(produitId, delta, nouveauStock);
      setProduits(produits.map(p => 
        p.id === produitId 
          ? { ...p, stock: nouveauStock !== undefined ? nouveauStock : p.stock + delta }
          : p
      ));
      // Refresh stats
      const newStats = await api.fetchStats();
      setStats(newStats);
    } catch (err) {
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const handleAddProduit = async (nom, categorieId) => {
    try {
      const newProd = await api.createProduit(nom, categorieId);
      setProduits([...produits, newProd]);
    } catch (err) {
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  const handleDeleteProduit = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await api.deleteProduit(id);
      setProduits(produits.filter(p => p.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleResetProduit = async (id) => {
    if (!confirm('Réinitialiser le stock à zéro ?')) return;
    try {
      await api.resetProduit(id);
      setProduits(produits.map(p => p.id === id ? { ...p, stock: 0 } : p));
    } catch (err) {
      alert('Erreur lors de la réinitialisation');
    }
  };

  const handleExport = (categorieId) => {
    api.exportCategory(categorieId);
  };

  const handleExportAll = () => {
    api.exportAll();
  };

  const handleResetCategory = async (categorieId) => {
    if (!confirm('Réinitialiser tous les stocks de ce volet à zéro ?')) return;
    try {
      await api.resetCategory(categorieId);
      setProduits(produits.map(p => 
        p.categorie_id === categorieId ? { ...p, stock: 0 } : p
      ));
    } catch (err) {
      alert('Erreur lors de la réinitialisation');
    }
  };

  const filteredProduits = produits.filter(p => 
    p.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategory = categories.find(c => c.id === activeTab);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={loadData}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📦 Inventaire Boissons</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </header>

      <StatsPanel stats={stats} />

      <Tabs
        categories={categories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setShowAddCategory(true)}
        onDeleteClick={handleDeleteCategory}
      />

      {activeCategory && (
        <InventorySection
          category={activeCategory}
          produits={filteredProduits.filter(p => p.categorie_id === activeTab)}
          onUpdateStock={handleUpdateStock}
          onAddProduit={handleAddProduit}
          onDeleteProduit={handleDeleteProduit}
          onResetProduit={handleResetProduit}
          onExport={() => handleExport(activeTab)}
          onResetCategory={() => handleResetCategory(activeTab)}
        />
      )}

      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onAdd={handleAddCategory}
        />
      )}

      <footer className="footer">
        <button className="btn-export-all" onClick={handleExportAll}>
          📊 Exporter tout
        </button>
      </footer>
    </div>
  );
}

export default App;
