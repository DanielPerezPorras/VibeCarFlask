import React from "react";
import VibecarContext from '../Components/VibecarContext';

function Inicio() {

  let nombre = "invitado";
  if (VibecarContext.value.usuarioActual) {
    nombre = VibecarContext.value.usuarioActual.nombre
  }

  return (
    <h1>Bienvenido a Vibecar, {nombre}</h1>
  );
}

export default Inicio;