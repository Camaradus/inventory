from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Chemin de la base de données
DB_PATH = os.path.join(os.path.dirname(__file__), 'inventaire.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Table catégories
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT UNIQUE NOT NULL,
            type TEXT DEFAULT 'custom',
            ordre INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Table produits
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            categorie_id INTEGER NOT NULL,
            stock REAL DEFAULT 0,
            unite TEXT DEFAULT 'unités',
            ordre INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
        )
    ''')
    
    # Table historique
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS historique (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produit_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            quantite REAL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
        )
    ''')
    
    # Insérer catégories par défaut
    categories = [
        (1, 'Vins', 'default', 1),
        (2, 'Alcools', 'default', 2),
        (3, 'Softs & Bières', 'default', 3),
        (4, 'Cafés', 'custom', 4),
        (5, 'Thés', 'custom', 5),
        (6, 'Divers', 'custom', 6)
    ]
    
    for cat in categories:
        cursor.execute('''
            INSERT OR IGNORE INTO categories (id, nom, type, ordre) 
            VALUES (?, ?, ?, ?)
        ''', cat)
    
    conn.commit()
    conn.close()
    print('✅ Base de données initialisée')

# ========== ROUTES API ==========

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM categories ORDER BY ordre')
    categories = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(categories)

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO categories (nom, type, ordre) 
        VALUES (?, ?, (SELECT MAX(ordre) + 1 FROM categories))
    ''', (data['nom'], data.get('type', 'custom')))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'nom': data['nom']}), 201

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM categories WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Catégorie supprimée'})

@app.route('/api/produits', methods=['GET'])
def get_produits():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.*, c.nom as categorie_nom 
        FROM produits p 
        JOIN categories c ON p.categorie_id = c.id 
        ORDER BY c.ordre, p.ordre
    ''')
    produits = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(produits)

@app.route('/api/produits/categorie/<int:categorie_id>', methods=['GET'])
def get_produits_by_category(categorie_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM produits 
        WHERE categorie_id = ? 
        ORDER BY ordre
    ''', (categorie_id,))
    produits = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(produits)

@app.route('/api/produits', methods=['POST'])
def create_produit():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO produits (nom, categorie_id, stock, unite, ordre) 
        VALUES (?, ?, ?, ?, ?)
    ''', (data['nom'], data['categorie_id'], data.get('stock', 0), 
          data.get('unite', 'unités'), data.get('ordre', 0)))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id}), 201

@app.route('/api/produits/<int:id>/stock', methods=['PUT'])
def update_stock(id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE produits 
        SET stock = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    ''', (data['stock'], id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Stock mis à jour'})

@app.route('/api/produits/<int:id>', methods=['DELETE'])
def delete_produit(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM produits WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Produit supprimé'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as total FROM produits')
    total = cursor.fetchone()['total']
    
    cursor.execute('SELECT SUM(stock) as stock_global FROM produits')
    stock_global = cursor.fetchone()['stock_global'] or 0
    
    cursor.execute('SELECT COUNT(*) as ruptures FROM produits WHERE stock = 0')
    ruptures = cursor.fetchone()['ruptures']
    
    conn.close()
    return jsonify({
        'total_produits': total,
        'stock_global': stock_global,
        'ruptures': ruptures
    })

@app.route('/api/export', methods=['GET'])
def export_data():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.nom, p.stock, p.unite, c.nom as categorie
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
        ORDER BY c.ordre, p.ordre
    ''')
    data = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(data)

@app.route('/api/reset/<int:categorie_id>', methods=['POST'])
def reset_category(categorie_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE produits 
        SET stock = 0, updated_at = CURRENT_TIMESTAMP 
        WHERE categorie_id = ?
    ''', (categorie_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Stock réinitialisé'})

# ========== SERVIR LE FRONTEND ==========

@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend/dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend/dist', path)

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
