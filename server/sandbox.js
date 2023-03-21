/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
<<<<<<< HEAD
const circlebrand = require('./eshops/circlebrand');



=======


>>>>>>> 9547e1b (feat(shop) scrape new products)
async function sandbox (shopname = "Dedicated", eshop = '') {
  try {
    if (eshop == "" && shopname == "Dedicated") {eshop = "https://www.dedicatedbrand.com/en/men/news";}
    if (eshop == "" && shopname == "Montlimart") {eshop = "https://www.montlimart.com/72-nouveautes";}
<<<<<<< HEAD
	if (eshop == "" && shopname == "Circle") {eshop = "https://shop.circlesportswear.com/collections/t-shirts-homme";}

=======
>>>>>>> 9547e1b (feat(shop) scrape new products)

	
	console.log(`🕵️‍♀️  browsing ${eshop} eshop ------ ${shopname} shopname`);
	let products;
<<<<<<< HEAD
    if (shopname == "Dedicated") {products = await dedicatedbrand.scrape(eshop);}
    if (shopname == "Montlimart") {products = await montlimartbrand.scrape(eshop);}
	if (shopname == "Circle") {products = await circlebrand.scrape(eshop);}

=======
    if (shopname == "Dedicated") {products = await dedicatedbrand.scrape(eshop); console.log("papapa");}
    if (shopname == "Montlimart") {products = await montlimartbrand.scrape(eshop); console.log("yoyoyo");}
>>>>>>> 9547e1b (feat(shop) scrape new products)
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
