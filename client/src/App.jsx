import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Jobs from './pages/jobs';
import Results from './pages/results';
import Jobs from './pages/jobs';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/results' element = {<Results />} />
        <Route path = '/jobs' element= {<Jobs />} />
        <Route path = '/jobs' element = {<Jobs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;