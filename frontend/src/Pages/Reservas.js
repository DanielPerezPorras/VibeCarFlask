import React, {useState, useEffect} from 'react';


export const Reservas = (props) => {
    const {usuarioActual,API} = props
    const [reservas, setReservas] = useState([])

    useEffect(() => {
        const getReservas = async () => {
            const res = await fetch(`${API}/api/v1/reservasCliente/${usuarioActual._id}`)
            const data = await res.json();
            setReservas(data)
        }
        getReservas();
    }, [API , usuarioActual._id])

    return(
    <div className="col-md-6">
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Dia y hora de salida</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            {reservas.map(reserva => (
                <tr key={reserva._id}>
                        <td>{reserva.trayecto.origen}</td>
                        <td>{reserva.trayecto.destino}</td>
                        <td>{reserva.fecha_hora_salida}</td>
                        <td>{reserva.estado}</td>
                </tr>
            ))}
        </tbody>
        
    </table>
</div>
    )
}