// import logo from './logo.svg';
import '../Styles/App.css';
import { Routes, Route } from 'react-router-dom' //ahora no es Switch ahora es Routes
import VibecarContext, { useForceUpdate } from './VibecarContext';
import Navbar from "./Navbar";
import Inicio from "../Pages/Inicio";
import Viajes from "../Pages/Viajes";
import CrearTrayecto from "../Pages/CrearTrayecto";
import Login from "../Pages/Login";
import Logout from "../Pages/Logout";
import Registro from "../Pages/Registro";
import UserListScreen from "../Pages/UserListScreen";
import { Mapa } from "../Pages/Mapa";
import { Profile } from '../Pages/Profile';

function App() {

  const forceUpdate = useForceUpdate();

  return (
    <VibecarContext.Provider value={VibecarContext.value}>
      <Navbar />
      <div className="container-lg p-4">
        <Routes>
          <Route path='/viajes' element={<Viajes />} />
          <Route path='/mapa' element={<Mapa/>} />
          { VibecarContext.value.usuarioActual
          && <>
            <Route path='/crearTrayecto' element={<CrearTrayecto  forceAppUpdate={forceUpdate} />} />
            <Route path='/admin' element={<UserListScreen />} />
            <Route path='/logout' element={<Logout forceAppUpdate={forceUpdate} />} />
            <Route path='/myprofile' element={<Profile usuarioActual={VibecarContext.value.usuarioActual} />} />
          </> }
          { !VibecarContext.value.usuarioActual
          && <>
            <Route path='/' element={<Inicio />} />
            <Route path='/login' element={<Login forceAppUpdate={forceUpdate} />} />
            <Route path='/registro' element={<Registro forceAppUpdate={forceUpdate} />} />
          </> }
        </Routes>
      </div>
    </VibecarContext.Provider>
  );

}

export default App;
