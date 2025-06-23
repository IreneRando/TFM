import { fetchUserById, updateUser } from "../Services/supabaseService";
import { useEffect, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './Profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showFormUser, setShowFormUser] = useState(false);
  const [editUserData, setEditUserData] = useState({ nombre: '', correo: '', rol: '' });

  useEffect(() => {
    const loadUser = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const usuario = await fetchUserById(user.id);
        setUser(usuario);
      } catch (error) {
        console.error("Error al cargar usuario:", error.message);
      }
    };
    loadUser();
  }, [setUser]);

  const handleEditClick = () => {
    setEditUserData({
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    });
    setShowFormUser(true);
  };

  const handleChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(user.id, editUserData);
    setUser({ ...user, ...editUserData });
    setShowFormUser(false);
  };

  return (
    <div className="body p-4">
      <h2 className="text-xl font-semibold mb-2">Perfil de Usuario</h2>
      <div className="container-profile">
      <div className="container-user">
        <div className="flex mb-4">
          <FontAwesomeIcon icon={faCircleUser} className="iconUser" />
        </div>
        <h4>{user ? user.nombre : "Cargando..."}</h4>
        <p>
          <strong>Correo:</strong> {user ? user.correo : "Cargando..."}
        </p>
        <p>
          <strong>Rol:</strong> {user ? user.rol : "Cargando..."}
        </p>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={handleEditClick}>
          Editar Perfil
        </button>
        {showFormUser && (
          <form onSubmit={handleSubmit} className="edit-user-form">
            <input
              type="text"
              name="nombre"
              value={editUserData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              type="email"
              name="correo"
              value={editUserData.correo}
              onChange={handleChange}
              placeholder="Correo"
              required
            />
            <input
              type="text"
              name="rol"
              value={editUserData.rol}
              onChange={handleChange}
              placeholder="Rol"
              required
            />
            <div className="container-buttons">
              <button type="button" className="button2" onClick={() => setShowFormUser(false)}>Cancelar</button>
              <button type="submit" className="button2">Guardar</button>
            </div>
          </form>
        )}
      </div>
      <div className="container-info">
        <div className="info-item">
          <button
      className="button3"
      onClick={() => {
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirige al login
      }}
    >
      Cerrar sesión
    </button>
  </div>
  <div className="info-item">
    <a href="/privacidad" className="link-info">Política de Privacidad</a>
    <span> > </span>
  </div>
  <div className="info-item">
    <a href="/ayuda" className="link-info">Ayuda</a>
    <span> > </span>
  </div>
  <div className="info-item">
    <a href="/info" className="link-info">Información de la aplicación </a>
    <span> > </span>
 
        </div>
      </div>
    </div>
</div>

  )
};


export default Profile