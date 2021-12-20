import React, {useState} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutineMachine from "../Components/RoutineMachine";
import {format} from 'date-fns'

import "../Styles/Mapa.css"

function Viajes() {
    const [origen, setOrigen] = useState("")
    const [destino, setDestino] = useState("")
    const [precio, setPrecio] = useState("")
    const [plazas, setPlazas] = useState("")
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])

    const [trayectos, setTrayectos] = useState([])
    const [coord, setCoord] = useState([])

    function LanzaMaquina (){
        return (<RoutineMachine coord={coord} />)
    }

    const limpiar = () => {
        setOrigen = ""
        setDestino = ""
        setPrecio = ""
        setFecha = new Date().toISOString().split("T")[0]
        setTrayectos = []
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await fetch(`http://localhost:8080/api/v1/trayectos?origen=${origen}&destino=${destino}`)
        const data = await res.json();
        
        let filtroRes = []
        for (let d in data){
            // Filtro precio
            let filtroPrecio = true
            if (precio !== ""){
                filtroPrecio = parseFloat(data[d]["precio"]) <= parseFloat(precio)
            }

            // Filtro plazas
            // TODO: Recibir las reservas para calcular el número de plazas restantes

            // Filtro fecha
            var fechaJson = Date.parse(data[d]["fecha_hora_salida"])
            var fecha1 = new Date(fechaJson).toISOString().split("T")[0]
            var fecha2 = (new Date(fecha)).toISOString().split("T")[0]
            let filtroFecha = fecha1 === fecha2
            
            if (filtroFecha && filtroPrecio){
                filtroRes.push(data[d])
            }
        }
        setTrayectos(filtroRes)
        
        // Actualizamos el mapa
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
                    <form className="card card-body">
                        <div className="mb-3">
                            <label htmlFor="campo-origen" className="form-label">Origen</label>
                            <input
                                id="campo-origen"
                                type="text"
                                onChange={e => setOrigen(e.target.value)}
                                value={origen}
                                autoFocus
                                className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="campo-destino" className="form-label">Destino</label>
                            <input
                                id="campo-destino"
                                type="text"
                                onChange={e => setDestino(e.target.value)}
                                value={destino}
                                className="form-control" />
                        </div>
                        <div className="row">

                            <div className="col-md-4 mb-3">
                                <label htmlFor="campo-precio" className="form-label">Precio máximo</label>
                                <div className="input-group">
                                    <input
                                        id="campo-precio"
                                        type="number"
                                        onChange={e => setPrecio(e.target.value)}
                                        value={precio}
                                        className="form-control" />
                                    <span className="input-group-text">€</span>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label htmlFor="campo-precio" className="form-label">N.º de plazas</label>
                                <input
                                    type="number"
                                    onChange={e => setPlazas(e.target.value)}
                                    value={plazas}
                                    className="form-control" />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label htmlFor="campo-precio" className="form-label">Fecha de salida</label>
                                <input className="form-control" type="date" id="start"
                                    onChange={e => setFecha(e.target.value)}
                                    value={fecha}>
                                </input>
                            </div>

                        </div>
                        <button className="btn btn-primary btn-block"
                            onClick={handleSubmit}>
                            Buscar trayectos
                        </button>
                        <button className="btn btn-warning btn-block"
                            onClick={limpiar}>
                            Limpiar
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
                                <th>Fecha [dia/Mes]</th>
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
                                <td>{isNaN(Date.parse(t.fecha_hora_salida)) ? "" : format(Date.parse(t.fecha_hora_salida), '[dd/MM] HH:MM')}</td>
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