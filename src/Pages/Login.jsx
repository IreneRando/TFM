import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/Context"
import { useEffect } from "react";
import './Login.scss';
import '../App.scss';
import useLogin from "../Hooks/useLogin"

const Login = () => {
    const [correo, setEmail] = useState('')
    const [contrasena, setPassword] = useState('')
    const { login: authLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const { login: hookLogin, loading, error } = useLogin();

    useEffect(() => {
        console.log("Componente Login montado");
    }, []);


 const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loggedUser = await hookLogin(correo, contrasena);
            authLogin(loggedUser);
            navigate('/home', { replace: true });
        } catch (err) {
            console.error("Error de login:", err);
        }
    };

    return (
        <div className="container-form">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit">Iniciar sesión</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
export default Login