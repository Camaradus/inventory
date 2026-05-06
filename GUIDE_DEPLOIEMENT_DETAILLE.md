# Guide Détaillé - Option A : GitHub + Render Blueprint

## 📋 Vue d'ensemble

Cette méthode utilise GitHub pour stocker votre code et Render pour l'héberger automatiquement. Le fichier `render.yaml` que j'ai créé configure tout automatiquement.

---

## ÉTAPE 1 : Créer un compte GitHub

### 1.1 Inscription
1. Allez sur https://github.com
2. Cliquez sur **"Sign up"** (en haut à droite)
3. Entrez votre email
4. Créez un mot de passe
5. Choisissez un nom d'utilisateur (ex: `moniq-inventaire`)
6. Validez votre email

### 1.2 Vérification
- Vous recevrez un email de confirmation
- Cliquez sur le lien pour activer le compte

---

## ÉTAPE 2 : Créer un repository (dossier) sur GitHub

### 2.1 Nouveau repository
1. Connectez-vous à GitHub
2. Cliquez sur le **+** (en haut à droite) → **"New repository"**
3. Remplissez le formulaire :
   - **Repository name** : `inventaire-pro`
   - **Description** : `Application d'inventaire de boissons`
   - Cochez **"Public"** (gratuit)
   - Cochez **"Add a README file"**
4. Cliquez sur **"Create repository"**

### 2.2 Récupérer l'URL du repository
- L'URL ressemblera à : `https://github.com/VOTRE_USERNAME/inventaire-pro`
- Notez-la, vous en aurez besoin

---

## ÉTAPE 3 : Installer Git sur votre ordinateur

### 3.1 Téléchargement
1. Allez sur https://git-scm.com/download/win
2. Téléchargez l'installateur
3. Exécutez-le (cliquez "Next" jusqu'à la fin)

### 3.2 Vérification
Ouvrez PowerShell et tapez :
```powershell
git --version
```
Si vous voyez un numéro de version, c'est installé.

---

## ÉTAPE 4 : Configurer Git

Dans PowerShell, exécutez (avec VOTRE email et nom) :

```powershell
git config --global user.email "votre-email@exemple.com"
git config --global user.name "Votre Nom"
```

---

## ÉTAPE 5 : Envoyer le projet sur GitHub

### 5.1 Ouvrir PowerShell dans le dossier du projet
1. Ouvrez PowerShell
2. Allez dans le dossier (adaptez le chemin si nécessaire) :

```powershell
cd "C:\Users\moniq\OneDrive\Bureau\Inventaire\InventairePro"
```

### 5.2 Commandes Git (copiez-collez une par une)

**Commande 1** - Initialiser Git :
```powershell
git init
```
Résultat attendu : `Initialized empty Git repository`

**Commande 2** - Ajouter tous les fichiers :
```powershell
git add .
```
(Pas de message = OK)

**Commande 3** - Créer un "commit" :
```powershell
git commit -m "Premier envoi sur GitHub"
```
Résultat : liste des fichiers ajoutés

**Commande 4** - Renommer la branche principale :
```powershell
git branch -M main
```

**Commande 5** - Connecter à GitHub (REMPLACEZ VOTRE_USERNAME) :
```powershell
git remote add origin https://github.com/VOTRE_USERNAME/inventaire-pro.git
```

Exemple réel si votre nom est `moniq2024` :
```powershell
git remote add origin https://github.com/moniq2024/inventaire-pro.git
```

**Commande 6** - Envoyer sur GitHub :
```powershell
git push -u origin main
```
- Il va demander votre nom d'utilisateur GitHub
- Puis votre mot de passe (ou token si vous avez activé la 2FA)

Résultat attendu : `Writing objects: 100%` puis `Branch main pushed`

---

## ÉTAPE 6 : Vérifier sur GitHub

1. Retournez sur https://github.com
2. Cliquez sur votre repository `inventaire-pro`
3. Vous devriez voir tous les fichiers :
   - `backend/`
   - `frontend/`
   - `render.yaml`
   - `package.json`
   - etc.

---

## ÉTAPE 7 : Créer un compte Render

1. Allez sur https://render.com
2. Cliquez **"Get Started for Free"**
3. Inscrivez-vous avec votre email (ou "Continue with GitHub")
4. Vérifiez votre email

---

## ÉTAPE 8 : Connecter GitHub à Render

### 8.1 Autoriser l'accès
1. Dans le dashboard Render, cliquez sur votre profil (en haut)
2. **"Settings"** → **"GitHub"**
3. Cliquez **"Connect GitHub"**
4. Autorisez Render à accéder à vos repositories

---

## ÉTAPE 9 : Déployer avec Blueprint

### 9.1 Lancer le Blueprint
1. Dans le dashboard Render, cliquez **"New"** (bouton bleu)
2. Sélectionnez **"Blueprint"**

### 9.2 Choisir le repository
1. Sélectionnez `inventaire-pro` dans la liste
2. Cliquez **"Connect"**

### 9.3 Vérifier la configuration
Render va lire le fichier `render.yaml` et afficher :
- **Service Name** : `inventaire-pro`
- **Runtime** : `Node`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`
- **Disk** : `inventaire-data` (1 GB)

### 9.4 Appliquer
1. Cliquez **"Apply"** ou **"Create Resources"**
2. Attendez que Render configure tout (1-2 minutes)

---

## ÉTAPE 10 : Attendre le déploiement

### 10.1 Suivre la progression
1. Cliquez sur le service `inventaire-pro`
2. Allez dans l'onglet **"Logs"**
3. Vous verrez :
   - Installation des dépendances
   - Build du frontend
   - Démarrage du serveur

### 10.2 Temps estimé
- **Build** : 2-3 minutes
- **Déploiement** : 30 secondes

### 10.3 Vérifier le succès
Dans les logs, cherchez :
```
🚀 Serveur démarré sur http://localhost:10000
📁 Frontend servi depuis: ...
```

---

## ÉTAPE 11 : Accéder à l'application

### 11.1 Récupérer l'URL
1. Dans le dashboard Render, cliquez sur `inventaire-pro`
2. L'URL est en haut, exemple :
   `https://inventaire-pro.onrender.com`

### 11.2 Premier test
1. Ouvrez l'URL dans votre navigateur
2. Vous devriez voir l'interface de l'inventaire
3. Les onglets Vins/Alcools/etc. doivent apparaître

⚠️ **Premier démarrage** : Si le serveur était endormi, attendez 30-60 secondes.

---

## ÉTAPE 12 : Importer vos données (CRUCIAL)

Par défaut, la base est vide. Vous devez importer vos vins et alcools.

### 12.1 Ouvrir le shell Render
1. Dans le dashboard Render, cliquez sur `inventaire-pro`
2. En haut à droite, cliquez **"Shell"**
3. Un terminal s'ouvre en ligne

### 12.2 Commandes d'import
**Tapez ces commandes une par une** :

```bash
cd backend
node update-vins-new.js
```
Attendez : `✅ 88 vins importés avec succès !`

```bash
node update-alcools.js
```
Attendez : `✅ 97 alcools importés avec succès !`

### 12.3 Vérifier l'import
1. Rafraîchissez l'URL de l'application (F5)
2. Vérifiez que vos produits apparaissent

---

## ✅ DÉPLOIEMENT TERMINÉ !

Votre application est maintenant en ligne à :
`https://inventaire-pro.onrender.com`

---

## 🔧 Maintenance

### Mettre à jour l'application
Si vous modifiez le code en local :

```powershell
cd "C:\Users\moniq\OneDrive\Bureau\Inventaire\InventairePro"
git add .
git commit -m "Description des changements"
git push origin main
```

Render se mettra à jour automatiquement !

### Redémarrer le serveur
Dans le dashboard Render → votre service → **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🆘 Dépannage

### "Build failed"
Voir les logs détaillés : Dashboard → Logs → télécharger

### "Cannot find module"
Le fichier `package.json` est mal configuré. Vérifiez qu'il est sur GitHub.

### Base de données vide après redémarrage
Vérifiez que le disk est monté :
Dashboard → Service → **"Disks"** doit montrer `inventaire-data`

### Page blanche
Le build frontend a échoué. Vérifiez que `frontend/dist/` existe après le build.

---

## 📞 Besoin d'aide ?

- **Render Docs** : https://render.com/docs
- **GitHub Docs** : https://docs.github.com
- **Logs Render** : Dashboard → votre service → Logs (toujours la première chose à vérifier)
