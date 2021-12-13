import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutineMachine from "../Components/RoutineMachine";

import "../Styles/Mapa.css"

function Viajes() {
  const [origen, setOrigen] = useState("")
    const [destino, setDestino] = useState("")
    const [trayectos, setTrayectos] = useState([])
    const [coord, setCoord] = useState([])

    useEffect(() => {
        getTrayectos(); 
    }, [])

    function LanzaMaquina (){
        return (<RoutineMachine coord={coord} />)
    }
    
    const getTrayectos = async () => {
        const res = await fetch(`http://localhost:8080/api/v1/trayectos`)
        const data = await res.json();
        console.log(data)
        setTrayectos(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await fetch(`http://localhost:8080/api/v1/trayectos?origen=${origen}&?destino=${destino}`)
        const data = await res.json();
        console.log(data)
        setTrayectos(data)
        
        if (origen !== "" && destino !== ""){
            var coords = []

            const res1 = await fetch(`https://nominatim.openstreetmap.org/search?city=${origen}&country=Spain&format=json`)
            const data1 = await res1.json();
            const data1Res = data1[0]
            coords.push(parseFloat(data1Res["lat"]))
            coords.push(parseFloat(data1Res["lon"]))
            
            const res2 = await fetch(`https://nominatim.openstreetmap.org/search?city=${destino}&country=Spain&format=json`)
            const data2 = await res2.json();
            const data2Res = data2[0]
            coords.push(parseFloat(data2Res["lat"]))
            coords.push(parseFloat(data2Res["lon"]))
            setCoord(coords)
        } else {
            setCoord([])
        }
    }

    return (
      <div className="pantalla">
          <title>Próximos viajes</title>
            <div className="ladoIzq">
                <div>
                    <form onSubmit={handleSubmit} className="card card-body">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                onChange={e => setOrigen(e.target.value)}
                                value={origen}
                                autoFocus
                                className="form-control"
                                placeholder="Origen" />
                            <input
                                type="text"
                                onChange={e => setDestino(e.target.value)}
                                value={destino}
                                className="form-control"
                                placeholder="Destino" />
                        </div>
                        <button className="btn btn-primary btn-block">
                            Buscar trayectos
                        </button>
                    </form>
                </div>
                <br/>
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Conductor</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Fecha</th>
                                <th>Duración</th>
                                <th>Plazas</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                        {trayectos.map(t => (
                            <tr key={t._id}>
                                <td><img src={t.conductor.url_foto_perfil} 
                                         title={`Imagen de ${t.conductor.nombre}`}
                                         alt={`Imagen de ${t.conductor.nombre}`}
                                         width="80"
                                         height="80"/> {t.conductor.nombre}</td>
                                <td>{t.origen}</td>
                                <td>{t.destino}</td>
                                <td>{t.fecha_hora_salida}</td>
                                <td>{t.duracion_estimada}</td>
                                <td>{t.plazas}</td>
                                <td>{t.precio}</td>
                                <td><button className="btn btn-warning btn-sm btn-block">Reservar</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mapa">
                <MapContainer
                    doubleClickZoom={false}
                    id="mapId"
                    zoom={12}
                    center={[36.7213028, -4.4216366]}
                >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LanzaMaquina />
                </MapContainer>
            </div>
        </div>
    );
}

export default Viajes;