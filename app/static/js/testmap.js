const map = L.map('map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
subdomains: ['a','b','c']
}).addTo(map);

const geocodeTestElem = document.getElementById("geocode-test");

function locatePlace() {
  q = encodeURIComponent(geocodeTestElem.value);
  fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + q).then(
    (response) => {
      json = response.json().then(
        (json) => {
          if (json.length > 0) {
            lugar = json[0];
            console.log([lugar.lat, lugar.lon]);
            L.marker([lugar.lat, lugar.lon]).addTo(map);
            map.setView([lugar.lat, lugar.lon], 14);
          } else {
            console.error("Ningún lugar encontrado");
          }
        }
      );
    }
  )
}