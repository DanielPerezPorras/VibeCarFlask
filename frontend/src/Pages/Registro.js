import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import VibecarContext from '../Components/VibecarContext';

function Registro(props) {

  let [ok, setOk] = useState(false);

  let [nombre, setNombre] = useState("");
  let [apellidos, setApellidos] = useState("");
  let [email, setEmail] = useState("");
  let [telefono, setTelefono] = useState("");
  let [contrasenia1, setContrasenia1] = useState("");
  let [contrasenia2, setContrasenia2] = useState("");
  let [linkPaypal, setLinkPaypal] = useState("");

  let [errorNombre, setErrorNombre] = useState(null);
  let [errorApellidos, setErrorApellidos] = useState(null);
  let [errorEmail, setErrorEmail] = useState(null);
  let [errorTelefono, setErrorTelefono] = useState(null);
  let [errorContrasenia1, setErrorContrasenia1] = useState(null);
  let [errorContrasenia2, setErrorContrasenia2] = useState(null);
  let [errorLinkPaypal, setErrorLinkPaypal] = useState(null);

  let [errorServidor, setErrorServidor] = useState(null);

  let [checking, setChecking] = useState(false);

  const emailEnUso = async email => {
    let result = true;
    const res = await fetch("http://localhost:8080/api/v1/usuarios/email/" + email);
    if (res.status === 200) {
      setErrorEmail("Dirección en uso por otro usuario. Elige otra.");
    } else if (res.status === 404) {
      result = false;
    } else {
      setErrorEmail(null);
      setErrorServidor("Error del servidor. Vuelve a intentarlo más tarde.");
    }
    return result;
  }

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

    if (contrasenia1.length > 0 && contrasenia2.length > 0) {
      if (contrasenia1 !== contrasenia2) {
        setErrorContrasenia1("Las contraseñas no coinciden.");
        setErrorContrasenia2("Las contraseñas no coinciden.");
        ok = false;
      } else {
        setErrorContrasenia1("");
        setErrorContrasenia2("");
      }
    } else {
      ok = false
      if (contrasenia1.length === 0) {
        setErrorContrasenia1("Este campo está vacío.");
      } else {
        setErrorContrasenia1("");
      }
      if (contrasenia2.length === 0) {
        setErrorContrasenia2("Este campo está vacío.");
      } else {
        setErrorContrasenia2("");
      }
    }
    
    if (linkPaypal.trim().length === 0) {
      setErrorLinkPaypal("El enlace de PayPal está vacío.");
      ok = false;
    } else {
      setErrorLinkPaypal("");
    }

    if (email.trim().length === 0) {
      setErrorEmail("El correo electrónico está vacío");
      ok = false;
    } else if (await emailEnUso(email)) {
      ok = false;
    } else {
      setErrorEmail("");
    }

    if (ok) {
      const datos = {
        "nombre": nombre,
        "apellidos": apellidos,
        "email": email,
        "telefono": telefono,
        "contrasenia": contrasenia1,
        "link_paypal": linkPaypal,
        "url_foto_perfil": "/defaultpfp.png",
        "rol": 1
      };
      fetch("http://localhost:8080/api/v1/usuarios", {
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
              <input type="email" className={clasesCampo(errorEmail)} id="campo-email" value={email}
              onChange={ev => setEmail(ev.target.value)} disabled={checking} />
              {infoCampo(errorEmail)}
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="campo-telefono" className="form-label">Teléfono</label>
              <input type="tel" className={clasesCampo(errorTelefono)} id="campo-telefono" value={telefono}
              onChange={ev => setTelefono(ev.target.value)} disabled={checking} />
              {infoCampo(errorTelefono)}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="campo-contrasenia-1" className="form-label">Contraseña</label>
            <input type="password" className={clasesCampo(errorContrasenia1)} id="campo-contrasenia-1" value={contrasenia1}
            onChange={ev => setContrasenia1(ev.target.value)} disabled={checking} />
            {infoCampo(errorContrasenia1)}
          </div>
          <div className="mb-3">
            <label htmlFor="campo-contrasenia-2" className="form-label">Confirma tu contraseña</label>
            <input type="password" className={clasesCampo(errorContrasenia2)} id="campo-contrasenia-2" value={contrasenia2}
            onChange={ev => setContrasenia2(ev.target.value)} disabled={checking} />
            {infoCampo(errorContrasenia2)}
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