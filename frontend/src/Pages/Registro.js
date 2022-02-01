import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import VibecarContext from '../Components/VibecarContext';
import { API } from "../config";

function Registro(props) {

  let [ok, setOk] = useState(false);

  let [nombre, setNombre] = useState(props.initialFirstName);
  let [apellidos, setApellidos] = useState(props.initialLastName);
  let [telefono, setTelefono] = useState("");
  let [linkPaypal, setLinkPaypal] = useState("");

  let [errorNombre, setErrorNombre] = useState(null);
  let [errorApellidos, setErrorApellidos] = useState(null);
  let [errorTelefono, setErrorTelefono] = useState(null);
  let [errorLinkPaypal, setErrorLinkPaypal] = useState(null);

  let [errorServidor, setErrorServidor] = useState(null);

  let [checking, setChecking] = useState(false);

  const validarRegistro = async ev => {
    ev.preventDefault();
    let ok = true;
    setChecking(true);

    if (nombre.trim().length === 0) {
      setErrorNombre("El nombre está vacío.");
      ok = false;
    } else {
      setErrorNombre("");
    }

    if (apellidos.trim().length === 0) {
      setErrorApellidos("Los apellidos están vacíos.");
      ok = false;
    } else {
      setErrorApellidos("");
    }

    if (telefono.trim().length === 0) {
      setErrorTelefono("El teléfono está vacío.");
      ok = false;
    } else {
      setErrorTelefono("");
    }
    
    if (linkPaypal.trim().length === 0) {
      setErrorLinkPaypal("El enlace de PayPal está vacío.");
      ok = false;
    } else {
      setErrorLinkPaypal("");
    }

    if (ok) {
      const datos = {
        "nombre": nombre,
        "apellidos": apellidos,
        "email": props.email,
        "telefono": telefono,
        "link_paypal": linkPaypal,
        "url_foto_perfil": "/defaultpfp.png",
        "rol": 1
      };
      fetch(API + "/api/v1/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      }).then(
        async (res) => {
          if (res.status === 200) {
            const respuesta = await res.json()
            datos["_id"] = respuesta["new_id"];
            VibecarContext.value.usuarioActual = datos;
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

  function clasesCampo(err) {
    if (err === null) {
      return "form-control";
    } else if (err === "") {
      return "form-control is-valid";
    } else {
      return "form-control is-invalid";
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
      <div className="row">
        <form onSubmit={validarRegistro} className="offset-md-2 col-md-8">
          <h1>Regístrate en Vibecar</h1>
          {
            errorServidor &&
            <div className="alert alert-danger">{errorServidor}</div>
          }
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="campo-nombre" className="form-label">Nombre</label>
              <input type="text" className={clasesCampo(errorNombre)} id="campo-nombre" value={nombre}
              onChange={ev => setNombre(ev.target.value)} disabled={checking} />
              {infoCampo(errorNombre)}
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="campo-apellidos" className="form-label">Apellidos</label>
              <input type="text" className={clasesCampo(errorApellidos)} id="campo-apellidos" value={apellidos}
              onChange={ev => setApellidos(ev.target.value)} disabled={checking} />
              {infoCampo(errorApellidos)}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-8 mb-3">
              <label htmlFor="campo-email" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="campo-email" value={props.email}
              readOnly />
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="campo-telefono" className="form-label">Teléfono</label>
              <input type="tel" className={clasesCampo(errorTelefono)} id="campo-telefono" value={telefono}
              onChange={ev => setTelefono(ev.target.value)} disabled={checking} />
              {infoCampo(errorTelefono)}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="campo-link-paypal" className="form-label">Enlace de PayPal en el que recibirás los pagos</label>
            <input type="url" className={clasesCampo(errorLinkPaypal)} id="campo-link-paypal" value={linkPaypal}
            onChange={ev => setLinkPaypal(ev.target.value)} disabled={checking} />
            {infoCampo(errorLinkPaypal)}
          </div>
          <input type="submit" className="btn btn-primary" value="Crear mi cuenta" disabled={checking} />
        </form>
      </div>
    );
  }
  
}

export default Registro;