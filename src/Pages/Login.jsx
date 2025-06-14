import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/Context"
// import { fetchUsers } from "../API/api"
import { useEffect } from "react";
import './Login.scss';
import '../App.scss';
import useLogin from "../Hooks/useLogin"


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [error, setError] = useState('')
    const { login: authLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/home'
    const { login: hookLogin, loading, error } = useLogin();

    useEffect(() => {
        console.log("Componente Login montado");
    }, []);
    // const handleLogin = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const users = await fetchUsers()
    //         const user = users.find(u => u.email === email && password === u.password)
    //         if (user) {
    //             login(user)
    //             navigate(from, { replace: true })
    //         } else {
    //             setError('Credenciales incorrectas')
    //         }
    //     }
    //     catch (err) {
    //         setError('Error al obtener el usuario')
    //     }

    // }

 const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loggedUser = await hookLogin(email, password);
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit">Iniciar sesión</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
export default Login