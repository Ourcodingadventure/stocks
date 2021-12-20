class DisplayData {
  constructor(el, searchClass) {
    this.el = el;
    this.searchClass = searchClass;
    this.compareCompaniesArray = [];
  }

  init(companies) {
    this.companies = companies;
    //for spinner && order of operations
    // Remove Spinner
    this.creatingCompanyRows(this.companies);
    this.imageFixing();
    this.highlight();
    //set event for compare companies button
    document
      .getElementById("compareCompaniesBtn")
      //   .addEventListener(`click`, this.compareCompaniesHandler.bind(this));
      .addEventListener(`click`, () => {
        if (this.compareCompaniesArray.length < 2) {
          console.log(`please add another company`);
          return false;
        }
        this.compareCompaniesHandler();
      });
  }

  compareButtonClick(btn, profile) {
    let compareCompanyList = document.getElementById(`companyCompareList`);
    btn.addEventListener(`click`, (event) => {
      if (this.compareCompaniesArray.length === 3) {
        console.log(`youve reached max limit`);
        return false;
      }

      //compare array
      this.compareCompaniesArray.push(profile.symbol);
      event.target.remove();
      let button = document.createElement(`button`);
      button.setAttribute(
        `class`,
        `btn btn-sm btn-secondary float-end compare-btn`
      );
      button.innerText = profile.symbol;

      compareCompanyList.append(button);
      //remove onclick
      button.addEventListener("click", (event) => {
        event.target.remove();
        this.compareCompaniesArray.splice(
          this.compareCompaniesArray.indexOf(event.target.text),
          1
        );
      });
    });
  }

  compareCompaniesHandler() {
    console.log(this.compareCompaniesArray);
    let url = `compare.html?symbols=${this.compareCompaniesArray.join()}`;
    console.log(url);
    window.location.href = url;
  }

  creatingCompanyRows(profilesArray) {
    console.log(profilesArray);
    let allCompanies = document.createElement(`div`);
    profilesArray.forEach((i, index, companyRow) => {
      // Begin Profiles Array // Search Results Function
      let plus = ``;
      let condition = ``;
      let symbol = i.symbol;
      let image = i.image;
      let changes = i.changes.toFixed(2);
      let name = i.companyName;

      // Filtering for Price Increase or Decrease
      if (changes >= 0) {
        condition = `positive`;
        plus = `+`;
      } else {
        condition = `negative`;
      }

      // Creating Rows for Each Company
      let div = document.createElement(`div`);
      let companyImage = document.createElement(`img`); // Creating Image for Each Company

      // Setting the Attributes of the Company Image
      companyImage.setAttribute(`src`, image);
      companyImage.setAttribute(`class`, `companyIcon`);
      companyImage.setAttribute(`height`, `100px`);
      companyImage.setAttribute(`width`, `100px`);

      //create a compare button

      // Setting the Attributes of the Company Rows
      div.classList.add(`companyRow`);
      let compareButton = this.createButton();
      // Creating a New Element to Contain Company Data
      let companyElement = document.createElement(`a`);
      companyElement.setAttribute(
        `href`,
        `./html/company.html?symbol=${symbol}`
      );
      companyElement.classList.add(`çompanyElement`);
      companyElement.setAttribute(`ìd`, index + 1);
      companyElement.innerHTML = `
                <span class="companyName">${name}</span>
                <span class="companySymbol">(${symbol})</span>
                <span class="companyChanges ${condition}">(${plus}${changes})</span>
                `; // Injecting the Elements we Created into the Rows
      div.append(companyImage);
      div.append(companyElement);
      div.append(compareButton);
      //to call even listener here
      this.compareButtonClick(compareButton, i);

      allCompanies.append(div);
    });
    this.el.append(allCompanies);
  }

  createButton() {
    const compareButton = document.createElement(`button`);
    // compareButton.setAttribute(`id`, `clickMe`);
    compareButton.setAttribute(`class`, `btn btn-sm btn-secondary compare-btn`);
    compareButton.innerHTML = `Compare`;
    return compareButton;
  }

  imageFixing() {
    const images = document.querySelectorAll(`img`);
    images.forEach((image) => {
      image.addEventListener(`error`, (event) => {
        event.target.src = `../img/Stock-Icon-Circle-Icon.svg`;
      });
    });
  }

  highlight() {
    this.searchTerm = this.searchClass.searchTerm;
    //extracted to function for readability
    // Highlighting Searched Text on Company Names
    //get element with company name
    const companyNames = document.querySelectorAll(`.companyName`);
    //foreach company name
    companyNames.forEach((name) => {
      //target
      let filteredCharacters = this.searchTerm.replace(
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
      let filteredCharacters = this.searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      let filter = new RegExp(`${filteredCharacters}`, `gi`);
      symbol.innerHTML = symbol.textContent.replace(
        filter,
        (match) => `<mark>${match}</mark>`
      );
    });
  }
}
