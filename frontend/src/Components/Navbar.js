import '../styles/Navbar.css'
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-lg px-4">

        <Link className="navbar-brand" to="/">Vibecar</Link>
        
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="main-nav">
          <ul className="navbar-nav ms-auto">
              
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Lista usuarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Entrar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/registro">Regístrate</Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar;