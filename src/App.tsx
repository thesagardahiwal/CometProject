import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './screens/Login'
import Home from './screens/Home'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App