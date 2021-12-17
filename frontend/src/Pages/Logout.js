import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import VibecarContext from '../Components/VibecarContext';

function Logout(props) {
  useEffect(() => {
    props.forceAppUpdate();
  })

  VibecarContext.value.usuarioActual = null;
  return <Navigate to="/" />
}

export default Logout;