// Declaring Constants
const body = document.body;
const spinner = document.getElementById(`spinnerSVG`);

// Div where we inject search results
const results = document.getElementById(`results`);

// Search Input
const searchInput = document.querySelector(`.input-field`);

// Click to make list pop up
const searchButton = document.getElementById(`clickMe`);

// for forcing whole object into array
let newDataArray = [];
let imagesArray = [];

searchButton.addEventListener(`click`, (search = (searchTerm) => {
    results.innerHTML = ``;

      searchTerm = searchInput.value;
    // Fetching Data URL
    const url = `https:stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchTerm}&limit=10&exchange=NASDAQ`;
    
    // Fetch

      fetch(url)
      .then((response) => {
        // console.log(response);
        if (response.status != 200) {
          alert(`Fetch not successful`);
          return;
        }
        // Show Spinner
        spinner.classList.add(`show`);
        return response.json();
      })
      
      //sidefetch
      .then((data) => {
        console.log(`Side Fetch Data is: `);
        console.log(data);
        // Remove Spinner
        setTimeout(() => {
          spinner.classList.remove(`show`);
        }, 1000);
        data.forEach((company, index, companyRow) => {
          const profileURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${company.symbol}`;
          fetch(profileURL)
            .then((newResponse) => newResponse.json())
            .then((newData) => {
            newDataArray.push(newData);
            
             newDataArray.forEach((company, index) => {
 
                console.log(company);
                let name = company.profile.companyName;
                // let image = (imgsrc) => {
                //   company.profile.image.onerror = () => {
                //     return imgsrc = `../img/Stock-Icon.svg`;
                //   }
                //   return imgsrc;
                // }
                let image = company.profile.image;
                // imagesArray.push(image);
                // imagesArray = [...new Set(imagesArray)];
                // localStorage.setItem(`Images`, JSON.stringify(imagesArray));
                // if (image) {

                // } else if (image.on-error) {
                //   image = ``;
                // }
                let changes = company.profile.changes;
                let symbol = company.symbol;
                let condition = ``;
                let plus = ``;

                if (changes >= 0) {
                  condition = `positive`;
                  plus = `+`;
                 }  else {
                  condition = `negative`;
                }
               
                companyRow = document.createElement(`div`);
                let companyImage = document.createElement(`img`);
        
                companyImage.setAttribute(`src`, image);
                companyImage.setAttribute(`class`, `companyIcon`);
                companyImage.setAttribute(`height`, `100px`);
                companyImage.setAttribute(`width`, `100px`);
                companyRow.classList.add(`companyRow`);
                let companyElement = document.createElement(`a`);
                companyElement.setAttribute(
                  `href`,
                  `./html/company.html?symbol=${symbol}`
                );
                // add name of company to element add symbol after add image before
                // still need to add stock change red if down green otherwise
                companyElement.classList.add(`çompanyElement`);
                companyElement.setAttribute(`ìd`, index + 1);
                companyElement.innerHTML = `
                <span class="companyName">${name}</span> 
                <span class="companySymbol">(${symbol})</span>
                <span class="companyChanges ${condition}">(${plus}${changes})</span>
                `;
                companyRow.prepend(companyImage);
                companyRow.append(companyElement);
                return companyRow;
              });
              results.append(companyRow);
            });
        });
      });
  })
);

searchInput.addEventListener(`keydown`, (event) => {
  if (event.keyCode === 13) {
    search();
  }
});