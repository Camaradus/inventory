# Déploiement sur PythonAnywhere

## Pourquoi PythonAnywhere ?

- ✅ **Gratuit** (plan gratuit suffisant)
- ✅ **Base de données persistante** (SQLite sauvegardée)
- ✅ **Python natif** (plus simple que Node.js)
- ✅ **Hébergement web** (URL accessible partout)

---

## Prérequis

- Compte PythonAnywhere : https://www.pythonanywhere.com (gratuit)
- Votre projet sur GitHub : `https://github.com/Camaradus/inventory`

---

## ÉTAPE 1 : Créer un compte PythonAnywhere

1. Allez sur https://www.pythonanywhere.com
2. Cliquez **"Start running Python online for free"**
3. Créez un compte avec votre email
4. Vérifiez votre email et connectez-vous

---

## ÉTAPE 2 : Ouvrir une console Bash

1. Dans le dashboard PythonAnywhere, cliquez sur **"Bash"** (sous "New console")
2. Une console s'ouvre

---

## ÉTAPE 3 : Cloner le repository

Dans la console Bash, tapez :

```bash
cd ~
git clone https://github.com/Camaradus/inventory.git
cd inventory
```

---

## ÉTAPE 4 : Créer un virtual environment

```bash
python3.10 -m venv venv
source venv/bin/activate
```

---

## ÉTAPE 5 : Installer les dépendances

```bash
cd python_backend
pip install -r requirements.txt
```

---

## ÉTAPE 6 : Initialiser la base de données

```bash
python3 << 'EOF'
import sys
sys.path.insert(0, '/home/VOTRE_USERNAME/inventory/python_backend')
from app import init_db
init_db()
EOF
```

Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur PythonAnywhere.

---

## ÉTAPE 7 : Importer vos données

### 7.1 Importer les vins :

```bash
cd ~/inventory/python_backend
python3 update_vins.py
```

### 7.2 Importer les alcools :

```bash
python3 update_alcools.py
```

Résultat attendu :
- `✅ 88 vins importés avec succès !`
- `✅ 97 alcools importés avec succès !`

---

## ÉTAPE 8 : Builder le frontend React

Dans une **nouvelle console Bash** (gardez l'autre ouverte) :

```bash
cd ~/inventory/frontend
npm install
npm run build
```

Attendez que le build se termine. Cela crée le dossier `dist/` avec les fichiers statiques.

---

## ÉTAPE 9 : Créer l'application Web

1. Retournez au dashboard PythonAnywhere
2. Cliquez sur l'onglet **"Web"**
3. Cliquez sur **"Add a new web app"**
4. Sélectionnez **"Manual configuration"**
5. Sélectionnez **"Python 3.10"**
6. Cliquez **"Next"**

### 9.1 Configurer le code source

Dans la section **"Code"** :
- **Source code** : `/home/VOTRE_USERNAME/inventory/python_backend`
- **Working directory** : `/home/VOTRE_USERNAME/inventory/python_backend`

### 9.2 Configurer le WSGI

Cliquez sur le lien **"WSGI configuration file"**.

Remplacez tout le contenu par :

```python
import sys
path = '/home/VOTRE_USERNAME/inventory/python_backend'
if path not in sys.path:
    sys.path.insert(0, path)

from app import app as application
```

Remplacez `VOTRE_USERNAME` par votre vrai nom d'utilisateur.

Cliquez **"Save"**.

### 9.3 Configurer l'environnement virtuel

Dans la section **"Virtualenv"** :
- **Virtualenv** : `/home/VOTRE_USERNAME/inventory/venv`

Cliquez le bouton pour sauvegarder.

---

## ÉTAPE 10 : Redémarrer l'application

1. Dans l'onglet **"Web"**
2. Cliquez sur le bouton **"Reload"** (grand bouton vert)

---

## ÉTAPE 11 : Vérifier le déploiement

1. Cliquez sur le lien **URL** de votre application (ex: `https://VOTRE_USERNAME.pythonanywhere.com`)
2. Vous devriez voir l'interface React avec vos produits

---

## Commandes utiles

### Vérifier les logs en cas d'erreur

Dans l'onglet **"Web"** → cliquez sur **"Error log"** ou **"Server log"**.

### Mettre à jour l'application

Si vous modifiez le code sur GitHub :

```bash
cd ~/inventory
git pull origin main
# Redémarrer l'app depuis l'onglet Web
```

### Réimporter les données

```bash
cd ~/inventory/python_backend
python3 update_vins.py
python3 update_alcools.py
```

---

## Limitations du plan gratuit

- **CPU** : Limité (suffisant pour l'inventaire)
- **Stockage** : 512 MB (suffisant pour SQLite)
- **Hibernation** : Après 3 mois d'inactivité, l'app s'endort (se réveille à la visite)
- **Daily reboot** : Redémarrage quotidien à 2h du matin (UTC)

---

## 🆘 Dépannage

### "404 Not Found"
- Vérifiez que le dossier `frontend/dist/` existe
- Vérifiez le WSGI configuration

### "Internal Server Error"
- Voir les logs : Web → Error log
- Vérifiez que la base de données est initialisée

### Page blanche
- Vérifier que `npm run build` a créé le dossier `dist/`
- Vérifier les permissions des fichiers

---

## ✅ Félicitations !

Votre inventaire est maintenant en ligne et accessible de partout !

URL : `https://VOTRE_USERNAME.pythonanywhere.com`
