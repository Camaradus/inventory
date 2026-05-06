const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { db, dbAsync } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ========== CATÉGORIES ==========

// Récupérer toutes les catégories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await dbAsync.all(
      'SELECT * FROM categories ORDER BY ordre ASC'
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une nouvelle catégorie (volet)
app.post('/api/categories', async (req, res) => {
  const { nom, type = 'custom' } = req.body;
  try {
    const maxOrdre = await dbAsync.get('SELECT MAX(ordre) as max FROM categories');
    const ordre = (maxOrdre?.max || 0) + 1;
    const result = await dbAsync.run(
      'INSERT INTO categories (nom, type, ordre) VALUES (?, ?, ?)',
      [nom, type, ordre]
    );
    res.json({ id: result.id, nom, type, ordre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une catégorie
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await dbAsync.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== PRODUITS ==========

// Récupérer tous les produits avec leurs catégories
app.get('/api/produits', async (req, res) => {
  try {
    const produits = await dbAsync.all(`
      SELECT p.*, c.nom as categorie_nom, c.type as categorie_type
      FROM produits p
      JOIN categories c ON p.categorie_id = c.id
      ORDER BY c.ordre ASC, p.ordre ASC, p.nom ASC
    `);
    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les produits par catégorie
app.get('/api/produits/categorie/:categorieId', async (req, res) => {
  try {
    const produits = await dbAsync.all(`
      SELECT p.*, c.nom as categorie_nom
      FROM produits p
      JOIN categories c ON p.categorie_id = c.id
      WHERE p.categorie_id = ?
      ORDER BY p.ordre ASC, p.nom ASC
    `, [req.params.categorieId]);
    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un produit
app.post('/api/produits', async (req, res) => {
  const { nom, categorie_id, stock = 0, unite = 'unité' } = req.body;
  try {
    const maxOrdre = await dbAsync.get(
      'SELECT MAX(ordre) as max FROM produits WHERE categorie_id = ?',
      [categorie_id]
    );
    const ordre = (maxOrdre?.max || 0) + 1;
    const result = await dbAsync.run(
      'INSERT INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
      [nom, categorie_id, stock, unite, ordre]
    );
    
    // Enregistrer dans l'historique
    await dbAsync.run(
      'INSERT INTO historique (produit_id, ancien_stock, nouveau_stock, type_operation) VALUES (?, ?, ?, ?)',
      [result.id, 0, stock, 'CREATION']
    );
    
    res.json({ id: result.id, nom, categorie_id, stock, unite, ordre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier le stock d'un produit
app.patch('/api/produits/:id/stock', async (req, res) => {
  const { delta, nouveauStock } = req.body;
  try {
    const produit = await dbAsync.get('SELECT * FROM produits WHERE id = ?', [req.params.id]);
    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    const ancienStock = produit.stock;
    const stockFinal = nouveauStock !== undefined ? nouveauStock : ancienStock + delta;
    
    await dbAsync.run(
      'UPDATE produits SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [stockFinal, req.params.id]
    );
    
    // Historique
    await dbAsync.run(
      'INSERT INTO historique (produit_id, ancien_stock, nouveau_stock, type_operation) VALUES (?, ?, ?, ?)',
      [req.params.id, ancienStock, stockFinal, 'MODIFICATION']
    );
    
    res.json({ id: req.params.id, stock: stockFinal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un produit
app.delete('/api/produits/:id', async (req, res) => {
  try {
    await dbAsync.run('DELETE FROM produits WHERE id = ?', [req.params.id]);
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Réinitialiser le stock d'un produit à zéro
app.post('/api/produits/:id/reset', async (req, res) => {
  try {
    const produit = await dbAsync.get('SELECT * FROM produits WHERE id = ?', [req.params.id]);
    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await dbAsync.run(
      'UPDATE produits SET stock = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.params.id]
    );
    
    await dbAsync.run(
      'INSERT INTO historique (produit_id, ancien_stock, nouveau_stock, type_operation) VALUES (?, ?, ?, ?)',
      [req.params.id, produit.stock, 0, 'RESET']
    );
    
    res.json({ id: req.params.id, stock: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== STATISTIQUES ==========

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await dbAsync.all(`
      SELECT 
        c.nom as categorie,
        c.type,
        COUNT(p.id) as nb_produits,
        COALESCE(SUM(p.stock), 0) as stock_total,
        SUM(CASE WHEN p.stock = 0 THEN 1 ELSE 0 END) as alertes
      FROM categories c
      LEFT JOIN produits p ON c.id = p.categorie_id
      GROUP BY c.id
      ORDER BY c.ordre ASC
    `);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== EXPORT EXCEL ==========

app.get('/api/export/:categorieId', async (req, res) => {
  try {
    const categorie = await dbAsync.get('SELECT * FROM categories WHERE id = ?', [req.params.categorieId]);
    if (!categorie) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    const produits = await dbAsync.all(
      'SELECT nom, stock, unite FROM produits WHERE categorie_id = ? ORDER BY ordre ASC',
      [req.params.categorieId]
    );
    
    const data = [['Produit', 'Quantité', 'Unité'], ...produits.map(p => [p.nom, p.stock, p.unite])];
    const ws = xlsx.utils.aoa_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, categorie.nom);
    
    const filename = `inventaire-${categorie.nom.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
    const filepath = path.join(__dirname, 'exports', filename);
    
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    xlsx.writeFile(wb, filepath);
    res.download(filepath, filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export global
app.get('/api/export', async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM categories ORDER BY ordre ASC');
    const wb = xlsx.utils.book_new();
    
    for (const cat of categories) {
      const produits = await dbAsync.all(
        'SELECT nom, stock, unite FROM produits WHERE categorie_id = ? ORDER BY ordre ASC',
        [cat.id]
      );
      
      if (produits.length > 0) {
        const data = [['Produit', 'Quantité', 'Unité'], ...produits.map(p => [p.nom, p.stock, p.unite])];
        const ws = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, cat.nom.substring(0, 31)); // Max 31 chars for sheet name
      }
    }
    
    const filename = `inventaire-complet-${new Date().toISOString().split('T')[0]}.xlsx`;
    const filepath = path.join(__dirname, 'exports', filename);
    
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    xlsx.writeFile(wb, filepath);
    res.download(filepath, filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== IMPORT CSV/EXCEL ==========

app.post('/api/import/:categorieId', async (req, res) => {
  const { produits } = req.body; // Array of {nom, stock}
  const categorieId = req.params.categorieId;
  
  try {
    const imported = [];
    for (const prod of produits) {
      if (!prod.nom) continue;
      
      // Vérifier si le produit existe déjà
      const existant = await dbAsync.get(
        'SELECT * FROM produits WHERE nom = ? AND categorie_id = ?',
        [prod.nom, categorieId]
      );
      
      if (existant) {
        // Mettre à jour le stock
        await dbAsync.run(
          'UPDATE produits SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [prod.stock || 0, existant.id]
        );
        imported.push({ id: existant.id, nom: prod.nom, stock: prod.stock || 0, updated: true });
      } else {
        // Créer nouveau produit
        const maxOrdre = await dbAsync.get(
          'SELECT MAX(ordre) as max FROM produits WHERE categorie_id = ?',
          [categorieId]
        );
        const ordre = (maxOrdre?.max || 0) + 1;
        
        const result = await dbAsync.run(
          'INSERT INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
          [prod.nom, categorieId, prod.stock || 0, prod.unite || 'unité', ordre]
        );
        imported.push({ id: result.id, nom: prod.nom, stock: prod.stock || 0, created: true });
      }
    }
    
    res.json({ imported: imported.length, produits: imported });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== RÉINITIALISATION ==========

app.post('/api/reset/:categorieId', async (req, res) => {
  try {
    await dbAsync.run(
      'UPDATE produits SET stock = 0, updated_at = CURRENT_TIMESTAMP WHERE categorie_id = ?',
      [req.params.categorieId]
    );
    res.json({ message: 'Stock réinitialisé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir le frontend en production
const frontendPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
  console.log('📁 Frontend servi depuis:', frontendPath);
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
});

module.exports = app;
