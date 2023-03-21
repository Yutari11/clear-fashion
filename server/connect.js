const {MongoClient} = require('mongodb');

const MONGODB_URI = 'mongodb+srv://yutari:Password123@clearfashion.tpnzwgj.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

const {marketplace} = require('./data.js');
console.log(marketplace);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
    
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME)
	
	
	
    const products = marketplace;


	const collection = db.collection('products');
	const result = collection.insertMany(products, (err) => {
	if (err) {console.log("error!");console.log(err);} else {console.log("yo"); client.close();} });

	//console.log(result);
	//client.close();
}

main();
