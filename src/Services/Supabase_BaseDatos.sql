-- CREACIÓN DE TABLAS

-- USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    rol TEXT CHECK (rol IN ('cuidador', 'familiar')) NOT NULL
);

-- TAREAS
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    asignado_a INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    estado TEXT CHECK (estado IN ('pendiente', 'hecha', 'en proceso')) NOT NULL,
    fecha DATE NOT NULL
);

-- EVENTOS
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    descripcion TEXT,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- MEDICACION
CREATE TABLE medicacion (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    dosis TEXT NOT NULL,
    hora TIME NOT NULL,
    dias TEXT[] NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- SEGUIMIENTO EMOCIONAL
CREATE TABLE seguimiento (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    estado_animo TEXT NOT NULL,
    estado_fisico TEXT NOT NULL,
    notas TEXT,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- INSERTAR DATOS

-- Usuarios
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('María López', 'maria.lopez@example.com', 'pass1', 'cuidador'),
('Juan Pérez', 'juan.perez@example.com', 'pass2', 'familiar'),
('Ana Gómez', 'ana.gomez@example.com', 'pass3', 'cuidador'),
('Carlos Ruiz', 'carlos.ruiz@example.com', 'pass4', 'familiar'),
('Laura Fernández', 'laura.fernandez@example.com', 'pass5', 'cuidador'),
('Sofía Torres', 'sofia.torres@example.com', 'pass6', 'familiar'),
('Diego Martínez', 'diego.martinez@example.com', 'pass7', 'familiar'),
('Elena Castro', 'elena.castro@example.com', 'pass8', 'cuidador'),
('Ricardo Gómez', 'ricardo.gomez@example.com', 'pass9', 'familiar'),
('Lucía Romero', 'lucia.romero@example.com', 'pass10', 'cuidador');

-- Tareas
INSERT INTO tareas (titulo, asignado_a, estado, fecha) VALUES
('Dar desayuno', 1, 'pendiente', '2025-06-10'),
('Tomar medicación', 2, 'hecha', '2025-06-09'),
('Pasear al paciente', 3, 'en proceso', '2025-06-11'),
('Llevar a cita médica', 1, 'pendiente', '2025-06-12'),
('Supervisar ejercicios', 5, 'hecha', '2025-06-08'),
('Revisión nocturna', 3, 'pendiente', '2025-06-10'),
('Revisión de signos vitales', 8, 'pendiente', '2025-06-12'),
('Aplicar insulina', 10, 'hecha', '2025-06-10'),
('Preparar merienda', 5, 'en proceso', '2025-06-11'),
('Limpieza habitación', 3, 'pendiente', '2025-06-13'),
('Actualizar historial médico', 6, 'hecha', '2025-06-08'),
('Supervisar cena', 9, 'en proceso', '2025-06-12');

-- Eventos
INSERT INTO eventos (titulo, fecha, hora, descripcion, usuario_id) VALUES
('Cita médica', '2025-06-13', '09:00:00', 'Control mensual', 2),
('Reunión con psicólogo', '2025-06-15', '15:30:00', 'Seguimiento emocional', 4),
('Evaluación física', '2025-06-14', '11:00:00', 'Control de movilidad', 6),
('Terapia ocupacional', '2025-06-16', '10:00:00', 'Sesión grupal', 1),
('Control nutricional', '2025-06-17', '11:30:00', 'Cita con nutricionista', 3),
('Visita familiar', '2025-06-18', '16:00:00', 'Visita de hijos', 7),
('Sesión de relajación', '2025-06-19', '10:30:00', 'Técnicas de respiración', 10),
('Charla educativa', '2025-06-20', '14:00:00', 'Tema: manejo de emociones', 4);

-- Medicación
INSERT INTO medicacion (nombre, dosis, hora, dias, usuario_id) VALUES
('Paracetamol', '500mg', '08:00:00', ARRAY['lunes', 'miércoles', 'viernes'], 2),
('Ibuprofeno', '400mg', '12:00:00', ARRAY['martes', 'jueves'], 1),
('Amoxicilina', '250mg', '09:30:00', ARRAY['lunes', 'martes', 'miércoles'], 4),
('Omeprazol', '20mg', '07:00:00', ARRAY['todos'], 5),
('Metformina', '850mg', '20:00:00', ARRAY['lunes', 'jueves', 'sábado'], 6),
('Enalapril', '10mg', '06:30:00', ARRAY['lunes', 'martes', 'jueves'], 7),
('Levotiroxina', '100mcg', '08:00:00', ARRAY['todos'], 8),
('Clonazepam', '0.5mg', '21:00:00', ARRAY['lunes', 'miércoles', 'viernes'], 9),
('Aspirina', '100mg', '13:00:00', ARRAY['domingo'], 10);

-- Seguimiento emocional
INSERT INTO "public"."seguimiento" ("id", "fecha", "estado_animico", "estado_fisico", "horas_sueno", "presion_arterial", "peso", "usuario_id") VALUES ('1', '2025-06-11', 'feliz', 'sin molestias', '9', '120/80', '70.50', '2'), ('2', '2025-06-11', 'triste', 'dolor de cabeza', '6', '130/90', '68.00', '3'), ('3', '2025-06-11', 'neutral', 'ligeramente cansado', '7', '125/85', '75.20', '4'), ('4', '2025-06-11', 'enojado', 'dolor muscular', '5', '140/95', '80.00', '5');
