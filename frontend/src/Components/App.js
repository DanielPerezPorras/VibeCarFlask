// import logo from './logo.svg';
import '../Styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' //ahora no es Switch ahora es Routes
import VibecarContext, { useForceUpdate } from './VibecarContext';
import Navbar from "./Navbar";
import Inicio from "../Pages/Inicio";
import Viajes from "../Pages/Viajes";
import Login from "../Pages/Login";
import Registro from "../Pages/Registro";
import UserListScreen from "../Pages/UserListScreen";
import { Mapa } from "../Pages/Mapa";

function App() {

  const forceUpdate = useForceUpdate();

  return (
    <VibecarContext.Provider value={VibecarContext.value}>
      <Navbar />
      <div className="container-lg p-4">
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/viajes' element={<Viajes />} />
          <Route path='/mapa' element={<Mapa/>} />
          { VibecarContext.value.usuarioActual
          && <Route path='/admin' element={<UserListScreen />} /> }
          { !VibecarContext.value.usuarioActual
          && <>
            <Route path='/login' element={<Login forceAppUpdate={forceUpdate} />} />
            <Route path='/registro' element={<Registro />} />
          </> }
        </Routes>
      </div>
    </VibecarContext.Provider>
  );

}

export default App;
