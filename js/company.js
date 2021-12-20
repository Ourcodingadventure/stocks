const url =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";

const companySymbol = window.location.search.replace("?symbol=", "");
const companyPage = new Company(url, companySymbol);
console.log(companySymbol, url, companyPage);
