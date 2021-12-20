const myUrl = new URL(window.location.href);
let symbols = myUrl.searchParams.get(`symbols`);
symbols = symbols.split(",");
// const companySymbol = window.location.search.replace("?symbol=", "");
const compareCompanies = new CompareCompanies(symbols);
