const Content = function() {
  return (
    <div className="container-lg">
      <div id="main" role="main">
    
        <h1 className="mb-3">Error 404</h1>
        <p>No hemos encontrado lo que buscabas.</p>

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