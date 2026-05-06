const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Utiliser le disque persistant sur Render, sinon dossier local
const DB_DIR = process.env.RENDER_DISK_PATH || __dirname;
const DB_PATH = path.join(DB_DIR, 'inventaire.db');

// Créer le dossier si nécessaire
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite');
  }
});

// Création des tables
db.serialize(() => {
  // Table des catégories principales
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('vins', 'alcools', 'softs', 'custom')),
    ordre INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table des produits
  db.run(`CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    categorie_id INTEGER NOT NULL,
    stock REAL DEFAULT 0,
    stock_min REAL DEFAULT 0,
    unite TEXT DEFAULT 'unité',
    ordre INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
  )`);

  // Table historique des modifications
  db.run(`CREATE TABLE IF NOT EXISTS historique (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produit_id INTEGER NOT NULL,
    ancien_stock REAL,
    nouveau_stock REAL,
    type_operation TEXT NOT NULL,
    date_operation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
  )`);

  // Insertion des catégories par défaut
  const categories = [
    ['Vins', 'vins', 1],
    ['Alcools', 'alcools', 2],
    ['Softs & Bières', 'softs', 3],
    ['Cafés', 'custom', 4],
    ['Thés', 'custom', 5],
    ['Divers', 'custom', 6]
  ];

  categories.forEach(([nom, type, ordre]) => {
    db.run(`INSERT OR IGNORE INTO categories (nom, type, ordre) VALUES (?, ?, ?)`,
      [nom, type, ordre]);
  });

  console.log('Tables créées avec succès');
});

// Fonctions utilitaires
const dbAsync = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },

  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

module.exports = { db, dbAsync };
