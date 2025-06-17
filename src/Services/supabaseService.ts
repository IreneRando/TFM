import  supabase from './supabase'

//Comprobar si el usuario existe para dar acceso a la web
export const loginUser = async (correo:string, contrasena: string) => {
  const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .eq('correo', correo)
  .eq('contrasena', contrasena)
  .single()

  if (error) throw new Error('Credenciales incorrectas')
  console.log(data, error);
  return data
}

//Obtener TODAS tareas
export const fetchTask = async (userId) => {
  const {data, error} =await supabase
  .from('tareas')
  .select('*')
  .eq('asignado_a', userId)
  .order('fecha', {ascending:true})

  if(error) throw new Error ('Error al obtener tareas')
    return data
}

//Crear una tarea
export const createTask = async (task) => {
  const {data, error} = await supabase
  .from('tareas')
  .insert([task])
  .select()
  .single()

  if(error) throw new Error ('Error al crear tarea')
    return data
}

//Editar una tarea
export const updateTask = async (id, newData) => {
  const {data, error} = await supabase
  .from('tareas')
  .update(newData)
  .eq('id', id)
  .select()
  .single()

  if(error) throw new Error ('Error al crear tarea')
    return data
}

//Eliminar una tarea
export const deleteTaskById = async (id) => {
  const {error} = await supabase
  .from('tareas')
  .delete()
  .eq('id', id)

  if(error) throw new Error ('Error al eliminar tarea')
}

//Obtener medicaciones
export const fetchMedications = async (userId) => {
  const {data, error} = await supabase
  .from('medicacion')
  .select('*')
  .eq('usuario_id', userId)

  if(error) throw new Error ('Error al obtener medicaciones')
    return data
}

//Crear una medicación
export const createMedication = async (medication) => { 
  const {data, error} = await supabase
  .from('medicacion')
  .insert([medication])
  .select()
  .single()

  if(error) throw new Error ('Error al crear medicación')
    return data
}

//Editar una medicación
export const updateMedication = async (id, newData) => {    
  const {data, error} = await supabase
  .from('medicacion')
  .update(newData)
  .eq('id', id)
  .select()
  .single()

  if(error) throw new Error ('Error al editar medicación')
    return data
}

//Eliminar una medicación
export const deleteMedicationById = async (id) => {
  const {error} = await supabase
  .from('medicacion')
  .delete()
  .eq('id', id)

  if(error) throw new Error ('Error al eliminar medicación')
}