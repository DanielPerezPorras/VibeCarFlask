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

/*
<div class="container-lg">
      <div id="main" role="main">
    
        <h1 class="mb-3">Bienvenido a VibeCar</h1>

        <!-- https://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/ -->
        <div id="map" class="mb-3" style="height: 440px; border: 1px solid #AAA;"></div>

        <label for="geocode-test" class="form-label">Introduce un lugar</label>
        <div class="input-group">
          <input type="text" class="form-control" id="geocode-test" placeholder="p. ej. Málaga" />
          <button class="btn btn-primary" type="submit" onclick="locatePlace()">Geocode!</button>
        </div>

      </div>
    </div>

*/