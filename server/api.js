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
	var page = request.query.page;
	var result = {};
	var searchProducts = [...marketplace];

	if (page == undefined) {page = 1;};
	if (price != undefined) {searchProducts = searchProducts.filter(product => product.price < price)};
	if (brand != undefined) {searchProducts = searchProducts.filter(product => product.brand == brand)};
	if (limit == undefined) {limit = 12};
	if (request.query.recent != undefined) {searchProducts = searchProducts.filter(product => {var now = Date.now(); var twoWeeksBefore = new Date(now - 12096e5); var dateA = new Date(product.released); return Math.ceil(Math.abs(dateA - twoWeeksBefore) / (1000* 60*60*24)) < 100;})}
	if (request.query.brandSort != undefined) {searchProducts = searchProducts.sort(function (a,b) {if (a.brand > b.brand) {return 1} else if (a.brand < b.brand) {return -1} else {return 0}})}
	if (request.query.dateSort != undefined) {searchProducts = searchProducts.sort(function (a,b) {var dateA = new Date(a.released); var dateB = new Date(b.released); return dateB - dateA;})}
	if (request.query.dateSortAncient != undefined) {searchProducts = searchProducts.sort(function (a,b) {var dateA = new Date(a.released); var dateB = new Date(b.released); return dateA - dateB;})}
	if (request.query.priceCheapSort != undefined) {searchProducts = searchProducts.sort(function (a,b) {return a.price - b.price})}
	if (request.query.priceExpensiveSort != undefined) {searchProducts = searchProducts.sort(function (a,b) {return b.price - a.price})}
	if (searchProducts.length != 0){
		var nbNew = searchProducts.filter(product => {var now = Date.now(); var twoWeeksBefore = new Date(now - 12096e5); var dateA = new Date(product.released); return Math.ceil(Math.abs(dateA - twoWeeksBefore) / (1000* 60*60*24)) < 100;}).length;
		var p50 = [...searchProducts].sort(function (a,b) {return a.price - b.price})[Math.floor(searchProducts.length*0.5)].price;
		var p90 = [...searchProducts].sort(function (a,b) {return a.price - b.price})[Math.floor(searchProducts.length*0.90)].price;
		var p95 = [...searchProducts].sort(function (a,b) {return a.price - b.price})[Math.floor(searchProducts.length*0.95)].price;
		result['most_recent'] = [...searchProducts].sort(function (a,b) {var dateA = new Date(a.released); var dateB = new Date(b.released); return dateB - dateA;})[0].released;

	}

	else {
		var nbNew = 0;
		var p50 = 0;
		var p90 = 0;
		var p95 = 0;
		result['most_recent'] = "No product."

	}
	result['nbNew'] = nbNew
	result['p50'] = p50;
	result['p90'] = p90;
	result['p95'] = p95;
	//result['most_recent'] = [...searchProducts].sort(function (a,b) {var dateA = new Date(a.released); var dateB = new Date(b.released); return dateB - dateA;})[0].released;
	result['limit'] = parseInt(limit);
	result['totalProducts'] = searchProducts.length;
	result['currentPage'] = parseInt(page);
	searchProducts = searchProducts.slice(limit * (page-1), limit * page);
	result['totalOnPage'] = searchProducts.length;
	result['results'] = searchProducts;
	result['success'] = true;
	response.status(200).json(result);

});

app.get('/products/:id', (request, response) => {
	const id = request.params.id;
	//console.log(id);
	const product = marketplace.find(product => product.uuid == id);
	response.status(200).json(product);
});

var i;
app.get('/brands', (request, response) => {
	brands = [];
	for (i = 0; i < marketplace.length; i++) {
		brands.push(marketplace[i].brand)
	}
	const brandsUnique = [...new Set(brands)];
	response.status(200).json({"success":true, "data": {"result" : brandsUnique}});
})



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
