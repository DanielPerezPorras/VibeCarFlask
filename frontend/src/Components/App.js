// import logo from './logo.svg';
import '../Styles/App.css';
import { useState } from "react";
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom' //ahora no es Switch ahora es Routes
import Navbar from "./Navbar";
import Inicio from "../Pages/Inicio";
import Viajes from "../Pages/Viajes";
import Login from "../Pages/Login";
import Registro from "../Pages/Registro";
import UserListScreen from "../Pages/UserListScreen";

function App() {

  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Navbar />
      <div className="container-lg p-4">
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/viajes' element={<Viajes />} />
          <Route path='/admin' element={<UserListScreen />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registro' element={<Registro />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
