import { useContext, useState } from "react";
import { useNavigate, useLocation, replace } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext"
import { fetchUsers } from "../API/api"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { Login } = useContext(AuthContext)
    const navigate = useNavigate
    const location = useLocation()
    const from = location.state?.from?.pathname || '/profile'


    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const users = await fetchUsers()
            const user = users.find(u => u.email === email && password === u.password)
            if (user) {
                Login(user)
                navigate(from, { replace: true })
            } else {
                setError('Credenciales incorrectas')
            }
        }
        catch (err) {
            setError('Error al obtener el usuario')
        }

    }
    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
export default Login