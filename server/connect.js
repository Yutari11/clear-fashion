//!!! Make sure the IP adress of the MongoDB Cluster in Network Access is configured!!!

const {MongoClient} = require('mongodb');

const MONGODB_URI = 'mongodb+srv://yutari:Password123@clearfashion.tpnzwgj.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

const {marketplace} = require('./data.js');
//console.log(marketplace);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
    
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME)
	
	async function dropAll() {
		await db.collection("products").drop();
		await client.close();
	}
	async function insert_marketplace() {
		const products = marketplace;
		const collection = db.collection('products');
		const result = await collection.insertMany(products);
		await client.close();
	}
	async function searchfor(brand) {
		const collection = db.collection('products');
		const products = await collection.find({brand}).toArray();
		console.log(products);
		console.log(products.length);
		await client.close();
	}
	async function pricelessthan(p) {
		const collection = db.collection('products');
		const products = await collection.find({"price" : {$lte : parseInt(p)}}).toArray();
		console.log(products);
		console.log(products.length);
		await client.close();
	}
	async function sortedByPrice() {
		const collection = db.collection('products');
		var collection_products = await collection.find().toArray();
		var sorted_products = collection_products.sort(function(a,b) {return a.price - b.price});
		console.log(sorted_products);
		console.log(sorted_products.length);
		await client.close();
	}
	async function sortedByDate() {
		const collection = db.collection('products');
		var collection_products = await collection.find().toArray();
		var sorted_products = collection_products.sort(function(a,b) {var dateA = new Date(a.released);  var dateB = new Date(b.released); return dateA - dateB;});
		console.log(sorted_products);
		console.log(sorted_products.length);
		await client.close();
	}
	//Gives all the products released after a given date.
	async function dateLessThan(p) {
		const collection = db.collection('products');
		var products = await collection.find({"released" : {$gte : p}}).toArray();
		var sorted_products = products.sort(function(a,b) {var dateA = new Date(a.released);  var dateB = new Date(b.released); return dateA - dateB;});
		console.log(sorted_products);
		console.log(sorted_products.length);
		await client.close();
	}
	
	
	const [,, param] = process.argv;
	
	//insert_marketplace();
	//searchfor(brand);
	//pricelessthan(param);
	//sortedByPrice();
	//sortedByDate();
	dateLessThan(param);
	//console.log(result);
}


main();
