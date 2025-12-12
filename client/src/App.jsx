import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Results from './pages/results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/results' element = {<Results />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;