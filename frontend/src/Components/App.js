// import logo from './logo.svg';
import '../Styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' //ahora no es Switch ahora es Routes
import { useState } from 'react';
import Navbar from "./Navbar";
import Inicio from "../Pages/Inicio";
import Viajes from "../Pages/Viajes";
import Login from "../Pages/Login";
import Registro from "../Pages/Registro";
import UserListScreen from "../Pages/UserListScreen";
import { Mapa } from "../Pages/Mapa";

function App() {

  const [usuarioActual, setUsuarioActual] = useState(null);

  return (
    <>
      <Navbar />
      <div className="container-lg p-4">
        <Routes>
          <Route path='/' element={<Inicio />} user={usuarioActual} />
          <Route path='/viajes' element={<Viajes />} />
          <Route path='/admin' element={<UserListScreen />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/mapa' element={<Mapa/>} />
        </Routes>
      </div>
    </>
  );

}

export default App;
