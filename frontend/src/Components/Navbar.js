import '../Styles/Navbar.css'
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar(props) {

  const [expanded, setExpanded] = useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  let derecha = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Entrar</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/registro">Regístrate</Link>
      </li>
    </>
  )
  /*
  if (context.usuario) {
    derecha = (
      <>
        <li className="nav-item">
        <Link className="nav-link" to="/admin">Lista usuarios</Link>
        </li>
        </>
        )
      }
      */

  return (
    <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
      <div className="container-lg px-4">

        <Link className="navbar-brand" to="/">Vibecar</Link>
        
        <button className="navbar-toggler" type="button" aria-controls="main-nav" aria-expanded={expanded}
        aria-label="Toggle navigation" onClick={() => toggle()}>
          <span className="navbar-toggler-icon" />
        </button>

        <div className={(expanded ? "" : "collapse") + " navbar-collapse"} id="main-nav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/viajes">Próximos viajes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mapa">Gasolineras Baratas</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {derecha}
          </ul>
        </div>

      </div>
    </nav>
  )


}

export default Navbar;