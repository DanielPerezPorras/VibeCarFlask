import { useState } from "react";


function Login() {

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("")

  const validarLogin = function() {

    fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      body: {
        "email": email,
        "contrasenia": contrasenia
      }
    }).then(
      (res) => {
        if (res.status === 200) {

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

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <h1>Entrar en Vibecar</h1>
        <div className="mb-3">
          <label htmlFor="campo-email" className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" id="campo-email" value={email}
          onChange={(ev) => setEmail(ev.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="campo-contrasenia" className="form-label">Contraseña</label>
          <input type="password" className="form-control" id="campo-contrasenia" value={contrasenia}
          onChange={(ev) => setContrasenia(ev.target.value)} />
        </div>
        { error !== "" &&
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        }
        <button className="btn btn-primary" onClick={validarLogin}>Iniciar sesión</button>
      </div>
    </div>
  );

}

export default Login;