class UserList extends React.Component {

  state = {
    data: undefined
  }

  render() {
    let data = this.state.data;
    if (data !== undefined) {
      let elems = [];
      for (let i = 0; i < data.length; i++) {
        let u = data[i];
        elems.push(
          (
          <div className="list-group-item" key={u._id}>
            <img src={u.url_foto_perfil} alt="" width="64" height="64" style={{ float: "left", marginRight: "1em" }} />
            <strong>{u.nombre} {u.apellidos}</strong><br />
            {u.telefono}
          </div>
          )
        )
      }
      return (<div className="list-group">{elems}</div>)
    } else {
      return (<div className="alert alert-danger">No se han podido mostrar los usuarios</div>)
    }
  }

  componentDidMount() {
    fetchUserList().then((result) => {
      this.state.data = result;
      this.forceUpdate();
    })
  }
}

async function fetchUserList() {
  let response = await fetch("/api/v1/usuarios")
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    return null;
  }
}