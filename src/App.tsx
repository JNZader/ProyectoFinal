import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="gry">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/home' element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}