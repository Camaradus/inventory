const { db, dbAsync } = require('./database');

// Liste EXACTE des vins - fournie par l'utilisateur
// Ordre préservé, SANS modifications
const vinsCorrects = {
  "Blanc : Château des Eyssards, Bregerac (Moelleux)": 0,
  "Blanc: Les Grands Chemin Colombard-Sauvignon": 0,
  "Rouge: Les Grands Chemin, Carignan les Vieilles Vignes": 0,
  "Blanc : Croix des Vents, Chardonnay": 0,
  "Rouge : Arco De La Vega Tempranillo": 0,
  "Rosé: IGP Pays d'Oc Roches Saintes": 0,
  "Blanc : Chardonnay Reserva privada Conde José": 0,
  "Alsace Pinot gris Domaine Kuehn 37.5 cl": 0,
  "Alsace Pinot gris Domaine Kuehn 75 cl": 0,
  "Riesling Domaine Kuehn 75 cl": 0,
  "Alsace Grand Cru Kaefferkopf, Domaine Kuehn": 0,
  "Pinot Blanc, Domaine Kuehn": 0,
  "Les Fiefs Vendéens Mareuil blanc, Clos des Chaumes": 0,
  "Pouilly Fume, Les Duchesses, Maison Laporte": 0,
  "Vouvray sec les perruches": 0,
  "Sancerre Blanc \"Les Grandmontains\", Domaine Laporte 75cl": 0,
  "Sancerre Blanc \"Les Grandmontains\", Domaine Laporte 37,5 cl": 0,
  "Chardonnay Les Clés de Terre Dieu, Vieille Vignes, fût de Chêne": 0,
  "Petit Chablis Jean Marc Brocard": 0,
  "Chablis 1er Cru Montmains": 0,
  "Pouilly fuisse Château de Beauregard 75 cl": 0,
  "Saint Veran Vielles Vignes Château des Correaux": 0,
  "Héritage la Clape \"An 1650\"": 0,
  "Chateau Hauty Mayne Grave 2015 - Réseve famille": 0,
  "CH DES EYSSARDS BLC PRESTIGE": 0,
  "Viognier \"Grès du Trias\" IGP d'Ardèche": 0,
  "Saumur Champigny vielles vignes": 0,
  "Saint Nicolas de Bourgueil \"Le Clos\", Le Clos du Vigneau": 0,
  "Chinon Tradition Domaine Pierre Sourdais": 0,
  "Chinon \"Gravenières\", Domaine Jourdan, Biodynamie": 0,
  "Sancerre Rouge, \"Les Grandmontains\", Domaine Laporte 75 cl": 0,
  "Sancerre Rouge, \"Les Grandmontains\", Domaine Laporte 37,5 cl": 0,
  "Vacquéras La Boiseraie, Maison Ogier": 0,
  "Chateauneuf du Pape, Maison Ogier": 0,
  "Artésis, Maison Ogier": 0,
  "Saint-Joseph \"La Source\" Ferraton Père & Fils": 0,
  "Côtes-Rôtie, l'Eglantine, Ferraton Père & Fils": 0,
  "Côtes du Rhône \"Samorëns\", Ferraton Père & Fils": 0,
  "Bourgogne Cote d'Or Pressonier": 0,
  "Pinot Noir Bourgogne": 0,
  "Morgon Château Pisay 75 cl": 0,
  "Morgon Château Pisay 37.5 cl": 0,
  "Saint-Amour": 0,
  "Chateau Vieux Moulin, Listrac Medoc Cru Bourgeois 2009": 0,
  "Château Fleur Lartigue, St Emilion": 0,
  "Château Fleur Lartigue, St Emilion 37,5cl": 0,
  "Lalande de Pomerol, Château La Foret": 0,
  "Château Graves de Pez, Saint-Estèphe": 0,
  "Delmonico Château Lescalle": 0,
  "Château Teynac, Saint-Julien": 0,
  "Minervois et cetera Domaine Terre Georges": 0,
  "Faugere Les Jardins Domaine St Antonin": 0,
  "Domaine de l'Aigle Pinot Noir": 0,
  "Cigalus IGP d'Oc": 0,
  "Clefs de Terre Dieu, IGP Pays dOc, Syrah Vieilles Vignes": 0,
  "Côte de Provence Summertime by Lagordonne": 0,
  "Alsace Pinot noir Domaine Kuehn 75cl": 0,
  "Alsace Pinot noir Domaine Kuehn 37,5cl": 0,
  "Estandon Heritage 75cl.": 0,
  "Insolence d'Estandon, IGP Méditerranée": 0,
  "Argentin blanc Bousquet Torrontes 75 cl (blanc)": 0,
  "Gran-Malbec, Bio, Mendoza, Bousquet (rouge)": 0,
  "Tiare - Pinot Nero - Friul - IT": 0,
  "Los Vascos Gd Réserve (rouge)": 0,
  "Verdicchio dei castelli di Jesi (blanc)": 0,
  "Primitivo di Manduria, Puglia (rouge)": 0,
  "Brunello di Montalcino": 0,
  "Barolo Serralunga d'Alba DOCG Fontanafredda": 0,
  "Vino Nobile di Montepulciano": 0,
  "Pinot Grigio Rosato, Bosco del Merlo": 0,
  "Jean Noel Haton": 0,
  "Pommery brut": 0,
  "Ruinart": 0,
  "Taittinger": 0,
  "Cava Brut Recoda": 0,
  "Graves Clos du Monastère": 0,
  "Bordeaux lacoste rouge 25 cl": 0,
  "Petite bouteille Merlot": 0,
  "Alsace Pinot gris cuvée de l'Ours Noir Cattin 37.5 cl": 0,
  "Alsace Pinot gris cuvée de l'Ours Noir Cattin 75 cl": 0,
  "Riesling cuvée de l'Ours Noir Theo Cattin 75 cl": 0,
  "Gewurztraminer Eric Rominger": 0,
  "Contrepoint Vin de Liège (Blanc sec)": 0,
  "Les Agapes Vin de Liège (rosé)": 0,
  "Odyssée Vin de Liège (Rouge)": 0,
  "Grave, Clos du Monastère 75 cl": 0,
  "Haut Medoc Cru Bourgeois, Domaine de Cartujac": 0,
  "Alsace Pinot noir cuvée de l'Ours Noir Cattin 75 cl": 0
};

async function updateVins() {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const catVins = await dbAsync.get("SELECT id FROM categories WHERE nom = 'Vins'");
    if (!catVins) {
      console.error('Catégorie Vins non trouvée');
      return;
    }
    
    const categorieId = catVins.id;
    console.log('ID catégorie Vins:', categorieId);
    
    console.log('Suppression des anciens vins...');
    await dbAsync.run('DELETE FROM produits WHERE categorie_id = ?', [categorieId]);
    
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
