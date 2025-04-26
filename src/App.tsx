import { Routes, Route } from 'react-router-dom';
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<h1 className="text-3xl font-bold text-center pt-10">Bienvenido</h1>} />
      </Routes>
    </div>
  );
}