import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

export const Reservas = (props, price) => {
    const {usuarioActual,API} = props

    const [reservas, setReservas] = useState([])
    const createOrder = async (data, actions, reserva) => {
        const res = await fetch(`${API}/api/v1/trayectos/${reserva.trayecto._id}`)
        const datos = await res.json()

        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: datos.precio,
              },
            },
          ],
        });
      };
    const onApprove = async (data, actions, reserva) => {
        const cuerpo = {
            "trayecto": reserva.trayecto._id,
            "cliente": reserva.cliente._id,
            "fecha_hora_salida": reserva.fecha_hora_salida,
            "pasajeros": reserva.pasajeros,
            "estado": "pagado"
        };
        const res = await fetch(`${API}/api/v1/reservas/${reserva._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuerpo)
        })
        const datos = await res.json()
        return actions.order.capture();
    };

    const onError = (err) => {
       console.log(err);
       alert("Algo salió mal, no se le ha cobrado el importe")
    };
    useEffect(() => {
        getReservas();
    })

    const getReservas = async () => {
        const res = await fetch(`${API}/api/v1/reservasCliente/${usuarioActual._id}`)
        const data = await res.json();
        setReservas(data)
    }

   

    return(
    <div className="col-md-8">
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Dia y hora de salida</th>
                <th>Pasajeros</th>
                <th>Estado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {reservas.map(reserva => (
                <tr key={reserva._id}>
                        <td>{reserva.trayecto.origen}</td>
                        <td>{reserva.trayecto.destino}</td>
                        <td>{reserva.fecha_hora_salida}</td>
                        <td>{reserva.pasajeros}</td>
                        <td>{reserva.estado}</td>
                        <td>{reserva.estado === "disponible" ? (
                        <PayPalButton
                            createOrder={(data, actions) => createOrder(data, actions, reserva)}
                            onApprove={(data, actions) => onApprove(data, actions, reserva)}
                            onError = {(err) => onError(err)}
                        />
                        ) : (<p>¡El viaje ya ha sido pagado!</p>)}</td>
                </tr>
            ))}
        </tbody>
        
    </table>
    
</div>
    )
}