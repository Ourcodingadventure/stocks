
class DisplayData {
    constructor(companies, searchTerm) {
      this.searchTerm = searchTerm;
      this.companies = companies;
      this.spinner = document.getElementById(`spinnerSVG`);
      this.init();
    }
    init() {//for spinner && order of operations
      // Remove Spinner
      setTimeout(() => {
        this.spinner.classList.remove(`show`);
      }, 1000); // Opening For Each Loop
  
      this.creatingCompanyRows(this.companies);
      this.imageFixing();
      this.highlight();
    }
    highlight() {//extracted to function for readability
      // Highlighting Searched Text on Company Names
      const companyNames = document.querySelectorAll(`.companyName`);
      companyNames.forEach((name) => {
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
  
        // Setting the Attributes of the Company Rows
        div.classList.add(`companyRow`);
  
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
        allCompanies.append(div);
      });
      document.getElementById(`results`).append(allCompanies);
    }
    imageFixing() {
      const images = document.querySelectorAll(`img`);
      images.forEach((image) => {
        image.addEventListener(`error`, (event) => {
          event.target.src = `../img/Stock-Icon-Circle-Icon.svg`;
        });
      });
    }
  }
  