class Search {
  constructor(el) {
    this.el = el;
    this.data = null;
    this.companySymbols = [];
    this.arrays = [];
    this.searchInput = document.createElement(`input`);
    this.results = document.getElementById(`results`);
    this.spinner = document.createElement(`div`);
    this.spinner.classList.add(`spinner-border`);
    this.spinner.classList.add(`d-none`);
    this.companies = [];
    this.init(this.searchInput);
  }
  init() {
    this.searchInput.setAttribute(`class`, `input-field`);
    this.searchInput.setAttribute(`type`, `text`);
    this.searchInput.setAttribute(`placeholder`, `search`);
    this.el.append(this.searchInput);
    //initialization method
    this.searchInput.value;
  }
  //search method

  async onSearch(callback) {
    this.el.append(this.spinner);

    const debouncer = debounce(() => this.search(callback));
    this.searchInput.addEventListener(`input`, (event) => {
      this.searchInput.value === `` ? (this.results.innerHTML = ``) : true;
    });
    this.searchInput.addEventListener(`input`, debouncer);
    function debounce(func, timeout = 750) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    }
  }
  async search(callback) {
    this.spinner.classList.remove(`d-none`);
    // Emptying the Results Div on search
    this.results.innerHTML = ``;
    // Instatiating search term
    this.searchTerm = this.searchInput.value;
    // Set browser history/state
    this.urlParams();
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${this.searchTerm}&limit=10&exchange=NASDAQ`;
    // Fetch
    const response = await axios.get(url);
    let companySymbols = this.splitSymbols(response.data);
    //second fetch optimized
    let promises = [];
    companySymbols.forEach((i) => {
      promises.push(this.getProfiles(i));
    });
    Promise.all(promises).then((r) => {
      let companies = [];
      r.forEach((i) => {
        if (i.data.companyProfiles) {
          i.data.companyProfiles.forEach((k) => {
            k.profile.symbol = k.symbol;
            companies.push(k.profile);
          });
        } else {
          i.data.profile.symbol = i.data.symbol;
          companies.push(i.data.profile);
        }
      });
      //feed companies to append class
      callback(companies);
      this.spinner.classList.add(`d-none`);
    });
  }

  getProfiles(symbols) {
    const profileURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbols}`;
    return axios.get(profileURL);
  }
  urlParams() {
    const myUrl = new URL(window.location.href);
    const mySymbol = myUrl.searchParams.get(`query`);
    myUrl.searchParams.set(`query`, this.searchTerm);
    window.history.pushState({}, "", myUrl);
  }

  //splitting the symbols to groups of three for optimizing the fetch
  splitSymbols(data) {
    var arrays = [],
      size = 3;
    const companySymbols = [];
    data.forEach((company) => {
      companySymbols.push(company.symbol);
    });
    while (companySymbols.length > 0)
      arrays.push(companySymbols.splice(0, size));
    return arrays;
  }
}
