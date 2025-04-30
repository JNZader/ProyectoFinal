import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './hooks/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Registro';
import Home from './pages/Home';
import Clientes from './pages/admin/Clientes';
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/admin/clientes" element={<Clientes />} />
      </Route>
    </Routes>
  );
}
