import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {recortarDireccion} from '../Utilities/direcciones';
import {format} from 'date-fns';
// Reseña
import { Modal, ModalBody, ModalHeader} from 'reactstrap'

export const InfoViaje = (props) => {
    const {usuarioActual,API} = props
    const [trayecto, setTrayecto] = useState(null)
    const [reservas, setReservas] = useState([])
    const [bloqueos, setBloqueos] = useState([])
    const [idClienteState, setId] = useState("")
    const [modal, setModal] = useState(false)
    
    const resID = useParams("id");

    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color
            }}
        />
    );

    const getTrayecto = async () => {
        const id = resID["id"];
        let bloqueoList = []

        // Buscamos la información del trayecto
        const resTrayecto = await fetch(`${API}/api/v1/trayectos/${id}`)
        let dataTrayecto = await resTrayecto.json();
        
        // Reservas del trayecto
        const resReserva = await fetch(`${API}/api/v1/reservas?trayecto=${id}`);
        const dataReservas = await resReserva.json();
        
        // Comprobamos si hemos valorado al conductor
        if (dataTrayecto["conductor"]["_id"] !== usuarioActual._id){
            // No somos el conductor
            let bloqueoConductor = await comprobarValoracion(dataTrayecto["conductor"]["_id"], dataTrayecto["_id"]);
            bloqueoList.push(bloqueoConductor)
        } else {
            // Somos el conductor
            bloqueoList.push(true);
        }

        // Cambiamos el campo de plazas por el número de pasajeros (reservas)
        let plazasOcupadas = 0;
        for (let r in dataReservas){
            plazasOcupadas = plazasOcupadas + (dataReservas[r]["pasajeros"])
            let clienteId = dataReservas[r]["cliente"]["_id"];
            let bloqueo = await comprobarValoracion(clienteId, dataTrayecto["_id"]);
            bloqueoList.push(bloqueo);
        }
        // Reducimos las plazas
        dataTrayecto["plazas"] = plazasOcupadas
        setTrayecto(dataTrayecto);
        setReservas(dataReservas);
        console.log(bloqueoList);
        setBloqueos(bloqueoList);
    }

    useEffect(() => {
        getTrayecto();
    }, [])

    // Abrir modal y establecer idCliente
    const abrirModal = (idCliente) => {
        setModal(true);
        setId(idCliente);
    }

    // Comprobar si ya existe una valoración para desactivar el boton
    const comprobarValoracion = async (idCliente, idTrayecto) => {
        const resReserva = await fetch(`${API}/api/v1/valoraciones/${idCliente}/${usuarioActual._id}/${idTrayecto}`);
        const dataReservas = await resReserva.json();

        if (dataReservas === "null"){
            return false;
        } else {
            return true;
        }
    }

    // Añadir valoración
    const handleSubmit = async (event) => {
        event.preventDefault();
        let nota = event.target.nota.value;
        let comentario = event.target.comentario.value;
        let idCliente = idClienteState;
        
        if (nota >= 0 && nota <= 5 && comentario !== null && comentario !== ""){
            const datos = {
                "usuarioValorado": idCliente,
                "nota": nota,
                "descripcion": comentario,
                "usuarioQueValora": usuarioActual._id,
                "idviaje": trayecto._id,
                "nombre": usuarioActual.nombre,
                "apellidos": usuarioActual.apellidos,
                "url_foto_perfil": usuarioActual.url_foto_perfil
            };
            console.log(datos)
            const res = await fetch(API + "/api/v1/valoraciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
            const data = await res.json();
            console.log(data);
            alert(data["msg"]);
            setModal(false);
            getTrayecto();
        } else {
            alert("El formato de entrada no es válido o algún campo está en blanco");
        }
        
    }

    return (
        <>
        {trayecto !== null && bloqueos !== [] ? (
        <div className="mt-3 card">
            <div className="card-body">
            
                <div className="fs-5 mb-3">{recortarDireccion(trayecto.origen)}</div>
                <div className="fs-5 mb-3">&#8594; {recortarDireccion(trayecto.destino)}</div>

                <div className="mb-3">
                    <div className="float-start me-3">
                        <img src={trayecto.conductor.url_foto_perfil} 
                                className="rounded-circle"
                                title={`Imagen de ${trayecto.conductor.nombre}`}
                                alt={`Imagen de ${trayecto.conductor.nombre}`}
                                width="80"
                                height="80"/><br />{trayecto.conductor.nombre}
                    </div>

                    <b>Fecha y hora de salida: </b>{isNaN(Date.parse(trayecto.fecha_hora_salida)) ? "" : format(Date.parse(trayecto.fecha_hora_salida), 'dd/MM HH:mm')}<br />
                    <b>Duración: </b>{trayecto.duracion_estimada} min<br />
                    <b>Plazas: </b>{trayecto.plazas}<br />
                    <b>Precio: </b>{trayecto.precio} €<br/>
                    <b>Estado: </b>{trayecto.permitir_valoraciones === false ? "En curso" : "Finalizado"} <br/>
                    {(trayecto.conductor._id !== usuarioActual._id && trayecto.permitir_valoraciones === true)? 
                        (                        
                        <><button disabled={bloqueos[0]} onClick={() => abrirModal(trayecto.conductor._id)} className="btn btn-primary btn-sm">Valorar</button><br /></>
                        )
                    :
                        (  
                        <></>
                        )
                    }

                <ColoredLine color={"blue"}></ColoredLine>
                <h3><b>Pasajeros:</b></h3>
                {reservas.map((r, index) => (   // El índice del conductor es el 0
                    <>
                    <div>
                    <div className="card-body">
                        <div className="float-start me-3">
                            <img src={r.cliente.url_foto_perfil} 
                                    className="rounded-circle"
                                    title={`Imagen de ${r.cliente.nombre}`}
                                    alt={`Imagen de ${r.cliente.nombre}`}
                                    width="80"
                                    height="80"/><br />{r.cliente.nombre}
                        </div>
                        <b>Estado: </b>{r.estado === "disponible" ? "Pendiente de pago" : r.estado}<br />
                        <b>Nº de plazas ocupadas: </b>{r.pasajeros}<br />
                        {(r.cliente._id !== usuarioActual._id && r.estado === "finalizado") ? 
                            (                        
                            <><button disabled={bloqueos[index + 1]} onClick={() => abrirModal(r.cliente._id)} className="btn btn-primary btn-sm">Valorar</button><br /></>
                            )
                        :
                            (  
                            <></>
                            )
                        }
                    </div>
                    <br/>
                    <Modal isOpen={modal}>
                        <ModalHeader>
                            Añadir Valoración
                        </ModalHeader>

                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <label>Nota: (1-5)</label> <br/>
                                <input style={{"width": "100%"}} type={"number"} name="nota"/> <br/>
                                <br/>
                                <label>Comentario:</label> <br/>
                                <textarea style={{"width": "100%"}} name="comentario"/> <br/>
                                <br/>
                                <input type={"submit"} className="btn btn-primary btn-sm col-12"/>
                                <button type={"reset"} onClick={() => setModal(false)} className="btn btn-warning btn-sm col-12">Cerrar</button>
                            </form>
                        </ModalBody>
                    </Modal>
                    </div>
                    </>
                ))}
                </div>
            </div>
        </div> 
        )
        :
        (
        <b>Cargando datos, por favor espere</b>
        )
        }  
        </>
    )
}