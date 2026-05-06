# 🍷 Inventaire Boissons - Application Full-Stack

Application de gestion d'inventaire avec backend Node.js/Express + SQLite et frontend React.

## 🚀 Démarrage rapide

### 1. Démarrer le backend
```bash
cd backend
npm install  # Si pas encore fait
node server.js
```
Le serveur démarre sur http://localhost:3001

### 2. Démarrer le frontend (nouveau terminal)
```bash
cd frontend
npm install  # Si pas encore fait
npm run dev
```
L'application est accessible sur http://localhost:5173

## 📁 Structure du projet

```
InventairePro/
├── backend/
│   ├── server.js          # Serveur Express + API REST
│   ├── database.js        # Configuration SQLite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Composant principal
│   │   ├── api.js         # Client API
│   │   └── components/    # Composants React
│   └── package.json
└── README.md
```

## ✨ Fonctionnalités

- ✅ **Catégories préconfigurées** : Vins, Alcools, Softs & Bières
- ✅ **Volets personnalisables** : Cafés, Thés, Divers + possibilité d'en créer
- ✅ **Gestion du stock** : +1, -1, quantités personnalisées
- ✅ **Alertes visuelles** : Produits en rupture (rouge), stock faible (orange)
- ✅ **Recherche globale** : Filtrer les produits
- ✅ **Export Excel** : Par catégorie ou complet
- ✅ **Vue responsive** : Tableau (desktop) ou cartes (mobile)
- ✅ **Persistance** : Base de données SQLite

## 🛠️ Technologies

- **Backend** : Node.js, Express, SQLite3
- **Frontend** : React, Vite, CSS moderne
- **Export** : XLSX.js

## 📊 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/categories | Liste des catégories |
| POST | /api/categories | Créer une catégorie |
| GET | /api/produits | Tous les produits |
| POST | /api/produits | Ajouter un produit |
| PATCH | /api/produits/:id/stock | Modifier le stock |
| GET | /api/stats | Statistiques globales |
| GET | /api/export | Export Excel complet |
