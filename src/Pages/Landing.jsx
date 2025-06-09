import { Link } from "react-router-dom";
import '../App.scss';
import './Landing.scss'

const Landing = () => {
    return (
        <div>
            <h1 className="name">Ampara</h1>
            <h2 className="tittle">Cuidar juntos es más fácil</h2>
            <h3 className="subtittle"> Una solución digital para organizar, coordinar y comunicar el cuidado de tus seres queridos de forma sencilla, clara y humana.</h3>
            <Link to="/login">
                <button>Iniciar Sesión</button>
            </Link>
            <div className="container-p">
            <p>Cuidar de una persona mayor o dependiente puede ser una tarea compleja, especialmente cuando se comparte entre varios familiares o cuidadores. CuidApp nace para ayudarte a coordinar todas esas tareas cotidianas que importan: desde administrar la medicación y planificar citas médicas, hasta registrar el estado de ánimo o comunicarte fácilmente con el resto del equipo de cuidado.
            </p>
            <p>Nuestra aplicación te permite centralizar toda la información y acciones necesarias en un solo lugar. Con una interfaz sencilla, accesible y diseñada pensando en usuarios reales, podrás gestionar las responsabilidades diarias con mayor claridad, reducir el estrés y asegurarte de que tu ser querido recibe la atención que merece.
            </p>
            <p>Empieza hoy a cuidar de forma más organizada, conectada y humana.</p>
            </div>
        </div>
    );
};

export default Landing;
