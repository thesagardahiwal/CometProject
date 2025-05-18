import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './screens/Login'
import Home from './screens/Home'
import Credentials from './screens/Credentials'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/credentials' element={<Credentials />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App