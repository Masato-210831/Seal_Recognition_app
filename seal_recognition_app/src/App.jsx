import React from 'react'
import './App.css'
import { Routes, Route} from 'react-router-dom'
import Home from './components/pages/Home'
import NotFound from './components/pages/NotFound'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/notfound' element={<NotFound/>}></Route>
      </Routes>
    </div>
  )
}

export default App