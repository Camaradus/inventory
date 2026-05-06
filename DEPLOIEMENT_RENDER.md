# Déploiement sur Render

## Prérequis

1. Compte Render gratuit : https://render.com
2. Compte GitHub (optionnel mais recommandé)

## Méthode 1 : Déploiement via Blueprint (Recommandé)

### Étape 1 : Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/inventaire-pro.git
git push -u origin main
```

### Étape 2 : Créer le service sur Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New"** → **"Blueprint"**
3. Connectez votre repo GitHub
4. Render détectera automatiquement le fichier `render.yaml`
5. Cliquez sur **"Apply"**

### Étape 3 : Attendre le déploiement

- Le build prend environ 2-3 minutes
- Render installe les dépendances, build le frontend et démarre le serveur
- Une fois terminé, vous recevrez une URL comme `https://inventaire-pro.onrender.com`

## Méthode 2 : Déploiement manuel

Si la méthode Blueprint ne fonctionne pas :

1. **New** → **"Web Service"**
2. Connectez votre repo
3. Configurez :
   - **Name** : `inventaire-pro`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
4. **Advanced** → Ajoutez un disk :
   - **Name** : `inventaire-data`
   - **Mount Path** : `/opt/render/project/src/backend/data`
   - **Size** : `1 GB`
5. **Create Web Service**

## Après le déploiement

### Importer vos données

Render fournit un shell en ligne :

1. Dans le dashboard Render, cliquez sur votre service
2. Onglet **"Shell"**
3. Exécutez les commandes d'import :

```bash
cd backend
node update-vins-new.js
node update-alcools.js
```

### Accéder à l'application

Votre application sera accessible à :
`https://inventaire-pro.onrender.com`

## Limitations du plan gratuit

- **Sleep** : Après 15 minutes d'inactivité, le serveur s'endort
- **Démarrage** : Première connexion peut prendre 30-60 secondes (réveil du serveur)
- **Disk** : 1 GB de stockage persistant (suffisant pour SQLite)
- **Monthly hours** : 750 heures/mois (environ 24h/jour)

## Dépannage

### Erreur "Build failed"

Vérifiez les logs dans Render Dashboard → Logs

### Base de données non persistante

Assurez-vous que le disk est bien configuré et monté sur `/opt/render/project/src/backend/data`

### Frontend ne s'affiche pas

Vérifiez que le build s'est bien passé :
```bash
# Dans le shell Render
ls -la frontend/dist/
```

## Support

Documentation Render : https://render.com/docs
