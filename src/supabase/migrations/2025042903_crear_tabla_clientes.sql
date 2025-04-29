-- Crear la tabla clientes
CREATE TABLE clientes (
  cliente_id SERIAL PRIMARY KEY,
  usuario_id INTEGER UNIQUE NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  fecha_nacimiento DATE,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acepta_email BOOLEAN DEFAULT TRUE,
  acepta_sms BOOLEAN DEFAULT TRUE,
  preferencias_comunicacion TEXT,
  puntos_acumulados DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_clientes_usuario_id ON clientes(usuario_id);

-- Habilitar Row-Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Permitir lectura de datos propios
CREATE POLICY "Lectura perfil propio clientes" 
ON clientes FOR SELECT 
USING (
  auth.jwt() ->> 'email' = (SELECT email FROM usuarios WHERE usuario_id = clientes.usuario_id)
  OR auth.jwt() ->> 'user_id' = (SELECT clerk_user_id FROM usuarios WHERE usuario_id = clientes.usuario_id)
);

-- Permitir actualización de datos propios
CREATE POLICY "Actualización perfil propio clientes" 
ON clientes FOR UPDATE 
USING (
  auth.jwt() ->> 'email' = (SELECT email FROM usuarios WHERE usuario_id = clientes.usuario_id)
  OR auth.jwt() ->> 'user_id' = (SELECT clerk_user_id FROM usuarios WHERE usuario_id = clientes.usuario_id)
);

-- Permitir inserción desde Clerk (con clave de servicio)
CREATE POLICY "Permitir sync desde Clerk clientes" 
ON clientes FOR INSERT 
WITH CHECK (true);

-- Permitir actualización desde Clerk (con clave de servicio)
CREATE POLICY "Actualizar desde Clerk clientes" 
ON clientes FOR UPDATE 
USING (true);