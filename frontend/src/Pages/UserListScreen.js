import React from "react";

class UserList extends React.Component {

  state = {
    data: undefined,
    status: "loading"
  }

  render() {
    let data = this.state.data;
    switch (this.state.status) {

      case "loading":
        return (<div className="alert alert-info">Cargando usuarios...</div>);

      case "ok":
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
        return (<div className="list-group">{elems}</div>);

      default:
        return (<div className="alert alert-danger">No se pudieron cargar los usuarios</div>);

    }
  }

  componentDidMount() {
    fetchUserList().then(
      (value) => {
      this.setState({
        status: "ok",
        data: value
      })
      }, (error) => {
        this.setState({
          status: "error",
        })
      }
    )
  }

}

async function fetchUserList() {
  let response = await fetch("http://localhost:8080/api/v1/usuarios")
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    return null;
  }
}

function UserListScreen() {
  return (
    <>
      <h1>Lista de Usuarios</h1>
      <UserList />
    </>
  );
}

export default UserListScreen;