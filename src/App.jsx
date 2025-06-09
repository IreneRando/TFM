import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import Calendar from './Pages/Calendar';
import Chat from './Pages/Chat';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Tasks from './Pages/Tasks';
import Traking from './Pages/Traking';
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./Context/Context";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<h1>Inicio</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/traking" element={<Traking />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;


