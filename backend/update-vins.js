const { db, dbAsync } = require('./database');

// Liste EXACTE des vins - fournie par l'utilisateur
// Ordre préservé, SANS modifications
const vinsCorrects = {
  "Blanc : Château des Eyssards, Bregerac (Moelleux)": 4,
  "Blanc: Les Grands Chemin Colombard-Sauvignon": 7,
  "Rouge: Les Grands Chemin, Carignan les Vieilles Vignes": 19,
  "Blanc : Croix des Vents, Chardonnay": 0,
  "Rouge : Arco De La Vega Tempranillo": 268,
  "Rosé: IGP Pays d'Oc Roches Saintes": 1,
  "Blanc : Chardonnay Reserve privee Conde Jose": 0,
  "Alsace Pinot gris Domaine Kuehn 37,5 cl": 0,
  "Alsace Pinot gris Domaine Kuehn 75 cl": 0,
  "Alsace Riesling Domaine Kuehn 75 cl": 0,
  "Alsace Grand Cru Kaefferkopf, Domaine Kuehn": 0,
  "Pinot Blanc, Domaine Kuehn": 0,
  "Les Fiefs Vendeens Mareuil blanc, Clos des Chaumes": 0,
  "Pouilly Fume, Les Duchesses, Maison Laporte": 0,
  "Vouvray, Sec, les Girardieres, Domaine FL": 0,
  "Sancerre Blanc \"Les Grandmontains\", Domaine Laporte 75cl": 0,
  "Sancerre Blanc \"Les Grandmontains\", Domaine Laporte 37,5 cl": 0,
  "Sancerre rouge \"Les Grandmontains\", Domaine Laporte 37,5 cl": 0,
  "Chardonnay Les Clos de Terre Dieu, Vieilles Vignes, fût de Chêne": 0,
  "Petit Chablis Jean Marc Brocard": 0,
  "Chablis 1er Cru Montmains": 0,
  "Pouilly Fuisse Chateau des Rontets Bourgogne 75 cl": 0,
  "Saint Veran Vieilles Vignes Château de Corcelles": 0,
  "Heritage la Clape \"An 1550\"": 0,
  "Chateau Hauty Mayne Grave 2015 - Reserve famille": 0,
  "CH DES EYSSARDS BLC PRESIGE": 0,
  "Viognier Gris du Trias / IGP d'Ardeche": 0,
  "Saumur Champigny \"Les Potees\"": 0,
  "Saint Nicolas de Bourgueil \"La Clos\", Le Clos du Vigneau": 0,
  "Chinon Tradition Domaine Pierre Sourdais": 0,
  "Chinon \"Gravelieres\", Domaine Jourdain, Biodynamie": 0,
  "Sancerre Rouge, \"Les Grandmontains\", Domaine Laporte 75 cl": 0,
  "Sancerre Rouge \"Les Grandmontains\", Domaine Laporte 37,5 cl": 0,
  "Chateauneuf du Pape, Maison Ogier": 0,
  "Cotes du Rhone Crozes-Hermitage": 0,
  "Artesis, Maison Ogier": 0,
  "Saint-Joseph \"La Source\" Ferraton Pere & Fils": 0,
  "Côtes : Rôtie, \"L'Eglantine, Ferraton Pere & Fils": 0,
  "Côtes du Rhône \"Sempiterns\", Ferraton Pere & Fils": 0,
  "Bourgogne Côte d'Or 2023": 0,
  "Pinot Noir Bourgogne": 0,
  "Morgon Château Pisay 75 cl": 0,
  "Morgon Château Pisay 37,5 cl": 0,
  "Saint-Amour": 0,
  "Chateau Vieux Moulin, Listrac Macon Cru Bourgeois 2009": 0,
  "Château Fleur Saintiges Bordeaux Supérieur": 0,
  "Château Fleur Listrac, St Emilion 37,5cl": 0,
  "Lalande de Pomerol, Château La Foret": 0,
  "Chateau Graves de Pez, Saint-Estephe": 0,
  "Delimontois Château Lescalle": 0,
  "Chateau Teynac, Saint Julien": 0,
  "Minervois et Cabardes \"Alibi\", Pierre Georges": 0,
  "Faugères les Jardins, Domaine St Antonin": 0,
  "Domaine de l'Aigle Pinot Noir": 0,
  "Cigalus IGP d'Oc": 0,
  "Clos de Terra Dieu, IGP Pays d'Oc, Syrah Vieilles Vignes": 0,
  "Côte de Provence Summertime by Laguadonne": 0,
  "Alsace Pinot noir Domaine Kuehn 75cl": 0,
  "Alsace Pinot noir Domaine Kuehn 37,5cl": 0,
  "Estaingdon Heritage 75cl": 0,
  "Insolence d'Estaingdon, IGP Mediterranee": 0,
  "Argentin blanc \"Bousquet Torrontes 75 cl (blanc)\"": 0,
  "Gran-Malbec, Bio, Mendoza, Bousquet (rouge)": 0,
  "Tinas - Pinot Noir - Chile": 0,
  "Les Vascos Gd Réserve (rouge)": 0,
  "Verdicchio dei castelli di Jesi (blanc)": 0,
  "Primitivo di Manduria, Puglia (rouge)": 0,
  "Brunello di Montalcino": 0,
  "Barolo \"Serralunga d'Alba\", DOCG, Fontanafredda": 0,
  "Vino Nobile di Montepulciano": 0,
  "Pinot grigio Rosato, Bosco del Merlo": 0,
  "Jea Huet Patron": 0,
  "Pomerol Brut": 0,
  "Ruinart": 0,
  "Taittinger": 0,
  "Cava Brut Recareda": 0,
  "Graves Clos du Monastere": 0,
  "Bordeaux lacoste rouge 25 cl": 0,
  "Petite bouteille Merlot": 0,
  "Alsace Pinot gris cuvée de l'Ours Noir Cattlin 37,5 cl": 0,
  "Alsace Pinot noir cuvée de l'Ours Noir Cattlin 75 cl": 0,
  "Riesling cuvées de l'Ours Noir Trier Cattlin 75 cl": 0,
  "Gewurztraminer Eric Rimmelin": 0,
  "Contrepoint Vin de Liège (Blanc sec)": 0,
  "Les Agapes Vin de Liège (rosé)": 0,
  "Odyssée Vin de Liège (Rouge)": 0,
  "Grave, Clos du Monastere": 0,
  "Haut-Médoc Vin Bourgeois, Domaine de Cartulac": 0,
  "Alsace Pinot noir cuvée de l'Ours Noir Cattlin 75 cl": 0
};

async function updateVins() {
  try {
    // Attendre que la base soit prête
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Récupérer l'ID de la catégorie Vins
    const catVins = await dbAsync.get("SELECT id FROM categories WHERE nom = 'Vins'");
    if (!catVins) {
      console.error('Catégorie Vins non trouvée');
      return;
    }
    
    const categorieId = catVins.id;
    console.log('ID catégorie Vins:', categorieId);
    
    // Supprimer les anciens vins
    console.log('Suppression des anciens vins...');
    await dbAsync.run('DELETE FROM produits WHERE categorie_id = ?', [categorieId]);
    
    // Importer les nouveaux vins
    console.log('Importation des nouveaux vins...');
    let ordre = 1;
    let count = 0;
    
    for (const [nom, stock] of Object.entries(vinsCorrects)) {
      await dbAsync.run(
        'INSERT INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, categorieId, stock, 'bouteilles', ordre++]
      );
      count++;
    }
    
    console.log(`✅ ${count} vins importés avec succès !`);
    
    // Vérifier
    const verif = await dbAsync.get(
      'SELECT COUNT(*) as total FROM produits WHERE categorie_id = ?',
      [categorieId]
    );
    console.log('Total vins en base:', verif.total);
    
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    db.close();
  }
}

updateVins();
