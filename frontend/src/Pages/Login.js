import { useState } from "react";
import { Navigate } from "react-router-dom";
import VibecarContext from '../Components/VibecarContext';

function Login(props) {

  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  const validarLogin = async ev => {
    ev.preventDefault();
    fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "email": email,
        "contrasenia": contrasenia
      })
    }).then(
      async (res) => {
        if (res.status === 200) {
          const datos = await res.json()
          VibecarContext.value.usuarioActual = datos;
          setOk(true);
          props.forceAppUpdate();
        } else if (res.status === 404) {
          setError("Usuario o contraseña incorrecto.");
        } else {
          setError("Error del servidor. Vuelve a intentarlo más tarde.");
        }
      }, (err) => {
        setError("Error del servidor. Vuelve a intentarlo más tarde.");
      }
    )
  }

  if (ok) {
    return <Navigate to="/" />
  } else {
    return (
      <div className="row">
        <form onSubmit={validarLogin} className="offset-3 col-6">
          <h1>Entrar en Vibecar</h1>
          <div className="mb-3">
            <label htmlFor="campo-email" className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" id="campo-email" value={email}
            onChange={ev => setEmail(ev.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="campo-contrasenia" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="campo-contrasenia" value={contrasenia}
            onChange={ev => setContrasenia(ev.target.value)} />
          </div>
          { error !== "" &&
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          }
          <input type="submit" className="btn btn-primary" value="Iniciar sesión" />
        </form>
      </div>
    );
  }
}

export default Login;