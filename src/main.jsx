import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Auth from './Auth.jsx'

createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/signin" element={<Auth type="signin"/>}/>
            <Route path="/signup" element={<Auth type="signup"/>}/>
        </Routes>
    </Router>
)
    