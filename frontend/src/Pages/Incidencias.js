import React, {useState} from "react";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import L from 'leaflet';


export const Incidencias = () => {
    const [localidad, setLocalidad] = useState("")
    const [provincia, setProvincia] = useState("")
    const [incidencias, setIncidencias] = useState([])
    const [map,setMap] = useState(null)

    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });    
    
    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });    
    
    var yellowIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    var blackIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const iconos = {"VERDE":greenIcon, "AMARILLO":yellowIcon, "ROJO":redIcon, "NEGRO":blackIcon }


    const buscaIncidencias = async (e) => {
        e.preventDefault();
        if (localidad === "" && provincia === "") {
            alert("No se ha especificado ningún lugar")
        } else {
            let str = ``
            if (localidad !== "" && provincia !== "") {
                str = `http://localhost:8080/api/v1/incidencias/search?localidad=${localidad}&provincia=${provincia}`;
            } else if (localidad !== "") {
                str = `http://localhost:8080/api/v1/incidencias/search?localidad=${localidad}`
            } else if(provincia !=="") {
                str = `http://localhost:8080/api/v1/incidencias/search?provincia=${provincia}`
            }
            const res = await fetch(str);
            const data = await res.json();
            console.log(data)
            if (data["msg"]===undefined) {
                setIncidencias(data);
                
                const pos = data[0].geometry.coordinates
                map.setView([pos[1],pos[0]], map.getZoom())
              
            } else {
                alert("No se han encontrado incidencias en la localidad indicada")
            }
        }

    }
    return (
        <div>
            <form onSubmit={buscaIncidencias} className="card card-body">
                <div className="col-md-4">
                    <div className="form-group">
                        Localidad: <input value={localidad} onChange={e => setLocalidad(e.target.value)} className="form-control" type="text"/>
                    </div>
                    <div className="form-group">
                        Provincia: <input value={provincia} onChange={e => setProvincia(e.target.value)} className="form-control" type="text"/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block form-control">Buscar Incidencias</button>
                    </div>
                </div>
            </form>
            <MapContainer center={[36.7213028,-4.4216366]} zoom={12} scrollWheelZoom={true} whenCreated={setMap} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {incidencias.map( incidencia => (
                    <div key={incidencia.properties.FID}>
                        <Marker icon={iconos[incidencia.properties.nivel]} position={[incidencia.geometry.coordinates[1],incidencia.geometry.coordinates[0]]}>
                        <Popup>
                            <div className='Map-Marker'>
                                Carretera: {incidencia.properties.carretera} <br/>
                                Causa: {incidencia.properties.causa} <br/>
                                Sentido: {incidencia.properties.sentido} <br/>
                                Nivel: {incidencia.properties.nivel} <br/>

                            </div>
                        </Popup>
                        </Marker>  
                    </div>
                ))}
            </MapContainer>
            
        </div>
    )
}