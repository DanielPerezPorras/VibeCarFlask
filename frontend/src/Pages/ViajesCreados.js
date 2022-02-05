import React, {useState, useEffect} from 'react';
import {recortarDireccion} from '../Utilities/direcciones';
import {format} from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const ViajesCreados = (props) => {
    const {usuarioActual,API} = props
    const [trayectos, setTrayectos] = useState([])

    const getTrayectos = async () => {
        const res = await fetch(`${API}/api/v1/trayectos?conductor=${usuarioActual._id}`)
        const data = await res.json();
        
        // Reservas
        const reservas = await fetch(`${API}/api/v1/reservas`);
        const dataReservas = await reservas.json();

        // Cambiamos el campo de plazas por el número de pasajeros (reservas)
        for (let d in data){
            let plazasOcupadas = 0;
            for (let r in dataReservas){
                if (dataReservas[r]["trayecto"]["_id"] === data[d]["_id"]){
                    plazasOcupadas = plazasOcupadas + (dataReservas[r]["pasajeros"])
                }
            }
            // Reducimos las plazas
            data[d]["plazas"] = plazasOcupadas
        }

        setTrayectos(data);
        console.log(trayectos);
    }

    useEffect(() => {
        getTrayectos();
    }, [API , usuarioActual._id])

    let navigate = useNavigate();

    function Redirect(id) {
        navigate(`/infoViaje/${id}`)
    };

    const finalizar = async (id) => {
        // Modificamos el trayecto
        const res = await fetch(`${API}/api/v1/trayectos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"permitir_valoraciones": true})
        })
        const data = await res.json();
        console.log(data)
        
        // Obtenemos las reservas del trayecto
        const resReserva = await fetch(`${API}/api/v1//reservas?trayecto=${id}`)
        const dataReservas = await resReserva.json();
        
        for (let r in dataReservas){
            console.log(dataReservas[r])
            
            // Actualizamos el estado de la reserva a "finalizado"
            let res = await fetch(`${API}/api/v1/reservas/${dataReservas[r]["_id"]}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"estado": "finalizado"})
            })
            let data = await res.json();
            console.log(data)
        }
        alert("Viaje finalizado")
        getTrayectos();
    }

    return(
    <div className="col">
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Dia y hora de salida</th>
                <th>Pasajeros</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            {trayectos.map(trayecto => (
                <tr key={trayecto._id}>
                        <td>{recortarDireccion(trayecto.origen)}</td>
                        <td>{recortarDireccion(trayecto.destino)}</td>
                        <td>{format(Date.parse(trayecto.fecha_hora_salida), 'dd/MM HH:mm')}</td>
                        <td>{trayecto.plazas}</td>
                        <td>{trayecto.permitir_valoraciones === false ? "En curso" : "Finalizado"}</td>
                        <td><button disabled={trayecto.permitir_valoraciones} onClick={() => finalizar(trayecto._id)} className='btn btn-primary btn-sm col-12'>Finalizar</button></td>
                        <td><button onClick={() => Redirect(trayecto._id)} className='btn btn-warning btn-sm col-12'>Ver información</button></td>

                </tr>
            ))}
        </tbody>
        
    </table>
</div>
    )
}