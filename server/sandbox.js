/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');


async function sandbox (shopname = "Dedicated", eshop = '') {
  try {
    if (eshop == "" && shopname == "Dedicated") {eshop = "https://www.dedicatedbrand.com/en/men/news";}
    if (eshop == "" && shopname == "Montlimart") {eshop = "https://www.montlimart.com/72-nouveautes";}

	
	console.log(`🕵️‍♀️  browsing ${eshop} eshop ------ ${shopname} shopname`);
	let products;
    if (shopname == "Dedicated") {products = await dedicatedbrand.scrape(eshop); console.log("papapa");}
    if (shopname == "Montlimart") {products = await montlimartbrand.scrape(eshop); console.log("yoyoyo");}
    //if (shopname == "") {const products = await dedicatedbrand.scrape(eshop);}


    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, shopname, eshop] = process.argv;

sandbox(shopname, eshop);
