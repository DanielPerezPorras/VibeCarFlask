// import logo from './logo.svg';
import './styles/App.css';
import {BrowserRouter as Router, Routes , Route} from 'react-router-dom' //ahora no es Switch ahora es Routes
import { Navbar } from "./Components/Navbar";

function App() {
  return (
      <Router>
        <Navbar/>
        <div className="container p-2">
          <Routes>
            {/* <Route path='/about' element={<About/>} />
            <Route path='/' element={<Users/>} /> */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
