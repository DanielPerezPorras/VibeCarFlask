let API = process.env["API"];
if (API === undefined) {
  API = 'http://localhost:8080'
}

export { API };