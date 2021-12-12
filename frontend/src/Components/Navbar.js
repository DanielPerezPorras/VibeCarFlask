import '../Styles/Navbar.css'
import React from "react";
import { Link } from "react-router-dom";

class Navbar extends React.Component {

  constructor() {
    super();
    this.state = {
      expanded: false
    }
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const expanded = this.state.expanded;
    return (
      <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
        <div className="container-lg px-4">

          <Link className="navbar-brand" to="/">Vibecar</Link>
          
          <button className="navbar-toggler" type="button" aria-controls="main-nav" aria-expanded={expanded}
          aria-label="Toggle navigation" onClick={() => this.toggle()}>
            <span className="navbar-toggler-icon" />
          </button>

          <div className={(expanded ? "" : "collapse") + " navbar-collapse"} id="main-nav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/viajes">Próximos viajes</Link>
              </li>
            </ul>
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

}

export default Navbar;