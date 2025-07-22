import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
// import Calendar from './Pages/Calendar';
// import Chat from './Pages/Chat';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Tasks from './Pages/Tasks';
import Traking from './Pages/Traking';
import Landing from './Pages/Landing';
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthContext, AuthProvider } from "./Context/Context";
import { useContext } from "react";
import { TaskProvider } from './Context/TaskContext';

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  );
};

function App() {
    return (
        <AuthProvider>
          <TaskProvider>
      <BrowserRouter>
        <Routes>

          {/* Sin Navbar */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Con Navbar y sesión iniciada */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Layout><Home /></Layout>
            </ProtectedRoute>
          } />
          {/* <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout><Calendar /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout><Chat /></Layout>
            </ProtectedRoute>
          } /> */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Layout><Tasks /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/traking" element={
            <ProtectedRoute>
              <Layout><Traking /></Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
    )
}

export default App;


