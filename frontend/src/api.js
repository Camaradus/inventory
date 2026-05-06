const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

class InventaireAPI {
  async fetchCategories() {
    const res = await fetch(`${API_URL}/categories`);
    return res.json();
  }

  async createCategory(nom, type = 'custom') {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, type })
    });
    return res.json();
  }

  async deleteCategory(id) {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  async fetchProduits() {
    const res = await fetch(`${API_URL}/produits`);
    return res.json();
  }

  async fetchProduitsByCategory(categorieId) {
    const res = await fetch(`${API_URL}/produits/categorie/${categorieId}`);
    return res.json();
  }

  async createProduit(nom, categorie_id, stock = 0, unite = 'unité') {
    const res = await fetch(`${API_URL}/produits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, categorie_id, stock, unite })
    });
    return res.json();
  }

  async updateStock(id, delta, nouveauStock) {
    const res = await fetch(`${API_URL}/produits/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta, nouveauStock })
    });
    return res.json();
  }

  async deleteProduit(id) {
    const res = await fetch(`${API_URL}/produits/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  async resetProduit(id) {
    const res = await fetch(`${API_URL}/produits/${id}/reset`, {
      method: 'POST'
    });
    return res.json();
  }

  async fetchStats() {
    const res = await fetch(`${API_URL}/stats`);
    return res.json();
  }

  async exportCategory(categorieId) {
    window.open(`${API_URL}/export/${categorieId}`, '_blank');
  }

  async exportAll() {
    window.open(`${API_URL}/export`, '_blank');
  }

  async importProduits(categorieId, produits) {
    const res = await fetch(`${API_URL}/import/${categorieId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produits })
    });
    return res.json();
  }

  async resetCategory(categorieId) {
    const res = await fetch(`${API_URL}/reset/${categorieId}`, {
      method: 'POST'
    });
    return res.json();
  }
}

export const api = new InventaireAPI();
