// Declaring Constants

const myUrl = new URL(window.location.href);
const mySymbol = myUrl.searchParams.get(`query`);
const spinner = document.getElementById(`spinnerSVG`);
// Div where we inject search results
const results = document.getElementById(`results`);
// Search Input
const searchInput = document.querySelector(`.input-field`);
// Click to make list pop up
const searchButton = document.getElementById(`clickMe`);
// For forcing whole object into array
let profilesArray = [];
let imagesArray = [];


// When the Search Input is empty, empty results
searchInput.addEventListener(`input`, (event) => {
  searchInput.value === `` ? (results.innerHTML = ``) : true;
});

// Main Search Function

const search = async (searchTerm) => {
  // Emptying the Results Div on search
  results.innerHTML = ``;
  // Instatiating search term
  searchTerm = searchInput.value;
  // setting url params after search term initialization
  myUrl.searchParams.set(`query`, searchTerm);
  window.history.pushState({}, "", myUrl);
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchTerm}&limit=10&exchange=NASDAQ`;
  // Fetch
  const response = await axios.get(url);
  const data = response.data;
  //splitting the symbols to groups of three for optimizing the fetch
  const companySymbols = [];
  data.forEach((company) => {
    companySymbols.push(company.symbol);
  });
  var arrays = [],
    size = 3;
  while (companySymbols.length > 0) arrays.push(companySymbols.splice(0, size));
  //second fetch optimized
  arrays.forEach(async (array) => {
    const profileURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${array}`;
    const newResponse = await axios.get(profileURL);
    const profileData = newResponse.data;
    // making the data iterable if its 1 or more than 1
    const idk = [];
    if (Object.keys(profileData).length === 2) {
      idk.companyProfiles = [profileData];
      const company = Object.keys(idk.companyProfiles);
      displayData(idk.companyProfiles, searchTerm);
    } else {
      const companies = profileData.companyProfiles;
      displayData(companies, searchTerm);
    }
  });
};

const displayData = (data, searchTerm) => {
  console.log(data);
  // Remove Spinner
  setTimeout(() => {
    spinner.classList.remove(`show`);
  }, 1000); // Opening For Each Loop
  data.forEach((profileData, index, companyRow) => {
    // Reinitializing Profile Array
    profilesArray.push(profileData);
    console.log(profilesArray);
    creatingCompanyRow(profilesArray);
    // Image Fixing
    imageFixing();
    // Highlighting Searched Text on Company Names
    const companyNames = document.querySelectorAll(`.companyName`);
    companyNames.forEach((name) => {
      let filteredCharacters = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      let filter = new RegExp(`${filteredCharacters}`, `gi`);
      name.innerHTML = name.textContent.replace(
        filter,
        (match) => `<mark>${match}</mark>`
      );
    });

    // Highlighting Searched Text on Company Symbols
    const companySymbols = document.querySelectorAll(`.companySymbol`);
    companySymbols.forEach((symbol) => {
      let filteredCharacters = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      let filter = new RegExp(`${filteredCharacters}`, `gi`);
      symbol.innerHTML = symbol.textContent.replace(
        filter,
        (match) => `<mark>${match}</mark>`
      );
    });
  });
};
function creatingCompanyRow(profilesArray) {
  console.log(profilesArray);
  profilesArray.forEach((company, index) => {
    // Begin Profiles Array // Search Results Function
    let plus = ``;
    let condition = ``;
    let symbol = company.symbol;
    let image = company.profile.image;
    let changes = company.profile.changes.toFixed(2);
    let name = company.profile.companyName;

    // Filtering for Price Increase or Decrease
    if (changes >= 0) {
      condition = `positive`;
      plus = `+`;
    } else {
      condition = `negative`;
    }

    // Creating Rows for Each Company
    companyRow = document.createElement(`div`);
    let companyImage = document.createElement(`img`); // Creating Image for Each Company

    // Setting the Attributes of the Company Image
    companyImage.setAttribute(`src`, image);
    companyImage.setAttribute(`class`, `companyIcon`);
    companyImage.setAttribute(`height`, `100px`);
    companyImage.setAttribute(`width`, `100px`);

    // Setting the Attributes of the Company Rows
    companyRow.classList.add(`companyRow`);

    // Creating a New Element to Contain Company Data
    let companyElement = document.createElement(`a`);
    companyElement.setAttribute(`href`, `./html/company.html?symbol=${symbol}`);
    companyElement.classList.add(`çompanyElement`);
    companyElement.setAttribute(`ìd`, index + 1);
    companyElement.innerHTML = `
        <span class="companyName">${name}</span>
        <span class="companySymbol">(${symbol})</span>
        <span class="companyChanges ${condition}">(${plus}${changes})</span>
        `; // Injecting the Elements we Created into the Rows
    companyRow.prepend(companyImage);
    companyRow.append(companyElement);

    // Returning the Company Row
    return companyRow;
    // End Search Results Function
  });

  // Abstracted this code so it only appends rows on full word input
  results.append(companyRow);
}
function imageFixing() {
  const images = document.querySelectorAll(`img`);
  images.forEach((image) => {
    image.addEventListener(`error`, (event) => {
      event.target.src = `../img/Stock-Icon-Circle-Icon.svg`;
    });
  });
}
function debounce(func, timeout = 750) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
const debouncer = debounce(() => search());

searchInput.addEventListener(`input`, debouncer);
