-- Crear la tabla usuarios con todas las restricciones necesarias
CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('CLIENTE', 'REPARTIDOR', 'ADMIN')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url TEXT,
    provedor_auth VARCHAR(20) NOT NULL,
    ultima_actividad TIMESTAMPTZ,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by INT REFERENCES usuarios(usuario_id)
);

-- Crear índices necesarios para mejorar el rendimiento
CREATE INDEX idx_usuarios_clerk_id ON usuarios(clerk_user_id);

CREATE INDEX idx_usuarios_email ON usuarios(email);

CREATE INDEX idx_usuarios_proveedor ON usuarios(provedor_auth);

-- Habilitar Row Level Security (RLS) y configurar políticas de seguridad
ALTER TABLE
    usuarios ENABLE ROW LEVEL SECURITY;

-- Política para inserción desde Clerk (con clave de servicio)
CREATE POLICY "Permitir sync desde Clerk" ON usuarios FOR
INSERT
    WITH CHECK (true);

-- Política para actualización desde Clerk (con clave de servicio)
CREATE POLICY "Actualizar desde Clerk" ON usuarios FOR
UPDATE
    USING (true);

-- Política para lectura de datos propios
CREATE POLICY "Lectura perfil propio" ON usuarios FOR
SELECT
    USING (
        auth.jwt() ->> 'email' = email
        OR clerk_user_id = auth.jwt() ->> 'user_id'
    );

-- Política para actualización de perfil propio
CREATE POLICY "Actualización perfil propio" ON usuarios FOR
UPDATE
    USING (
        (
            email = auth.jwt() ->> 'email'
            OR clerk_user_id = auth.jwt() ->> 'user_id'
        )
        AND auth.jwt() ->> 'role' <> 'admin'
    ) WITH CHECK (
        clerk_user_id = auth.jwt() ->> 'user_id'
        AND email = auth.jwt() ->> 'email'
        AND rol = (
            SELECT
                rol
            FROM
                usuarios
            WHERE
                email = auth.jwt() ->> 'email'
            LIMIT
                1
        )
        AND provedor_auth = (
            SELECT
                provedor_auth
            FROM
                usuarios
            WHERE
                email = auth.jwt() ->> 'email'
            LIMIT
                1
        )
    );