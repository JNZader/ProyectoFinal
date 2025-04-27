import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

export default function App() {
  return (
    <div className="gry">
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<h1 className="text-3xl font-bold text-center pt-10">Bienvenido</h1>} />
      </Routes>
    </div>
  );
}