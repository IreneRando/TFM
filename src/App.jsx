import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import Calendar from './Pages/Calendar';
import Chat from './Pages/Chat';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Tasks from './Pages/Tasks';
import Traking from './Pages/Traking';
import Navbar from "./Components/Navbar";


function App() {
    return (
        <Navbar>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
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
        </Navbar>
    )
}

export default App;
