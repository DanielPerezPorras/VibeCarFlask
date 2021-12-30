import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import VibecarContext from '../Components/VibecarContext';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { prepararFechaParaBD } from "../Utilities/dates";

//   `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

function CrearTrayecto(props) {

  const usuarioActual = VibecarContext.value.usuarioActual;

  let [ok, setOk] = useState(false);

  let [origen, setOrigen] = useState(null);
  let [destino, setDestino] = useState(null);
  let [fechaHoraSalida, setFechaHoraSalida] = useState("");
  let [duracionEstimada, setDuracionEstimada] = useState("");
  let [plazas, setPlazas] = useState("");
  let [precio, setPrecio] = useState("");

  let [errorOrigen, setErrorOrigen] = useState(null);
  let [errorDestino, setErrorDestino] = useState(null);
  let [errorFechaHoraSalida, setErrorFechaHoraSalida] = useState(null);
  let [errorDuracionEstimada, setErrorDuracionEstimada] = useState(null);
  let [errorPlazas, setErrorPlazas] = useState(null);
  let [errorPrecio, setErrorPrecio] = useState(null);

  let [errorServidor, setErrorServidor] = useState(null);

  // 0 cuando el mapa no esté activo,
  // 1 cuando se seleccione el origen,
  // 2 cuando se seleccione el destino
  let [selectingPoint, setSelectingPoint] = useState(0);
  let [checking, setChecking] = useState(false);

/*
 <Marker position={[props.getPoint.lat, props.getPoint.lon]}>
        <Popup>{props.getPoint.display_name}</Popup>
      </Marker>
*/

  function CrearTrayectoMapListener() {
    useMapEvents({
      click(ev) {
        onClickMapa(ev);
      }
    });
    return <></>;
  }

  const onClickMapa = async ev => {
    if (selectingPoint === 1 || selectingPoint === 2) {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ev.latlng.lat}&lon=${ev.latlng.lng}&format=json`).then(
        async (res) => {
          if (res.status === 200) {
            const json = await res.json();
            if (json.error === undefined) {
              json.lat = parseFloat(json.lat);
              json.lon = parseFloat(json.lon);
              if (selectingPoint === 1) {
                setOrigen(json);
              } else {
                setDestino(json);
              }
              setSelectingPoint(0);
            }
          }
        }, (err) => { }
      )
    }
  }

  const validarNuevoTrayecto = async ev => {
    ev.preventDefault();
    let ok = true;
    setChecking(true);

    let fecha = null;
    let fechaString = "";
    let duracion = 0;
    let miPrecio = 0;
    let misPlazas = 0;

    if (origen === null) {
      setErrorOrigen("Especifica una dirección de origen.");
      ok = false;
    } else {
      setErrorOrigen("");
    }

    if (destino === null) {
      setErrorDestino("Especifica una dirección de destino.");
      ok = false;
    } else {
      setErrorDestino("");
    }

    if (fechaHoraSalida === "") {
      setErrorFechaHoraSalida("Introduce una fecha/hora válida");
      ok = false;
    } else {
      fecha = Date.parse(fechaHoraSalida);
      const hoy = Date.now();
      if (fecha.isNaN) {
        setErrorFechaHoraSalida("Introduce una fecha/hora válida");
        ok = false;
      } else if (hoy >= fecha) {
        setErrorFechaHoraSalida("Introduce una fecha/hora en el futuro.");
        ok = false;
      } else {
        fechaString = prepararFechaParaBD(new Date(fecha));
        setErrorFechaHoraSalida("");
      }
    }
    
    if (duracionEstimada === "") {
      setErrorDuracionEstimada("Estima la duración del viaje.");
      ok = false;
    } else {
      duracion = parseInt(duracionEstimada);
      if (duracion.isNaN || duracion <= 0) {
        setErrorDuracionEstimada("Introduce un número entero positivo.");
        ok = false;
      } else {
        setErrorDuracionEstimada("");
      }
    }

    if (precio === "") {
      setErrorPrecio("Establece un precio.");
      ok = false;
    } else {
      miPrecio = parseFloat(precio);
      if (miPrecio.isNaN || miPrecio <= 0) {
        setErrorPrecio("Introduce un precio positivo.");
        ok = false;
      } else {
        setErrorPrecio("");
      }
    }

    if (plazas === "") {
      setErrorPlazas("Indica de cuántas plazas dispones.");
      ok = false;
    } else {
      misPlazas = parseInt(plazas);
      if (misPlazas.isNaN || misPlazas <= 0) {
        setErrorPlazas("Introduce un número entero positivo.");
        ok = false;
      } else {
        setErrorPlazas("");
      }
    }

    if (ok) {
      const datos = {
        "origen": origen.display_name,
        "destino": destino.display_name,
        "fecha_hora_salida": fechaString,
        "duracion_estimada": duracion,
        "plazas": misPlazas,
        "precio": miPrecio,
        "permitir_valoraciones": false,
        "conductor": usuarioActual["_id"]
      };
      fetch("http://localhost:8080/api/v1/trayectos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      }).then(
        async (res) => {
          if (res.status === 200) {
            setOk(true);
            props.forceAppUpdate();
          } else {
            setErrorServidor("Error del servidor. Vuelve a intentarlo más tarde.");
            setChecking(false);
          }
        }, (err) => {
          setErrorServidor("Error del servidor. Vuelve a intentarlo más tarde.");
          setChecking(false);
        }
      )
    } else {
      setChecking(false);
    }
  }

  function mostrarDireccion(dir) {
    if (dir !== null) {
      return dir.display_name;
    } else {
      return "";
    }
  }

  function clasesCampo(err) {
    if (err === null) {
      return "form-control";
    } else if (err === "") {
      return "form-control is-valid";
    } else {
      return "form-control is-invalid";
    }
  }

  function textoSeleccion() {
    switch (selectingPoint) {
      case 1:
        return <p>Selecciona el punto de origen haciendo clic en el mapa</p>;
      case 2:
        return <p>Selecciona el punto de destino haciendo clic en el mapa</p>;
      default:
        return <></>
    }
  }

  function infoCampo(err) {
    if (err !== null && err !== "") {
      return <div className="form-text text-danger">{err}</div>;
    } else {
      return <></>;
    }
  }
  
  if (ok) {
    return <Navigate to="/myprofile" />
  } else {
    return (

      <form onSubmit={validarNuevoTrayecto}>
        
        <h1>Crear un trayecto</h1>
        {
          errorServidor &&
          <div className="alert alert-danger">{errorServidor}</div>
        }

        {textoSeleccion()}

        <MapContainer id="map" className="mb-4" center={[36.7213028,-4.4216366]} zoom={13} scrollWheelZoom={true} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          { origen &&
            <Marker position={[origen.lat, origen.lon]}>
              <Popup><b>Origen:</b> {origen.display_name}</Popup>
            </Marker>
          }
          { destino &&
            <Marker position={[destino.lat, destino.lon]}>
              <Popup><b>Destino:</b> {destino.display_name}</Popup>
            </Marker>
          }

          <CrearTrayectoMapListener />
        </MapContainer>

        <div className="mb-3">
          <label htmlFor="campo-origen" className="form-label">Dirección de origen</label>
          <div className="input-group mb-3">
            <input type="text" className={clasesCampo(errorOrigen)} id="campo-origen" value={mostrarDireccion(origen)}
            readOnly />
            <button className="btn btn-primary" type="button" onClick={() => setSelectingPoint(1)}
            disabled={checking || selectingPoint > 0}>Seleccionar en el mapa</button>
          </div>
          {infoCampo(errorOrigen)}
        </div>
        <div className="mb-3">
          <label htmlFor="campo-destino" className="form-label">Dirección de destino</label>
          <div className="input-group mb-3">
            <input type="text" className={clasesCampo(errorDestino)} id="campo-destino" value={mostrarDireccion(destino)}
            readOnly />
            <button className="btn btn-primary" type="button" onClick={() => setSelectingPoint(2)}
            disabled={checking || selectingPoint > 0}>Seleccionar en el mapa</button>
          </div>
          {infoCampo(errorDestino)}
        </div>
        <div className="row">

          <div className="col-md-4 mb-3">
            <label htmlFor="campo-fh-salida" className="form-label">Fecha y hora de salida</label>
            <input type="datetime-local" className={clasesCampo(errorFechaHoraSalida)} id="campo-fh-salida"
            value={fechaHoraSalida} onChange={ev => setFechaHoraSalida(ev.target.value)} disabled={checking} />
            {infoCampo(errorFechaHoraSalida)}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="campo-duracion" className="form-label">Duración del viaje</label>
            <div className="input-group">
              <input type="number" className={clasesCampo(errorDuracionEstimada)} id="campo-duracion"
              value={duracionEstimada} onChange={ev => setDuracionEstimada(ev.target.value)} disabled={checking} />
              <span className="input-group-text">min</span>
            </div>
            {infoCampo(errorDuracionEstimada)}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="campo-precio" className="form-label">Precio por pasajero</label>
            <div className="input-group">
              <input type="number" className={clasesCampo(errorPrecio)} id="campo-precio"
              value={precio} onChange={ev => setPrecio(ev.target.value)} disabled={checking} />
              <span className="input-group-text">€</span>
            </div>
            {infoCampo(errorPrecio)}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="campo-plazas" className="form-label">Número de plazas</label>
            <input type="number" className={clasesCampo(errorPlazas)} id="campo-plazas"
            value={plazas} onChange={ev => setPlazas(ev.target.value)} disabled={checking} />
            {infoCampo(errorPlazas)}
          </div>

        </div>

        <input type="submit" className="btn btn-primary" value="Crear trayecto"
        disabled={checking || selectingPoint > 0} />
      </form>
    );
  }
  
}

export default CrearTrayecto;