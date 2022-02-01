import { useState } from "react";
import { Navigate } from "react-router-dom";
import GoogleLogin from "react-google-login";
import VibecarContext from '../Components/VibecarContext';
import { API } from "../config";
import { GoogleClientId } from "../secrets";
import Registro from "./Registro";

function Login(props) {

  const [ok, setOk] = useState("unlogged");
  const [error, setError] = useState(null);
  const [registerData, setRegisterData] = useState(null);

  function handleLogin(googleData) {
    fetch(API + "/api/v1/login", {
      "method": "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "token": googleData.tokenId
      })
    }).then(
      async (res) => {
        if (res.status === 200) {
          const datos = await res.json()
          VibecarContext.value.usuarioActual = datos;
          setOk("logged");
          props.forceAppUpdate();
        } else if (res.status === 404) {
          let lastName = ""
          if (googleData.profileObj.familyName) {
            lastName = googleData.profileObj.familyName;
          }
          setRegisterData({
            firstName: googleData.profileObj.givenName,
            lastName: lastName,
            email: googleData.profileObj.email
          })
          setOk("registering");
        } else if (res.status === 406) {
          setError("Token de autenticación no válido.");
        } else {
          setError("Error del servidor. Vuelve a intentarlo más tarde.");
        }
      }, (err) => {
        setError("Error del servidor. Vuelve a intentarlo más tarde.");
      }
    )
  }

  function handleFailure(result) {
    switch (result.error) {
      case "popup_closed_by_user":
        break;

      default:
        setError("No se pudo iniciar sesión. Vuelve a intentarlo más tarde.");
    }
    
  }

  switch (ok) {

    case "logged":
      return <Navigate to="/myprofile" />;

    case "registering":
      return <Registro forceAppUpdate={props.forceAppUpdate}
      initialFirstName={registerData.firstName} initialLastName={registerData.lastName}
      email={registerData.email} />;

    default:
      return (
        <div className="text-center">
          <h1>Tu viaje ideal al mejor precio</h1>
          <p>Únete a Vibecar para compartir coche con otras personas y viajar de forma económica y sostenible</p>
          <GoogleLogin clientId={GoogleClientId} buttonText="Iniciar sesión con Google"
          onSuccess={handleLogin} onFailure={handleFailure} cookiePolicy="single_host_origin" />
          { error &&
            <div className="alert alert-danger mt-2">{error}</div>
          }
        </div>
      );

  }
}

export default Login;