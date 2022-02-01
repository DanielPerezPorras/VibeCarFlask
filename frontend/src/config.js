let API = process.env.REACT_APP_API;
if (API === undefined) {
  API = 'http://localhost:8080'
}

let GoogleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

console.log("BACKEND DESPLEGADO EN: " + API);

export { API, GoogleClientId };