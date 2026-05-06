# Inventaire Pro - Version PythonAnywhere

## Structure du projet

```
InventairePro/
├── frontend/                 # Application React (frontend)
│   ├── src/
│   ├── dist/                 # Fichiers buildés (générés par npm run build)
│   └── package.json
├── python_backend/           # Backend Python/Flask pour PythonAnywhere
│   ├── app.py               # Application Flask principale
│   ├── requirements.txt     # Dépendances Python
│   ├── update_vins.py       # Script import vins
│   └── update_alcools.py    # Script import alcools
├── backend/                  # Backend Node.js (pour usage local)
└── render.yaml               # Config Render (option alternative)
```

## Deux options d'hébergement

### Option 1 : PythonAnywhere (RECOMMANDÉ)
- ✅ Gratuit
- ✅ Base de données persistante
- ✅ Pas de carte de crédit requise
- 📖 Guide : `DEPLOIEMENT_PYTHONANYWHERE.md`

### Option 2 : Render
- ✅ Déploiement automatique
- ❌ Nécessite une carte (vérification $1)
- ❌ Plan gratuit sans disk persistant
- 📖 Guide : `DEPLOIEMENT_RENDER.md`

## Déploiement PythonAnywhere - Résumé rapide

1. Créer compte sur https://www.pythonanywhere.com
2. Cloner le repo : `git clone https://github.com/Camaradus/inventory.git`
3. Créer virtualenv : `python3.10 -m venv venv`
4. Installer dépendances : `pip install -r python_backend/requirements.txt`
5. Initialiser DB : `python3 -c "from app import init_db; init_db()"`
6. Importer données : `python3 update_vins.py` et `python3 update_alcools.py`
7. Builder frontend : `cd frontend && npm install && npm run build`
8. Créer Web App (Manual config, Python 3.10)
9. Configurer WSGI et virtualenv
10. Reload !

## URLs de l'application

- **PythonAnywhere** : `https://VOTRE_USERNAME.pythonanywhere.com`
- **Local** : `http://localhost:5000` (Python) ou `http://localhost:3001` (Node.js)

## Technologies utilisées

- **Frontend** : React 18 + Vite + Lucide React
- **Backend Python** : Flask + Flask-CORS + SQLite
- **Backend Node.js** : Express + SQLite (option local)

## Scripts disponibles

### PythonAnywhere
```bash
cd python_backend
python3 update_vins.py      # Importe les 88 vins
python3 update_alcools.py   # Importe les 97 alcools
```

### Local (Node.js)
```bash
cd backend
node update-vins-new.js     # Importe les vins
node update-alcools.js      # Importe les alcools
```

## Support

En cas de problème :
1. Vérifier les logs PythonAnywhere (Web → Error log)
2. Vérifier que `frontend/dist/` existe
3. Vérifier le WSGI configuration file
