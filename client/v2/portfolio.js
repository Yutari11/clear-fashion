// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let allProducts = [];
let allProductsSorted = [];
let currentProducts = [];
let currentPagination = {};
let currentBrandIndex = 0;
let brands = [];
let i;
let Reason_Price_Bool = false;
let recent_bool = false;
const search = "https://clear-fashion-seven-kappa.vercel.app/products/search";
var arg = "";
let currentBrand = "All brands";
let currentSort = "no-sort";
let currentSortIndex = 0;
let sorts = ["no-sort", "price-asc", "price-desc", "date-asc", "date-desc"]

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands');
const selectBrand = document.querySelector('#brand-select');
const Reason_Price = document.querySelector('#reason-price');
const recent = document.querySelector('#recent');
const sortNoneButton = document.querySelector('#sort-none');
const sortSelector = document.querySelector('#sort-select');
const spanNbNew = document.querySelector('#nbNew');
const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');
const spanMostRecent = document.querySelector('#most-recent')





/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = (results) => {
  allProducts = results.results;
  //console.log('All products');
  //console.log(allProducts);
  currentPagination = {'currentPage':results.currentPage, 'pageCount': Math.ceil(results.totalProducts /results.limit), 'limit' : results.limit, 'totalProducts': results.totalProducts, "nbNew" : results.nbNew, "p50":results.p50, "p90":results.p90,"p95":results.p95, "most_recent":results.most_recent};
  console.log(currentPagination);
};


/*
We fetch the brands
*/ 

const fetchBrands = async () => {
  try {
    const response = await fetch(
      'https://clear-fashion-seven-kappa.vercel.app/brands'
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return brands;
    }
	let temp = body.data.result;
	temp.unshift("All brands");
    return temp;
  } catch (error) {
    console.error(error);
    return brands;
  }
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (fetchLine = 'https://clear-fashion-seven-kappa.vercel.app/products/search' ) => {

    try {
    const response = await fetch(
      fetchLine
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};



/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}\t</span>
        <a href="${product.link}">${product.name}\t</a>
        <span>${product.price}\t</span>
		<span>${product.released}</span>
      </div>
	  <br>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrands = brands => {
  const options = Array.from(
    brands,
    x => `<option value="${x}">${x}</option>`
  ).join('');

  selectBrand.innerHTML = options;
  selectBrand.selectedIndex = currentBrandIndex;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const count = currentPagination.totalProducts;

  spanNbProducts.innerHTML = count;
  spanNbBrands.innerHTML = brands.length - 1;
  spanNbNew.innerHTML = currentPagination.nbNew;
  spanp50.innerHTML = currentPagination.p50;
  spanp90.innerHTML = currentPagination.p90;
  spanp95.innerHTML = currentPagination.p95;
  spanMostRecent.innerHTML = currentPagination.most_recent;

};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(brands);
};



const setArg = () => {
    arg = '?';
    arg = arg + 'limit=' + String(currentPagination.limit);
    arg = arg + '&page=' + String(currentPagination.currentPage);
    if (currentBrand != "All brands") {arg = arg + '&brand=' + currentBrand;}
    if (Reason_Price_Bool) {arg = arg + '&price=50';}
    if (recent_bool) {arg = arg + '&recent';}
    if (currentSort != "no-sort") {
        if (currentSort == "price-asc") { arg = arg + '&priceCheapSort'}
        if (currentSort == "price-desc") { arg = arg + '&priceExpensiveSort'}
        if (currentSort == "date-asc") { arg = arg + '&dateSort'}
        if (currentSort == "date-desc") { arg = arg + '&dateSortAncient'}
    }
    console.log(arg);
}



/**
 * Declaration of all Listeners
 */








/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
    currentPagination['limit'] = parseInt(event.target.value);
    setArg();
    const products = await fetchProducts(search + arg);
    brands = await fetchBrands();
    setCurrentProducts(products);
    render(allProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
    currentPagination['currentPage'] = parseInt(event.target.value);
    setArg();
    const products = await fetchProducts(search + arg);
    brands = await fetchBrands();
    setCurrentProducts(products);
    render(allProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
    currentBrand = event.target.value;
    currentBrandIndex = brands.findIndex(x => (x == currentBrand));
    setArg();
    const products = await fetchProducts(search + arg);
    brands = await fetchBrands();
    setCurrentProducts(products);
    render(allProducts, currentPagination);
  
});

Reason_Price.addEventListener('click', async (event) => {
  if (!Reason_Price_Bool) {
	Reason_Price_Bool = true;
	Reason_Price.style.backgroundColor = "#63E5FF";
  }
  else {
	Reason_Price_Bool = false;
	Reason_Price.style.backgroundColor = "white";
  }
    setArg();
    const products = await fetchProducts(search + arg);
    brands = await fetchBrands();
    setCurrentProducts(products);
    render(allProducts, currentPagination);
});

recent.addEventListener('click', async (event) => {
    if (!recent_bool) {
        recent_bool = true;
        recent.style.backgroundColor = "#63E5FF";
      }
      else {
        recent_bool = false;
        recent.style.backgroundColor = "white";
      }
        setArg();
        const products = await fetchProducts(search + arg);
        brands = await fetchBrands();
        setCurrentProducts(products);
        render(allProducts, currentPagination);
});

sortSelector.addEventListener('change', async (event) => {
    currentSort = event.target.value;
    currentSortIndex = sorts.findIndex(x => (x == currentSort));
    setArg();
    const products = await fetchProducts(search + arg);
    brands = await fetchBrands();
    setCurrentProducts(products);
    render(allProducts, currentPagination);
});




document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts(search);
    brands = await fetchBrands();
    setCurrentProducts(products);
    render(allProducts, currentPagination);
});
