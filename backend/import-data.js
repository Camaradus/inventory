const fs = require('fs');
const path = require('path');
const { db, dbAsync } = require('./database');

// Données des CSV
const data = {
  vins: {
    "Blanc : Château des Eyssards, Brégerac (Moelleux)": 4,
    "Blanc : Les Grands Chemin Colombard-Sauvignon": 7,
    "Rouge : Les Grands Chemin, Carignan les Vieilles Vignes": 19,
    "Blanc : Croix des Vents, Chardonnay": 0,
    "Rouge : Arco De La Vega Tempranillo": 268,
    "Rose : IGP Pays d'Oc Roches Saintes": 1,
    "Blanc : AOP Bordeaux Chenin": 24,
    "Blanc : AOP Entre-Deux-Mers Château Escalle": 4,
    "Blanc : AOP Graves Château du Lestiac": 8,
    "Blanc : Terre Fort Chardonnay": 1,
    "Blanc : AOP Sancerre Michel Thomas": 11,
    "Blanc : IGP d'Oc Chardonnay": 33,
    "Blanc : IGP d'Oc Sauvignon": 32,
    "Blanc : AOP Pouilly-Fumé Michel Thomas": 1,
    "Blanc : Terre Fort Sauvignon": 1,
    "Blanc : AOP Pouilly-Fuisse La Maison du Bois": 6,
    "Blanc : AOP Chablis Jean Marc Brocard": 2,
    "Blanc : AOP Alsace Gewurztraminer": 2,
    "Blanc : Vouvray Brut Chenin": 12,
    "Blanc : Prosecco 75cl Terra Serena": 12,
    "Blanc : Prosecco 20cl Terra Serena": 4,
    "Rouge : Bordeaux Supérieur Château de l'Estang": 1,
    "Rouge : Bordeaux Supérieur Château Labrande": 11,
    "Rouge : AOP Graves Château des Eyssards": 1,
    "Rouge : IGP Pays d'Oc Merlot": 8,
    "Rouge : IGP Cotes de Gascogne Merlot": 12,
    "Rouge : AOP Corbieres": 1,
    "Rouge : Cotes de Bourg Château Civrac": 3,
    "Rouge : IGP Gard Cabernet-Sauvignon": 6,
    "Rouge : IGP Ardeche Cabernet-Sauvignon": 23,
    "Rouge : AOP Cotes du Rhône Villages Les Vialles": 7,
    "Rouge : Crozes Hermitage Domaine Picard": 6,
    "Rouge : Saint Joseph Les Grands Chemins": 6,
    "Rouge : Lirac Les Grands Chemins": 1,
    "Rouge : Terre Fort Cabernet-Sauvignon": 1,
    "Rouge : Terre Fort Malbec": 1,
    "Rouge : Domaine Condamine l'Eveque Pinots Noirs": 1,
    "Rouge : Cotes du Rhône Villages Domaine de la Baume": 3,
    "Rouge : Crozes Hermitage Domaine Picard": 2,
    "Rouge : IGP Ardeche Cabernet-Sauvignon": 2,
    "Rouge : Domaine du Bourg Neuf": 6,
    "Rouge : Saint Nicolas de Bourgueil Domaine des Chaumes": 4,
    "Rouge : Château Micoulaud Marie-France et Philippe Chapon": 5,
    "Rouge : Chinon Les Terrasses": 4,
    "Rouge : Saint Emilion Château Bonnet": 7,
    "Rouge : IGP Pays du Gard Merlot": 7,
    "Rouge : Bordeaux Supérieur Château de l'Estang": 9,
    "Rose : IGP d'Oc Grenache": 14,
    "Rose : IGP Cotes de Gascogne Merlot": 24,
    "Rose : IGP Pays d'Oc Grenache Cinsault": 4,
    "Rose : Cotes de Provence La Forge Estate": 8,
    "Rose : Cotes de Provence Château Ferage": 3,
    "Rose : Château La Gordonne": 11,
    "Champagne": 2
  },
  alcools: {
    "Amaretto Disaronno": 4.50,
    "Amaretto Fioravanti": 0.50,
    "Anisette": 0.30,
    "Aperol": 2.00,
    "Bacardi": 2.00,
    "Bombay Sapphire": 0.20,
    "Brugal Especial": 0.00,
    "Bulldog": 0.50,
    "Cachaça Velho Barreiro": 0.50,
    "Calvados Busnel VSOP": 1.00,
    "Camus VSOP": 0.20,
    "Campari": 0.70,
    "Cointreau": 2.50,
    "Delord VSOP": 2.50,
    "Disaronno": 1.00,
    "Drambuie": 0.50,
    "Fernet Branca": 1.00,
    "Fruko Schulz Triple sec": 1.00,
    "Get 27": 2.00,
    "Get 31": 0.80,
    "Gin Bombay Sapphire": 0.50,
    "Gin Bulldog": 0.50,
    "Gin Mare": 0.00,
    "Gordons": 0.50,
    "Grand Marnier Cordon Rouge": 0.40,
    "Grand Marnier Jaune": 0.00,
    "Havana Club Anejo 7 Ans": 2.00,
    "Hendricks": 0.00,
    "Johnnie Walker Red Label": 1.00,
    "Ketel One": 0.00,
    "La Gioiosa Prosecco": 1.50,
    "Lindemans Cassis": 0.00,
    "Lindemans Framboise": 0.50,
    "Lindemans Kriek": 1.50,
    "Lindemans Peche": 0.00,
    "Malfy Gin": 0.00,
    "Martini Blanco": 0.00,
    "Martini Rosso": 0.50,
    "Matusalem 15Y": 1.50,
    "Matusalem Platino": 0.50,
    "Metaxa *****": 1.00,
    "Michter's American": 1.00,
    "Nordes": 1.00,
    "Passoã": 1.50,
    "Pisang Ambon": 0.20,
    "Porto Ferreira Tawny": 2.00,
    "Porto Sandeman White": 1.00,
    "Ricard": 2.00,
    "Ron Varadero Anejo 7 Años": 0.00,
    "Rum Sixty Six": 0.50,
    "Sierra Antiguo Plata": 0.00,
    "Sierra Milenario Reposado": 1.50,
    "Somersby Apple": 0.00,
    "Somersby Watermelon": 0.00,
    "Suze": 1.00,
    "Tequila Olmeca Gold": 1.00,
    "Tequila Olmeca Reposado": 0.00,
    "Tequila Sauza Silver": 1.00,
    "The Botanist": 0.00,
    "Zubrowka": 1.00
  },
  softs: {
    "Peak Blonde (fût 20L)": 0,
    "Paix Dieu (fût 20L)": 3,
    "Karmeliet (fût 30L)": 2,
    "CO² (bombone)": 1,
    "Jupiler (fût 50L)": 2,
    "Jupiler (fût 30L)": 0,
    "Duvel (bouteille 33cl)": 19,
    "Jupiler 0% (bouteille 25cl)": 28,
    "Leffe brune (bouteille 33cl)": 21,
    "Orval (bouteille 33cl)": 5,
    "Rochefort 10° Trappiste (bouteille 33cl)": 48,
    "Val Dieux Triple (bouteille 33cl)": 24,
    "Westmalle triple (bouteille 33cl)": 32,
    "Hoegaarden (bouteille 25cl)": 9,
    "Pecheresse (bouteille 25cl)": 5,
    "Liefmans (bouteille 25cl)": 0,
    "Peak Blonde (bouteille 33cl)": 0,
    "Peak Triple (bouteille 33cl)": 0,
    "Victoria (bouteille 33cl)": 0,
    "Karmeliet Triple (bouteille 33cl)": 0,
    "Duvel Tripel Hop (bouteille 33cl)": 23,
    "Jupiler (bouteille 25cl)": 96,
    "Spa Reine 1L": 0,
    "Spa Reine ½L": 12,
    "Spa Reine ¼L": 28,
    "Spa Intense 1L": 0,
    "Spa Intense ½L": 19,
    "Spa Intense ¼L": 17,
    "Coca cola (20cl)": 0,
    "Coca cola zero (20cl)": 0,
    "FEVER TREE MEDITEREAN (20cl)": 22,
    "Coca 1 Zéro litre (6x100cl)": 0,
    "Coca 1 L (6x100cl)": 0,
    "Schweppes Ginger Ale (20cl)": 0,
    "Schweppes Hibiscus (20cl)": 0,
    "Schweppes Pomelo (20cl)": 0,
    "Schweppes Pink Pepper (20cl)": 0,
    "Schweppes Ginger beer (20cl)": 0,
    "Schweppes Indian Tonic (20cl)": 16,
    "Fuze tea Peach Hibiscus (20cl)": 0,
    "Fuze tea Green Macha (20cl)": 8,
    "Fuze Tea Black sparkling (20cl)": 35,
    "Fanta (20cl)": 21,
    "Sprite (20cl)": 33,
    "Red Bull (25cl)": 15,
    "Looza ananas (20cl)": 0,
    "Looza Orange (20cl)": 0,
    "Looza Pomme (20cl)": 0,
    "Looza Tomate (20cl)": 0,
    "Looza Pomme cerise (20cl)": 30,
    "Looza Fraise (20cl)": 0,
    "Casier vide": 5,
    "Fût 50L (caution)": 3,
    "Fût 30L (caution)": 3,
    "CO2 caution": 0
  },
  cafes: {
    "Café super Crema (Lavazza)": 42,
    "Décaféiné Lavazza": 6,
    "Café Starbucks": 0
  },
  thes: {
    "Rooibo Chai": 2,
    "Chamomille": 2,
    "Tilleul (tisane)": 2,
    "Mint Verbena": 0,
    "Organic green with mint": 2,
    "Earl grey supreme": 1,
    "Paris": 0,
    "Hot cinnamon spice noir": 1,
    "Raspberry Herbal": 1,
    "Organic English Breakfast": 1
  },
  divers: {
    "Eau Culigan": 22,
    "Bougies ch plat 8H 100 pcs": 1,
    "Mignonnettes noire": 2,
    "Mignonnettes lait": 2,
    "Hot mix": 3,
    "Sucre perruche blc": 2,
    "Sucre perruche canne": 2,
    "Nesquick": 0,
    "Cure dent 8 cm 1000p bois": 1,
    "Pailles noirs 15 cm": 3,
    "Pailles noirs 24 cm": 3,
    "Salami Marcassou": 0,
    "Fromage bar": 0,
    "Rouleau imprimante": 3,
    "Pochette serviette": 2,
    "Augustura": 1
  }
};

async function importData() {
  try {
    // Attendre que la base soit prête
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Récupérer les catégories
    const categories = await dbAsync.all('SELECT * FROM categories');
    const catMap = {};
    categories.forEach(c => {
      catMap[c.nom] = c.id;
    });
    
    console.log('Catégories trouvées:', catMap);
    
    // Importer les vins
    console.log('Importation des vins...');
    let ordre = 1;
    for (const [nom, stock] of Object.entries(data.vins)) {
      await dbAsync.run(
        'INSERT OR IGNORE INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, catMap['Vins'], stock, 'bouteilles', ordre++]
      );
    }
    
    // Importer les alcools
    console.log('Importation des alcools...');
    ordre = 1;
    for (const [nom, stock] of Object.entries(data.alcools)) {
      await dbAsync.run(
        'INSERT OR IGNORE INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, catMap['Alcools'], stock, 'Litres', ordre++]
      );
    }
    
    // Importer les softs
    console.log('Importation des softs...');
    ordre = 1;
    for (const [nom, stock] of Object.entries(data.softs)) {
      await dbAsync.run(
        'INSERT OR IGNORE INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, catMap['Softs & Bières'], stock, 'unités', ordre++]
      );
    }
    
    // Importer les cafés
    console.log('Importation des cafés...');
    ordre = 1;
    for (const [nom, stock] of Object.entries(data.cafes)) {
      await dbAsync.run(
        'INSERT OR IGNORE INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, catMap['Cafés'], stock, 'unités', ordre++]
      );
    }
    
    // Importer les thés
    console.log('Importation des thés...');
    ordre = 1;
    for (const [nom, stock] of Object.entries(data.thes)) {
      await dbAsync.run(
        'INSERT OR IGNORE INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, catMap['Thés'], stock, 'unités', ordre++]
      );
    }
    
    // Importer les divers
    console.log('Importation des divers...');
    ordre = 1;
    for (const [nom, stock] of Object.entries(data.divers)) {
      await dbAsync.run(
        'INSERT OR IGNORE INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, catMap['Divers'], stock, 'unités', ordre++]
      );
    }
    
    console.log('✅ Importation terminée !');
    
    // Afficher les stats
    const stats = await dbAsync.all(`
      SELECT c.nom, COUNT(p.id) as nb_produits 
      FROM categories c 
      LEFT JOIN produits p ON c.id = p.categorie_id 
      GROUP BY c.id
    `);
    console.log('Statistiques:', stats);
    
  } catch (err) {
    console.error('❌ Erreur lors de l\'importation:', err);
  } finally {
    db.close();
  }
}

importData();
