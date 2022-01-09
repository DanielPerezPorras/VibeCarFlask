let API = process.env["API"];
if (API === undefined) {
  API = 'http://localhost:8080'
}

console.log("BACKEND DESPLEGADO EN: " + API);

export { API };