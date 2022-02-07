// import logo from './logo.svg';
import '../Styles/App.css';
import { Routes, Route } from 'react-router-dom' //ahora no es Switch ahora es Routes
import VibecarContext, { useForceUpdate } from './VibecarContext';
import Navbar from "./Navbar";
import Viajes from "../Pages/Viajes";
import CrearTrayecto from "../Pages/CrearTrayecto";
import Login from "../Pages/Login";
import Logout from "../Pages/Logout";
import UserListScreen from "../Pages/UserListScreen";
import { API } from "../config";
import { Reservas } from "../Pages/Reservas";
import { Gasolineras } from "../Pages/Gasolineras";
import { Profile } from '../Pages/Profile';
import { Profiles } from '../Pages/Profiles';
import { Incidencias } from '../Pages/Incidencias';
import { ViajesCreados } from "../Pages/ViajesCreados";
import { InfoViaje } from '../Pages/InfoViaje';

function App() {

  const forceUpdate = useForceUpdate();

  return (
    <VibecarContext.Provider value={VibecarContext.value}>
      <Navbar />
      <div className="container-lg p-4">
        <Routes>
          <Route path='/viajes' element={<Viajes />} />
          <Route path='/gasolineras' element={<Gasolineras/>} />
          <Route path='/incidencias' element={<Incidencias/>} />
          <Route path='/profile/:id' element={<Profiles API={API} />} />
          { VibecarContext.value.usuarioActual
          && <>
            <Route path='/crearTrayecto' element={<CrearTrayecto  forceAppUpdate={forceUpdate} />} />
            <Route path='/reservas' element={<Reservas usuarioActual={VibecarContext.value.usuarioActual} API={API} />} /> 
            <Route path='/logout' element={<Logout forceAppUpdate={forceUpdate} />} />
            <Route path='/myprofile' element={<Profile usuarioActual={VibecarContext.value.usuarioActual} API={API} forceAppUpdate={forceUpdate}/>} />
            <Route path='/viajesCreados' element={<ViajesCreados usuarioActual={VibecarContext.value.usuarioActual} API={API} forceAppUpdate={forceUpdate}/>} />
            <Route path='/InfoViaje/:id' element={<InfoViaje usuarioActual={VibecarContext.value.usuarioActual} API={API} forceAppUpdate={forceUpdate}/>} />
          </> }
          { !VibecarContext.value.usuarioActual
          && <>
            <Route path='/' element={<Login forceAppUpdate={forceUpdate} />} />
          </> }
        </Routes>
      </div>
    </VibecarContext.Provider>
  );

}

export default App;
