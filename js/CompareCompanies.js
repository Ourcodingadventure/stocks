class CompareCompanies {
  constructor(companySymbols) {
    this.companyData = document.querySelector(`.companyData`);
    this.companySymbols = companySymbols;
    this.url =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";
    this.container = document.getElementById(`companyContainer`);
    this.divRow = document.createElement(`div`);
    this.divRow.classList.add(`row`);
    this.spinner = document.createElement(`div`);
    this.spinner.classList.add(`spinner-border`);
    this.spinner.classList.add(`d-none`);
    this.init();
  }

  init() {//make collumn for each symbol setting up html for comparing all three + styling
    this.companySymbols.forEach((i) => {
      let divColumn = document.createElement(`div`);
      divColumn.classList.add("col-md-4");
      divColumn.classList.add("col-sm-12");
      //fetch for company info
      this.getCompanyProfile(i).then((r) => {
        let html = this.getCompanyHtml(r.data.symbol, r.data.profile);
        divColumn.innerHTML = html;
        //append columns to row
        this.divRow.append(divColumn);
        this.setTitleIndustry(r.data.symbol, r.data.profile);
        this.imageFixing();
        this.getCompanyChartData(r.data.symbol).then((r) => {
          this.setChart(r.data, divColumn);
        });
      });
    });
    this.container.append(this.divRow);
  }

  setChart(history, divColumn) {
    const companyChart = divColumn.querySelector(`.chart`);
    const companyChartCanvas = divColumn.querySelector(`.lineChart`);
    // Getting History
    history.historical.splice(15);

    let datesArray = [];
    let pricesArray = [];
    //arrange data as we want
    history.historical.forEach((date) => {
      let month = date.date.split(`-`)[1];
      let day = date.date.split(`-`)[2];
      let monthDay = month + ` -` + day;
      datesArray.push(monthDay);
      //put in local storage for ease of access
      localStorage.setItem(`Dates`, JSON.stringify(datesArray));
      pricesArray.push(date.close);
      localStorage.setItem(`Prices`, JSON.stringify(pricesArray));
    });

    // companyChartCanvas
    const lineChart = new Chart(companyChartCanvas, {
      type: `line`,
      data: {
        labels: JSON.parse(localStorage.getItem(`Dates`)).reverse(),
        datasets: [
          {
            label: `Company Growth`,
            backgroundColor: `rgba(222, 28, 28, 50%)`,
            borderColor: `#de1c1c`,
            fill: true,
            pointRadius: 1,
            responsive: true,
            data: JSON.parse(localStorage.getItem(`Prices`)).reverse(),
          },
        ],
      },
    });
  }
  //set industry and website when you click my h1 ( nasdaq exchange)
  setTitleIndustry(symbol, profile) {
    if (profile.website === ``) {
      document.querySelector(`.companyTitleRow a`).setAttribute(`href`, `../`);
    }
    if (profile.industry === ``) {
      document.querySelector(`.industry`).innerHTML = `(${symbol})`;
    }
  }
//profile fetch
  getCompanyProfile(symbol) {
    try {
      let url = `${this.url}company/profile/${symbol}`;
      return axios.get(url);
    } catch (err) {
      console.error(err);
      return err;
    }
  }//history data fetch
  getCompanyChartData(symbol) {
    return axios.get(
      `${this.url}historical-price-full/${symbol}?serietype=line`
    );
  }

  getCompanyHtml(symbol, profile) {
    console.log(symbol, profile);

    let plus = ``;
    let condition = ``;

    // Filtering for Price Increase or Decrease
    if (profile.changes >= 0) {
      condition = `positive`;
      plus = `+`;
    } else {
      condition = `negative`;
    }

    let html = `
        <div class="alert alert-secondary m-0 p-1">
          <div class="text-center">
            <img src="${profile.image}" class="img-fluid img-thumbnail" style="max-height: 120px" alt="${symbol}">
            <div class="title">
            <h1 style="font-size: 18px">${profile.companyName}</h1>
            </div>
          <div>
            <small>
              Stock Price: $${profile.price}
            </small>
          </div>
          <small>
            <span class="companyChanges ${condition}">(${plus}${profile.changesPercentage}%)</span>
          </small>
          <hr>
          <div>
            <canvas class="lineChart"></canvas>
          </div>
          <hr>
            <p class="companyDescription" style="font-size: 12px">
              <small >${profile.description}</small>
            </p>
          </div>
        </div>`;
//callback
    return html;
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
