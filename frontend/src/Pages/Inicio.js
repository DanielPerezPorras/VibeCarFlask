import React from "react";
import { Link } from "react-router-dom";
import VibecarContext from '../Components/VibecarContext';

function Inicio() {

  let nombre = "invitado";
  if (VibecarContext.value.usuarioActual) {
    nombre = VibecarContext.value.usuarioActual.nombre
    return (
      <h1>Bienvenido a Vibecar, {nombre}</h1>
    );
  } else {
    return (
      <div className="text-center">
        <h1>Tu viaje ideal al mejor precio</h1>
        <p>Únete a Vibecar para compartir coche con otras personas y viajar de forma económica y sostenible</p>
        <Link to="/registro" className="btn btn-primary btn-lg">Regístrate</Link>

        <p style={{marginTop: "2.5rem"}}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        
      </div>
    );
  }
}

export default Inicio;