class Marquee {
  constructor(el, url) {
    //this becomes marqueeElement
    this.el = el;
    //this is the url for first fetch
    this.url = url;
    this.getData();
  }

  async getData() {
    try {
      const response = await axios.get(this.url);
      let stocklist = response.data;
      this.appendData(stocklist);
    } catch (error) {
      console.log(error);
    }
  }

  appendData(stocklist) {
    let marqueeTest = document.createElement(`div`);
    marqueeTest.classList.add(`marqueeAnim`);
    marqueeTest.classList.add(`newTesting`);
    marqueeTest.setAttribute(`id`, `marqueeTest`);
    stocklist.splice(100);
    stocklist.forEach((company, index, stockElement) => {
      stockElement = document.createElement(`div`);
      stockElement.classList.add(`stockElement`);
      //add symbol with a price
      stockElement.innerHTML = `<span>${company.symbol}</span> <span class="positive"> ($${company.price})</span>`;
      marqueeTest.append(stockElement);
    });
    this.el.append(marqueeTest);
  }
}

const marqueeElement = document.getElementById(`outerMarquee`);
let url =
  "https://financialmodelingprep.com/api/v3/available-traded/list?apikey=7e60778244bbb11a3e59192e565ed625";
