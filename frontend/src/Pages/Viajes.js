import React, {useState} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutineMachine from "../Components/RoutineMachine";
import {format} from 'date-fns'
import {importarFechaDeBD, importarFechaDeFormulario, parteFechaIgual} from '../Utilities/dates';
import {recortarDireccion} from '../Utilities/direcciones'

import "../Styles/Mapa.css"
import VibecarContext from "../Components/VibecarContext";

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
        setOrigen("")
        setDestino("")
        setPrecio("")
        setFecha(new Date().toISOString().split("T")[0])
        setTrayectos([])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await fetch(`http://localhost:8080/api/v1/trayectos?origen=${origen}&destino=${destino}`)
        const data = await res.json();

        const reservas = await fetch(`http://localhost:8080/api/v1/reservas`);
        const dataReservas = await reservas.json();

        if (origen !== "" && destino !== ""){
            // Aplicar filtros
            let filtroRes = []
            for (let d in data) {
                console.log(data[d])

                // Filtro precio
                let filtroPrecio = true
                if (precio !== "") {
                    filtroPrecio = parseFloat(data[d]["precio"]) <= parseFloat(precio)
                }

                // Filtro plazas
                let filtroPlaza = true
                let plazasOcupadas = 0;
                for (let r in dataReservas){
                    if (dataReservas[r]["trayecto"]["_id"] === data[d]["_id"]){
                        plazasOcupadas = plazasOcupadas + (dataReservas[r]["pasajeros"])
                    }
                }

                console.log("plazas ocupadas: " + String(plazasOcupadas))
                console.log("plazas originales: " + parseInt(data[d]["plazas"]))
                if (plazasOcupadas + (plazas === "" ? 1 : parseInt(plazas)) <= parseInt(data[d]["plazas"])){
                    data[d]["plazas"] = parseInt(data[d]["plazas"]) - plazasOcupadas
                } else {
                    filtroPlaza = false
                }

                // Filtro fecha
                let filtroFecha = true;
                var fechaForm = importarFechaDeFormulario(fecha);
                if (fechaForm !== null) {
                    var fechaJson = importarFechaDeBD(data[d]["fecha_hora_salida"]);
                    console.log(fechaForm)
                    console.log(fechaJson)
                    filtroFecha = parteFechaIgual(fechaJson, fechaForm);
                }
                console.log(fechaForm)
                console.log(fechaJson)
                console.log(filtroFecha + ", " + filtroPrecio + ", " + filtroPlaza);
                
                if (filtroFecha && filtroPrecio && filtroPlaza){
                    filtroRes.push(data[d])
                }
            }
            setTrayectos(filtroRes)
            if (filtroRes.length === 0) {
                alert("No se han encontrado trayectos.")
            }
        } else {
            alert("Debes indicar un lugar de Origen y Destino para buscar trayectos")
        }
    }

    // Crear la reserva
    const reservar = async (id) => {
        if (VibecarContext.value["usuarioActual"] == null){
            alert("Debes iniciar sesión antes de reservar un trayecto")
        } else {
            const datos = {
                "trayecto": id,
                "cliente": VibecarContext.value["usuarioActual"]["_id"],
                "fecha_hora_salida": fecha,
                "pasajeros": plazas === "" ? 1 : plazas,
                "estado": "disponible"
            };
            console.log(datos)
            const res = await fetch("http://localhost:8080/api/v1/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
            const data = await res.json();
            console.log(data)
            alert("Reserva realizada")
        }
    }

    const actualizarMapa = async (origen, destino) => {
        // Mapa
        var coords = []
        if (origen !== "" && destino !== ""){
            // Actualizamos el mapa
            const res1 = await fetch(`https://nominatim.openstreetmap.org/search?q=${origen}&country=Spain&format=json`)
            const data1 = await res1.json();
            const res2 = await fetch(`https://nominatim.openstreetmap.org/search?q=${destino}&country=Spain&format=json`)
            const data2 = await res2.json();
            const data1Res = data1[0]
            const data2Res = data2[0]

            if (data1[0] !== undefined && data2[0] !== undefined) {
                coords.push(parseFloat(data1Res["lat"]))
                coords.push(parseFloat(data1Res["lon"]))
                coords.push(parseFloat(data2Res["lat"]))
                coords.push(parseFloat(data2Res["lon"]))
                coords.push(origen)
                coords.push(destino)
                setCoord(coords)
            } else {
                setCoord([])
            }
        } else {
            setCoord([])
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-8" >
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
                                    <input className="form-control" type="date" min={new Date().toISOString().split("T")[0]} id="start"
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
                    <div style={{height:"200px", overflowY:"auto"}} > 
                    {trayectos.map(t => (
                        <div className="mt-3 card" key={t._id}>
                            <div className="card-body">
                            
                                <div className="fs-5 mb-3">{recortarDireccion(t.origen)}</div>
                                <div className="fs-5 mb-3">&#8594; {recortarDireccion(t.destino)}</div>

                                <div className="mb-3">
                                    <div className="float-start me-3">
                                        <img src={t.conductor.url_foto_perfil} 
                                                className="rounded-circle"
                                                title={`Imagen de ${t.conductor.nombre}`}
                                                alt={`Imagen de ${t.conductor.nombre}`}
                                                width="80"
                                                height="80"/><br />{t.conductor.nombre}
                                    </div>

                                    <b>Fecha y hora de salida: </b>{isNaN(Date.parse(t.fecha_hora_salida)) ? "" : format(Date.parse(t.fecha_hora_salida), 'dd/MM HH:mm')}<br />
                                    <b>Duración: </b>{t.duracion_estimada} min<br />
                                    <b>Plazas: </b>{t.plazas}<br />
                                    <b>Precio: </b>{t.precio} €

                                </div>
                                <button onClick={() => reservar(t._id)} className="btn btn-primary btn-sm col-12">Reservar</button>
                                <button onClick={() => actualizarMapa(t.origen, t.destino)} className="btn btn-warning btn-sm col-12">Ver Mapa</button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <MapContainer
                        doubleClickZoom={false}
                        id="mapId"
                        zoom={12}
                        center={[36.7213028,-4.4216366]}
                    >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LanzaMaquina />
                    </MapContainer>
                </div>
            </div>
        </>
    );
}

export default Viajes;