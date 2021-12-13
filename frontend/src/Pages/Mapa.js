import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState } from 'react'

export const Mapa = () => {

    const [localidad, setLocalidad] = useState("")
    const [tipo,setTipo] = useState("")
    const [gasolineras,setGasolineras] = useState([])
    const [map,setMap] = useState(null)
    
    const options = [
      { value: '0', label: 'Biodiesel' },
      { value: '1', label: 'Bioetanol' },
      { value: '2', label: 'Gas Natural Comprimido' },
      { value: '3', label: 'Gas Natural Licuado' },
      { value: '4', label: 'Gases licuados del petróleo' },
      { value: '5', label: 'Gasoleo A' },
      { value: '6', label: 'Gasoleo B' },
      { value: '7', label: 'Gasoleo Premium' },
      { value: '8', label: 'Gasolina 95 E10' },
      { value: '9', label: 'Gasolina 95 E5' },
      { value: '10', label: 'Gasolina 95 E5 Premium' },
      { value: '11', label: 'Gasolina 98 E10' },
      { value: '12', label: 'Gasolina 98 E5' },
      { value: '13', label: 'Hidrogeno' }
    ];
    
    const buscaGasolineras = async (e) => {
      e.preventDefault()
      const res = await fetch(`http://localhost:8080/api/v1/gasolineras/search?localidad=${localidad}&tipo=${tipo}`)
      const data = await res.json();
      if (data["msg"]===undefined) {
        setGasolineras(data);
        var lat = parseFloat(data[0].Latitud.replace(',', '.'))
        var lon = parseFloat(data[0]["Longitud (WGS84)"].replace(',', '.'))
        map.setView([lat,lon], map.getZoom())
      
      } else {
        alert("No se han encontrado gasolineras del tipo indicado en la localidad indicada")
      }
      
      
    }  

    return (
      <div>
        <form onSubmit={buscaGasolineras} className='card card-body'>
          <div className='col-md-4'>
            <input type="text" placeholder='localidad' value={localidad} onChange={e => setLocalidad(e.target.value)} className="form-control" />
            <select placeholder="Tipo" onChange={e => setTipo(e.target.value)} className="form-control">
              {options.map(option => (
                <option key={option.value} value={option.value} label={option.label}/>
              ))}
            </select>

          <button className='form-control' >Buscar</button>
          </div>

        </form>
        <MapContainer center={[36.7213028,-4.4216366]} zoom={13} scrollWheelZoom={true} whenCreated={setMap} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {gasolineras.map( gasolinera => (
            <div key={gasolinera.Dirección}>
              <Marker position={[parseFloat(gasolinera.Latitud.replace(',', '.')), parseFloat(gasolinera["Longitud (WGS84)"].replace(",", '.'))]}>
              <Popup>
                <div className='Map-Marker'>
                  Municipio: {gasolinera.Municipio} <br/>
                  Empresa: {gasolinera["Rótulo"]} <br/> 
                  Dirección: {gasolinera["Dirección"]} <br/>
                  Horario: {gasolinera.Horario} <br/>
                  Precio {options[parseInt(tipo)]["label"]} : {gasolinera["Precio " + options[parseInt(tipo)]["label"]]} €/L <br/>

                </div>
              </Popup>
            </Marker>  
            </div>
          ))}
        </MapContainer>
      </div>
    )
}