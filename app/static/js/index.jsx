const Content = function() {
  return (
    <div className="container-lg">
      <div id="main" role="main">
    
        <h1 className="mb-3">Bienvenido a VibeCar</h1>

      </div>
    </div>
  );
}

ReactDOM.render(
  <React.Fragment>
    <Navbar />
    <Content />
  </React.Fragment>,
  document.getElementById('root')
);