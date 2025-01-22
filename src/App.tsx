import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ConcursoDetails } from './pages/ConcursoDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concurso/:id" element={<ConcursoDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;