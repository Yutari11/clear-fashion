const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {marketplace} = require('./data.js');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products', (request, response) => {
  response.status(200).json(marketplace);
});

app.get('/products/search', (request, response) => {
	var limit = request.query.limit;
	const brand = request.query.brand;
	const price = request.query.price;
	var result = {};
	var searchProducts = [...marketplace];
	if (price != undefined) {searchProducts = searchProducts.filter(product => product.price < price)};
	if (brand != undefined) {searchProducts = searchProducts.filter(product => product.brand == brand)};
	if (limit == undefined) {limit = 12};
	result['limit'] = parseInt(limit);
	searchProducts = searchProducts.slice(0,limit);
	result['total'] = searchProducts.length;
	result['results'] = searchProducts;
	response.status(200).json(result);
});

app.get('/products/:id', (request, response) => {
	const id = request.params.id;
	//console.log(id);
	const product = marketplace.find(product => product.uuid == id);
	response.status(200).json(product);
});



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
