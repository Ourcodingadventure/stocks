const marqueeElement = document.getElementById(`marqueeTest`);

// Fetch
async function stockListFetch() {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/available-traded/list?apikey=7e60778244bbb11a3e59192e565ed625`
  );
  let stocklist = await response.json();
  stocklist.splice(100);
  console.log(stocklist);

  stocklist.forEach((company, index, stockElement) => {
    stockElement = document.createElement(`div`);
    stockElement.classList.add(`stockElement`);

    stockElement.innerHTML = `${company.symbol} | ${company.price}`;
    marqueeElement.classList.add(`marqueeAnim`);
    marqueeElement.append(stockElement);
  });
}

stockListFetch();
