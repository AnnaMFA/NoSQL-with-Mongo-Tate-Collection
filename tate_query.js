db.tate.find()

//obras de Lautrec en la Tate Colection
var query = {'artist': 'Toulouse-Lautrec, Henri de'}
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0  }
db.tate.find (query, proyeccion)

// suponemos que la colección ha adquirido una nueva obra - ejercicio de insert 
var nueva_obra = {'artist': 'Toulouse-Lautrec, Henri de', 'title': 'La toilette', 'medium': 'oil on canvas', 'year': '1896', 'acquisitionyear': '2024'}
var query = {'artist': 'Toulouse-Lautrec, Henri de'}
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0  }
db.tate.insertOne(nueva_obra)
db.tate.find(query, proyeccion)

var nueva_obra = {'artist': 'Toulouse-Lautrec, Henri de', 'title': 'La toilette', 'medium': 'oil on canvas', 'year': '1896', 'acquisitionyear': '2024'}
db.tate.deleteMany(nueva_obra)
db.tate.find()

// Quiero añadir un campo que se llame 'Estilo' a aquellas obras producidas en un año concreto

//por ejemplo, hemos añadido el estilo "Arte contemporaneo" a aquellas obras producidas después de 1960
var etapa1 = { $match: { year: { $gte: '1960' } } }
var etapa2 = { $addFields: { 'Estilo': "Arte Contemporáneo" } }
var proyeccion = {$project: {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0, 'Estilo':1}}
var etapas = [etapa1, etapa2, proyeccion]
db.tate.aggregate(etapas).limit(10)

//podemos hacer lo mismo con un artista en concreto, por ejemplo Paul Maitland.
var etapa1 = { $match: { artist: 'Maitland, Paul'}}
var etapa2 = { $addFields: { Estilo: 'Impresionismo' } }
var proyeccion = {$project: {'_id':0, 'id':0, 'accession_number':0, 'artistid':0, 'depth':0, 'thumbnailcopyright':0, 'thumbnailurl':0, 'url':0, 'dimensions':0, 'width':0, 'height':0, 'units':0, 'inscription':0}}
var etapas = [etapa1, etapa2, proyeccion]
db.tate.aggregate(etapas).limit(8)

// artista con mas obras
var etapa1 = { $group: { _id: "$artist", totalObras: { $sum: 1 } } }; // 
var etapa2 = { $sort: { totalObras: -1 } };
var etapa3 = { $limit: 1 };
var etapas = [etapa1, etapa2, etapa3];
db.tate.aggregate(etapas);

// artista con menos obras
var etapa1 = { $group: { _id: "$artist", totalObras: { $sum: 1 } } }; // 
var etapa2 = { $sort: { totalObras: 1 } };
var etapa3 = { $limit: 1 };
var etapas = [etapa1, etapa2, etapa3];
db.tate.aggregate(etapas);

var query = {'artist': 'Turner, Joseph Mallord William', 'medium': 'Graphite on paper'}
var proyeccion = {'medium': 'Graphite on paper'}
db.tate.find (query, proyeccion)

//Selectores
// Aquí le pido que me devuelva las obras adquiridas despues del 2000, que sn 6.393 obras.
var query = {'year': { $gt: '2000'} }
db.tate.find ( query )
// Aquí le hemos pedido que nos indique obras adquiridas antes de 1850.
var query = {'year': { $lt: '1850'} }
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0  }
db.tate.find (query, proyeccion)

var query1= { 'year': { $gte: '1850' } }
var query2= {'year':  { $lte: '1900' } }
var logic= { $and: [query1, query2] }
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, ‘_id’:0  }
db.tate.find ( logic, proyeccion )


// obras de las que no sabemos de qué año son --> INTERESANTE
var query = {'year':{$type:'null'}}
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1  }
db.tate.find ( query, proyeccion )

// obras de las que no sabemos de qué año son ni tampoco su título --> INTERESANTE
var query1 = {'year':{$type:'null'}}
var query2 = {'title':'[title not known]'}
var logic = {$and: [query1, query2]}
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0  }
db.tate.find ( logic,  proyeccion )

// obras de las que no sabemos de qué año son ni tampoco su título, adquiridas entre 1850 y 1900 --> INTERESANTE
var query1 = {'year':{$type:'null'}}
var query2 = {'title':'[title not known]'}
var query3 = {'acquisitionyear': {$gte: '1850', $lte: '1900'}}
var logic = {$and: [query1, query2, query3]}
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0  }
db.tate.find ( logic,  proyeccion )

// obras de las que no sabemos de qué año son ni tampoco su título, adquiridas entre 1850 y 1900,
// cuya técnica pictórica sea tinta sobre papel (ink on paper) --> INTERESANTE
var query1 = {'year':{$type:'null'}}
var query2 = {'title':'[title not known]'}
var query3 = {'acquisitionyear': {$gte: '1850', $lte: '1900'}}
var query4 = {'medium':'Ink on paper'}
var logic = {$and: [query1, query2, query3, query4]}
var proyeccion= {'artist': 1, 'title':1, 'year': 1, 'acquisitionyear': 1, 'medium':1, '_id':0  }
db.tate.find ( logic,  proyeccion )
// Esta query me ha devuelto obras de un artista en concreto, George Jones, cuyas obras fueron adquiridas por la Tate show collections
// el mismo año, 1888, del cual no se tiene ni obra de ejecución ni nombre. Es interesante para realizar una exposición
// sobre esta tecnica y sobre este artista. 


// técnica más repetida o representada en la colección Tate
db.tate.aggregate([
  { $group: { _id: "$medium", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
])

//cuantas obras de la tecnica más representada hay.
db.tate.aggregate([
  { $group: { _id: "$medium", count: { $sum: 1 }, works: { $push: "$title" } } },
  { $sort: { count: -1 } },
  { $limit: 1 },
  { $project: { _id: 0, medium: "$_id", count: 1, works: 1 } }
])
