import sqlite3

# Liste EXACTE des alcools - fournie par l'utilisateur
alcools_corrects = [
    ("Gin Bombay 1L", 0),
    ("Gordon's 1L", 0),
    ("Hendrick's", 0),
    ("Gin Mare", 0),
    ("Tanqueray", 0),
    ("Gin Citadelle", 0),
    ("Gin G'vine", 0),
    ("Vodka Absolut 1L", 0),
    ("Vodka Belvedere", 0),
    ("Vodka Grey Goose", 0),
    ("Vodka Ketel One", 0),
    ("Vodka Cîroc", 0),
    ("Vodka Van Gogh", 0),
    ("Vodka Eristoff", 0),
    ("Rhum Bacardi 1L", 0),
    ("Rhum Havana Club 3 ans 1L", 0),
    ("Rhum Havana Club 7 ans", 0),
    ("Rhum Don Papa", 0),
    ("Rhm Diplomatico", 0),
    ("Rum Santa Teresa", 0),
    ("Rhum Plantation", 0),
    ("Rhum JM", 0),
    ("Rhum HSE", 0),
    ("Rhum Clement", 0),
    ("Tequila Patron Silver", 0),
    ("Tequila Patron Reposado", 0),
    ("Tequila Patron Anejo", 0),
    ("Tequila Don Julio Blanco", 0),
    ("Tequila Don Julio Reposado", 0),
    ("Tequila Don Julio 1942", 0),
    ("Tequila Casamigos", 0),
    ("Tequila El Jimador", 0),
    ("Tequila Olmeca", 0),
    ("Tequila Sierra", 0),
    ("Whisky Jack Daniel's 1L", 0),
    ("Whisky Jameson 1L", 0),
    ("Whisky Johnnie Walker Red 1L", 0),
    ("Whisky Johnnie Walker Black", 0),
    ("Whisky Johnnie Walker Blue", 0),
    ("Whisky Chivas 12 ans", 0),
    ("Whisky Chivas 18 ans", 0),
    ("Whisky Ballantine's", 0),
    ("Whisky Grant's", 0),
    ("Whisky Glenfiddich 12 ans", 0),
    ("Whisky Glenfiddich 15 ans", 0),
    ("Whisky Glenfiddich 18 ans", 0),
    ("Whisky Glenlivet 12 ans", 0),
    ("Whisky Glenlivet 15 ans", 0),
    ("Whisky Macallan 12 ans", 0),
    ("Whisky Macallan 15 ans", 0),
    ("Whisky Macallan 18 ans", 0),
    ("Whisky Aberlour", 0),
    ("Whisky Bowmore", 0),
    ("Whisky Laphroaig", 0),
    ("Whisky Lagavulin", 0),
    ("Whisky Talisker", 0),
    ("Whisky Ardbeg", 0),
    ("Cognac Hennessy VS", 0),
    ("Cognac Hennessy VSOP", 0),
    ("Cognac Hennessy XO", 0),
    ("Cognac Remy Martin VSOP", 0),
    ("Cognac Remy Martin XO", 0),
    ("Cognac Courvoisier VS", 0),
    ("Cognac Courvoisier VSOP", 0),
    ("Cognac Martell VS", 0),
    ("Cognac Martell VSOP", 0),
    ("Cognac Martell Cordon Bleu", 0),
    ("Calvados Boulard", 0),
    ("Calvados Pere Magloire", 0),
    ("Armagnac", 0),
    ("Get 27", 0),
    ("Get 31", 0),
    ("Cointreau", 0),
    ("Grand Marnier", 0),
    ("Bailey's", 0),
    ("Kahlua", 0),
    ("Tia Maria", 0),
    ("Amaretto Disaronno", 0),
    ("Frangelico", 0),
    ("Sambuca", 0),
    ("Pastis 51 1L", 0),
    ("Pastis Ricard 1L", 0),
    ("Pernod", 0),
    ("Absinthe", 0),
    ("Chartreuse Verte", 0),
    ("Chartreuse Jaune", 0),
    ("Campari", 0),
    ("Aperol", 0),
    ("Vermouth Martini Rosso", 0),
    ("Vermouth Martini Bianco", 0),
    ("Vermouth Noilly Prat", 0),
    ("Lillet Blanc", 0),
    ("Lillet Rouge", 0),
    ("Dubonnet", 0),
    ("Picon", 0),
    ("Suze", 0),
    ("Pisang Ambon", 0)
]

def update_alcools():
    conn = sqlite3.connect('inventaire.db')
    cursor = conn.cursor()
    
    # Trouver l'ID de la catégorie Alcools
    cursor.execute("SELECT id FROM categories WHERE nom = 'Alcools'")
    result = cursor.fetchone()
    
    if not result:
        print("❌ Catégorie Alcools non trouvée")
        conn.close()
        return
    
    categorie_id = result[0]
    print(f"ID catégorie Alcools: {categorie_id}")
    
    # Supprimer les anciens alcools
    print("Suppression des anciens alcools...")
    cursor.execute("DELETE FROM produits WHERE categorie_id = ?", (categorie_id,))
    
    # Importer les nouveaux alcools
    print("Importation des nouveaux alcools...")
    ordre = 1
    for nom, stock in alcools_corrects:
        cursor.execute('''
            INSERT INTO produits (nom, categorie_id, stock, unite, ordre)
            VALUES (?, ?, ?, ?, ?)
        ''', (nom, categorie_id, stock, 'bouteilles', ordre))
        ordre += 1
    
    conn.commit()
    
    # Vérification
    cursor.execute("SELECT COUNT(*) FROM produits WHERE categorie_id = ?", (categorie_id,))
    count = cursor.fetchone()[0]
    
    print(f"✅ {count} alcools importés avec succès !")
    conn.close()

if __name__ == '__main__':
    update_alcools()
