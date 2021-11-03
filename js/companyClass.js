class Company {
  constructor(url, companySymbol) {
    this.companyData = document.querySelector(`.companyData`);
    this.spinner = document.getElementById(`spinnerSVG`);
    this.companySymbol = companySymbol;
    this.url = url;

    this.init();
  }
  init() {
    this.getData();
  }
  async getData() {
    try {
      const profileResponse = await axios.get(
        `${this.url}company/profile/${this.companySymbol}`
      );
      let profile = profileResponse.data;
      this.htmlBuilder(profile);
      const chartData = await axios.get(
        `${this.url}historical-price-full/${this.companySymbol}?serietype=line`
      );
      const history = chartData.data;
      this.chartInfo(history);
    } catch (err) {
      console.error(err);
    }
  }

  htmlBuilder(profile) {
    let {
      profile: {
        price,
        image,
        industry,
        companyName: name,
        changes,
        description,
        website,
        changesPercentage: percent,
      },
      symbol,
    } = profile;
    let plus = ``;
    let condition = ``;

    // Filtering for Price Increase or Decrease
    if (changes >= 0) {
      condition = `positive`;
      plus = `+`;
    } else {
      condition = `negative`;
    }

    // Taking Destructured Objects and injecting them into the markdown
    this.companyData.innerHTML = `
  <div class="companyTitleRow">
    <img src="${image}" class="companyImage" alt="${companySymbol}">
    <a href="${website}" target="_blank" title="${companySymbol}">
      <span class="companyName">${name}</span>
      <span class="industry">(${industry})</span>
    </a>
  </div>
  <div class="stockPrice">Stock Price: $${price} 
    <span class="companyChanges ${condition}">(${plus}${changes}%)</span>
  </div>
  <p class="companyDescription">
    <span>Description:</span>
    ${description}
  </p>
  `;
    if (industry === ``) {
      document.querySelector(`.industry`).innerHTML = `(${companySymbol})`;
    }
    if (website === ``) {
      document.querySelector(`.companyTitleRow a`).setAttribute(`href`, `../`);
    }
    this.imageFixing();
  }
  imageFixing() {
    const images = document.querySelectorAll(`img`);
    images.forEach((image) => {
      image.addEventListener(`error`, (event) => {
        event.target.src = `../img/Stock-Icon-Circle-Icon.svg`;
      });
    });
  }
  chartInfo(history) {
    const companyChart = document.querySelector(`.companyChart`);
    const companyChartCanvas = document.getElementById(`lineChart`);
    console.log(history);
    // Getting History

    history.historical.splice(15);

    let datesArray = [];
    let pricesArray = [];

    history.historical.forEach((date) => {
      let month = date.date.split(`-`)[1];
      let day = date.date.split(`-`)[2];
      let monthDay = month + ` -` + day;
      datesArray.push(monthDay);
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

    setTimeout(() => {
      spinner.remove();
    }, 1000);
  }
}

const URL =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";

const companySymbol = window.location.search.replace("?symbol=", "");
const comanyPage = new Company(URL, companySymbol);
