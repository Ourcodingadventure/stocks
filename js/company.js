const params = new URLSearchParams(window.location.search);

let stockSymbol = params.get("symbol");
let companyData = "";

const companyNaame = document.getElementById("companyName");
const companyImage = document.getElementById("companyImage");
const companyDescription = document.getElementById("company-text");
const companyWebsite = document.getElementById("company-link");
const loadingSpinner = document.getElementById("loading-spinner");
const companyCard = document.getElementById("company-card");
const stockTicker = document.getElementById("stock-ticker");
const stockPrice = document.getElementById("stock-price");
const stockChangePercentage = document.getElementById(
  "stock-change-percentage"
);

// console.log(`here is stock symbol ${stockSymbol}`);

//chart script//

const createChart = async (dataArray) => {
  const canvas = document.getElementById("myChart").getContext("2d");
  const historicalDates = dataArray.map((el) => {
    return el.date;
  });
  const historicalPrices = dataArray.map((el) => {
    return el.close;
  });
  console.log(historicalDates);
  console.log(historicalPrices);
  let dataChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: historicalDates.reverse(),
      datasets: [
        {
          label: "Stock price over time",
          data: historicalPrices.reverse(),
          backgroundColor: "blue",
          borderColor: "black",
          hoverBorderWidth: 1,
          hoverBorderColor: "black",
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
    },
  });
};

//begin stock script //
const calcStockChange = (num) => {
  let newNum = parseFloat(num);
  //   console.log(newNum);
  //   console.log(typeof newNum);
  const roundedNum = Math.round(newNum * 10) / 10;
  if (isNaN(num)) {
    stockChangePercentage.classList.add("negative");
    return 0;
  }
  if (roundedNum > 0) {
    stockChangePercentage.classList.add("positive");
  } else {
    stockChangePercentage.classList.add("negative");
  }
  return roundedNum;
};

const stockHistory = async (stockTick) => {
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${stockTick}?serietype=line`
  );
  const data = await response.json();
  console.log(data.historical);
  return data.historical;
};
// calcStockChange(1.234);
const getStockHistory = async (stock) => {
  try {
    companyCard.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${stock}`
    );
    const data = await response.json();
    console.log(data.profile);

    companyData = data.profile;
    const {
      companyName,
      website,
      description,
      image,
      price,
      changesPercentage,
    } = companyData;
    companyNaame.textContent = companyName;
    companyDescription.textContent = description;
    companyWebsite.href = website;
    companyWebsite.textContent = `Visit ${companyName}'s website`;
    stockTicker.textContent = stockSymbol;
    stockPrice.textContent = price;
    companyImage.src = image;
    stockChangePercentage.textContent = `${calcStockChange(
      changesPercentage
    )}%`;
    try {
      createChart(await stockHistory(stockSymbol));
      loadingSpinner.classList.add("hidden");
      companyCard.classList.remove("hidden");
    } catch (error) {
      console.log(error);
    }
    return data.profile;
  } catch (error) {
    console.log(error);
  }
};
getStockHistory(stockSymbol);