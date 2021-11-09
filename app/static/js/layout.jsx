class Navbar extends React.Component {
  render() {
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

        <div className="container-lg">

          <a className="navbar-brand" href="/">VibeCar</a>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="main-nav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/login">Iniciar sesión</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/registro">Registro</a>
              </li>
            </ul>
          </div>

        </div>
      </nav>
    );
  }
}

