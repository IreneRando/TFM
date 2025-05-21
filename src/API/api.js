const BASE_URL = 'https://mock.apidog.com/m1/875221-856603-default';

//se obtienen TODOS los usuarios
export const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Error al cargar usuarios');
    return res.json();
}

//se obtiene UN usuario por su ID
export const fetchUserById = async () => {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Usuario no encontrado');
    return res.json();
}

//se obtienen todas las tareas
export const fetchTasks = async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) throw new Error('Error al cargar las tareas');
    return res.json();
}

//se obtienen todos los eventos
export const fetchEvents = async () => {
    const res = await fetch(`${BASE_URL}/events`);
    if (!res.ok) throw new Error('Error al cargar los eventos');
    return res.json();
}

//se obtienen todos los medicamentos
export const fetchMedications = async () => {
    const res = await fetch(`${BASE_URL}/medications`);
    if (!res.ok) throw new Error('Error al cargar los medicamentos');
    return res.json();
}

//se obtienen todos los mensajes
export const fetchMessages = async () => {
    const res = await fetch(`${BASE_URL}/messages`);
    if (!res.ok) throw new Error('Error al cargar los mensajes');
    return res.json();
}