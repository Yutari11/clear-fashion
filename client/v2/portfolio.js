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
let sortPriceBool = false;
let sortDateBool = false;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands');
const selectBrand = document.querySelector('#brand-select');
const sortPriceButton = document.querySelector('#sort-price');
const sortDateButton = document.querySelector('#sort-date');
const sortNoneButton = document.querySelector('#sort-none');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  allProducts = result;
  if (currentPagination == {}) {
	currentPagination = meta;
  }
};

/*
We sort all the products,
keeping only those of
a certain brand
*/

const sortByBrands = (allProducts, brand = "All brands") => {
	allProductsSorted = [];
	currentBrandIndex = brands.findIndex(x => (x == brand));
	if (brand != "All brands"){
		for (i = 0; i < allProducts.length; i++) {
			if (allProducts[i].brand == brand) {
				allProductsSorted.push(allProducts[i]);
				
			}
			
		}
		
	}
	else {
		allProductsSorted = [...allProducts];
	}
	
}



/*
We fetch the brands
*/ 

const fetchBrands = async () => {
  try {
    const response = await fetch(
      'https://clear-fashion-api.vercel.app/brands'
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
const fetchProducts = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?size=223`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/* Here we will create the currentProduct array where all Products to be displayed
will be added
*/

const spliceProducts = (page = 1, size = 12) => {
	const start = ((page-1) * size);
	currentProducts = allProductsSorted.filter((item, index)=>{
      return index >= start && index < size + start ;
    });
	currentPagination.pageSize = size;
	currentPagination.pageCount = Math.ceil(allProductsSorted.length/size);
	currentPagination.currentPage = page;
	//console.log(currentPagination);
	
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
  const count = allProductsSorted.length;

  spanNbProducts.innerHTML = count;
  spanNbBrands.innerHTML = brands.length - 1;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(brands);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  sortByBrands(allProducts, brands[currentBrandIndex]);
  if (sortPriceBool) {
	  allProductsSorted.sort((a,b) => a.price - b.price);
  }
  if (sortDateBool) {
	  allProductsSorted.sort((a,b) => {
			const da = new Date(a.released);
			const db = new Date(b.released);
			return da - db;
		  
	  });
  }
  spliceProducts(currentPagination.currentPage, parseInt(event.target.value));
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  sortByBrands(allProducts, brands[currentBrandIndex]);
  if (sortPriceBool) {
	  allProductsSorted.sort((a,b) => a.price - b.price);
  }
  if (sortDateBool) {
	  allProductsSorted.sort((a,b) => {
			const da = new Date(a.released);
			const db = new Date(b.released);
			return da - db;
		  
	  });
  }
  spliceProducts(parseInt(event.target.value), currentPagination.pageSize);
  render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  sortByBrands(allProducts, event.target.value);
  if (sortPriceBool) {
	  allProductsSorted.sort((a,b) => a.price - b.price);
  }
  if (sortDateBool) {
	  allProductsSorted.sort((a,b) => {
			const da = new Date(a.released);
			const db = new Date(b.released);
			return da - db;
		  
	  });
  }
  spliceProducts(1, currentPagination.pageSize);
  render(currentProducts, currentPagination);
});

sortPriceButton.addEventListener('click', async (event) => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  sortByBrands(allProducts, brands[currentBrandIndex]);
  if (!sortPriceBool) {
	allProductsSorted.sort((a,b) => a.price - b.price);
	sortPriceBool = true;
	sortPriceButton.style.backgroundColor = "#63E5FF";

  }
  else {
	sortPriceBool = false;
	sortPriceButton.style.backgroundColor = "white";
  }
  if (sortDateBool) {
	sortDateBool = false;
	sortDateButton.style.backgroundColor = "white";
  }
  
  spliceProducts(1, currentPagination.pageSize);
  render(currentProducts, currentPagination);
});

sortDateButton.addEventListener('click', async (event) => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  sortByBrands(allProducts, brands[currentBrandIndex]);
  if (sortPriceBool) {
	sortPriceBool = false;
	sortPriceButton.style.backgroundColor = "white";
  }
  if (!sortDateBool) {
	allProductsSorted.sort((a,b) => {
			const da = new Date(a.released);
			const db = new Date(b.released);
			return da - db;
		  
	  });
	sortDateBool = true;
	sortDateButton.style.backgroundColor = "#63E5FF";

  }
  else {
	sortDateBool = false;
	sortDateButton.style.backgroundColor = "white";
  }
  spliceProducts(1, currentPagination.pageSize);
  render(currentProducts, currentPagination);
  console.log(allProductsSorted);
});



document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  brands = await fetchBrands();
  setCurrentProducts(products);
  sortByBrands(allProducts);
  spliceProducts();
  render(currentProducts, currentPagination);
  console.log(allProductsSorted);
});
