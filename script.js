const apiURL = "https://fakestoreapi.com/products";
const spinner = document.getElementById("spinner");
const categoryList = document.getElementById("category-list");

function loadCategoriesList(data) {
  const imageList = document.getElementById("image-list");
  imageList.innerHTML = "";
  const listimage = data.map((img) => {
    return `<li class="item" data-name=${img.title}>
        <figure>
            <img src=${img.image} alt=${img.title}/>
            <figcaption>
                <h5 class="title">${img.title}</h5>
                <p class="price">$  ${img.price}</p>
                <p><i class="fa-regular fa-heart"></i></p>
            </figcaption>
        </figure>
    </li>`;
  });
  imageList.innerHTML = listimage.join("");
}
async function getData() {
  // api request through fetch
  const spinnerElem = document.getElementById("spinner");
  spinnerElem.classList.add("active");
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    spinnerElem.classList.remove("active");
    return data;
  } catch (error) {
    alert("server error");
    spinnerElem.classList.remove("active");
    return;
  }
}

function getCategories(data) {
  const result = [];
  for (const key in data) {
    const item = data[key];
    if (!JSON.stringify(result).includes(item.category)) {
      result.push(item);
    }
  }
  return result;
}

function loadCategories(data) {
  categoryList.innerHTML = data
    .map((item) => {
      const param = item.category.toString();
      return `<li>
        <label class="form-control">
            <input type="checkbox" name="checkbox" onclick="selecteCategory(event)" value="${param}"/>
            <span>${item.category}</span>
        </label>
        </li>`;
    })
    .join("");
}

const selectedCat = [];
async function selecteCategory(event) {
  // event.preventDefault()
  const data = await getData();
  // console.log(event.target.value)
  const targetValue = event.target.value;
  const index = selectedCat.indexOf(targetValue);
  if (event.target.checked && index === -1) {
    selectedCat.push(targetValue);
  } else {
    selectedCat.splice(index, 1);
  }

  const result = filteredByCategory(data, selectedCat);
  loadCategoriesList(result);
}
function filteredByCategory(data, selectedCat) {
  return data.filter((item) => selectedCat.includes(item.category));
}

async function sortBy(event, defaultVal = "") {
  const data = await getData();
  const val = (event && event.target.value) || defaultVal;
  data.sort((a, b) => {
    if (val === "price-asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
  loadCategoriesList(data);
}

async function searchList(event) {
  const val = event.target.value.toLowerCase();
  const data = await getData();
  const searchedData = data.filter((item) =>
    item.title.toLowerCase().includes(val)
  );
  val ? loadCategoriesList(searchedData) : loadCategoriesList(data);
}
function toggleLazyBtn(data, limit) {
  const btn = document.getElementById("load-more");
  btn.style.display = limit < data.length ? "inline-block" : "none";
}
function sliceData(data, limit) {
  const slicedData = data.length > limit ? data.slice(0, limit) : data;
  return slicedData;
}

let count = 1;
async function loadMoreData() {
  const data = await getData();
  const limit = 10 * ++count;
  const slicedData = sliceData(data, limit);
  loadCategoriesList(slicedData);
  toggleLazyBtn(data, limit);
}


async function mainController() {
  const data = await getData();
  const limit = 10;
  const slicedData = sliceData(data, limit);
  loadCategoriesList(slicedData);
  toggleLazyBtn(data, limit);

  const categories = getCategories(data);
  loadCategories(categories);
}

mainController();
