import { GoogleClientId as SecretGoogleClientId } from "./secrets";

let API = process.env.REACT_APP_API;
if (API === undefined) {
  API = 'http://localhost:8080'
}

let GoogleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (GoogleClientId === undefined) {
  GoogleClientId = SecretGoogleClientId
}

console.log("BACKEND DESPLEGADO EN: " + API);

export { API, GoogleClientId };