const marqueeElement = document.getElementById(`marqueeTest`);
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
    stocklist.splice(100);
    stocklist.forEach((company, index, stockElement) => {
      stockElement = document.createElement(`div`);
      stockElement.classList.add(`stockElement`);
      //add symbol with a price
      stockElement.innerHTML = `${company.symbol} <span class="positive"> ($${company.price})</span>`;
      this.el.classList.add(`marqueeAnim`);
      this.el.append(stockElement);
    });
  }
}

let url =
  "https://financialmodelingprep.com/api/v3/available-traded/list?apikey=7e60778244bbb11a3e59192e565ed625";
let marquee1 = new Marquee(marqueeElement, url);

