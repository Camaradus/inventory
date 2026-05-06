const { db, dbAsync } = require('./database');

// Liste EXACTE des alcools - fournie par l'utilisateur
// Ordre préservé, SANS modifications
const alcoolsCorrects = {
  "Armagnac Saint Vivant": 0,
  "Boulard Grand Solage": 0,
  "Morin Hors d'age 15 ans": 0,
  "Courvoisier VS": 0,
  "remy martin VSOP": 0,
  "remy martin XO": 0,
  "baileys 17°": 0,
  "tia maria - Hasselt Kaffe - Kahluwa": 0,
  "crème de cassis": 0,
  "Framboise": 0,
  "Kirsh": 0,
  "POIRE WILLIAMS": 0,
  "marc de Mirabelle": 0,
  "peterman 30°": 0,
  "Bombay Dry Gin": 0,
  "Bombay sapphire 40°": 0,
  "Hendricks 41,5°": 0,
  "Bull Dog": 0,
  "Tanqueray": 0,
  "Filliers 28": 0,
  "Mare": 0,
  "Engine": 0,
  "Grappa Francoli Bianca": 0,
  "Grappa Franoli Invecchiata": 0,
  "Grappe Francoli Miel": 0,
  "Barcelo Aneji": 0,
  "Cachaça 51": 0,
  "Bacardi Oro": 0,
  "Imperial": 0,
  "Zacapa 23Y": 0,
  "Diplomatico Reserva exclusiva": 0,
  "Don Papa": 0,
  "Havana 3 Anos": 0,
  "Havana Especial - Captain Morgan Dark": 0,
  "Havana 7 Anos": 0,
  "akvavit aalborg 42°": 0,
  "amaretto disaronno 28°": 0,
  "angostura aromatic 44,7°": 0,
  "cointreau 40°": 0,
  "get 31": 0,
  "get 27": 0,
  "grand marnier 40°": 0,
  "Jagermeister": 0,
  "limoncello Fresca Passione": 0,
  "limoncello Francoli": 0,
  "pimm's": 0,
  "pisang ambon": 0,
  "sambuca": 0,
  "Fernet Branca": 0,
  "Ramazzotti Amaro": 0,
  "Tequila - Rooster - Camino": 0,
  "Tequila - Cuervo Gold - Camino": 0,
  "Belvédère": 0,
  "Smirnoff": 0,
  "Absolut": 0,
  "J&B 40°": 0,
  "Bourbon": 0,
  "Jim Beam": 0,
  "Jack Daniel's 40°": 0,
  "John Jameson": 0,
  "johnnie walker black label 40°": 0,
  "Johnnie walker red label 40 °": 0,
  "Laphroaig 10 ans": 0,
  "Cragganmore": 0,
  "Talisker": 0,
  "Oban 14": 0,
  "Scapa": 0,
  "Glenmorangie": 0,
  "Belgian Owl Identiity": 0,
  "Busker": 0,
  "William lawson's": 0,
  "ricard": 0,
  "campari 25°": 0,
  "Aperol": 0,
  "Averna": 0,
  "cynar 16,5°": 0,
  "martini bianco 15°": 0,
  "Noilly prat": 0,
  "martini rosso 15°": 0,
  "Passoa": 0,
  "picon/orange 18°": 0,
  "Sarti Rosa": 0,
  "pineau des charentes": 0,
  "barros impérial tawny": 0,
  "barros impérial white": 0,
  "sherry domecq dry Fino 15°": 0,
  "sherry Fino la ina Very dry": 0,
  "jus de cranberry": 0,
  "SIROP DE NOISETTE GIFFARD 1L": 0,
  "SIROP DE COCO": 0,
  "sirop de cranberry": 0,
  "sirop de grenadine": 0,
  "sirop de menthe(Rioba-Metro)": 0,
  "sirop cassis (Monin)": 0,
  "sirop grenadine (Monin)": 0,
  "sirop de sucre de Fleur de Sureau": 0,
  "sirop Sucre de canne": 0
};

async function updateAlcools() {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const catAlcools = await dbAsync.get("SELECT id FROM categories WHERE nom = 'Alcools'");
    if (!catAlcools) {
      console.error('Catégorie Alcools non trouvée');
      return;
    }
    
    const categorieId = catAlcools.id;
    console.log('ID catégorie Alcools:', categorieId);
    
    console.log('Suppression des anciens alcools...');
    await dbAsync.run('DELETE FROM produits WHERE categorie_id = ?', [categorieId]);
    
    console.log('Importation des nouveaux alcools...');
    let ordre = 1;
    let count = 0;
    
    for (const [nom, stock] of Object.entries(alcoolsCorrects)) {
      await dbAsync.run(
        'INSERT INTO produits (nom, categorie_id, stock, unite, ordre) VALUES (?, ?, ?, ?, ?)',
        [nom, categorieId, stock, 'Litres', ordre++]
      );
      count++;
    }
    
    console.log(`✅ ${count} alcools importés avec succès !`);
    
    const verif = await dbAsync.get(
      'SELECT COUNT(*) as total FROM produits WHERE categorie_id = ?',
      [categorieId]
    );
    console.log('Total alcools en base:', verif.total);
    
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    db.close();
  }
}

updateAlcools();
