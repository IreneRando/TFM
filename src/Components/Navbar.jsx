import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <nav>
            <Link to="/">Inicio</Link>
            <Link to="/tasks">Tareas</Link>
            <Link to="/calendar">Calendario</Link>
            <Link to="/traking">Seguimiento Paciente</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/profile">Perfil</Link>
            {!user && <Link to="/login">Login</Link>}
            {user && (
                <span style={{ marginLeft: 'auto' }}>
                    {user.name}
                </span>
            )}
        </nav>
    )
}

export default Navbar