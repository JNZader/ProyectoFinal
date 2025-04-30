CREATE TABLE clientes_direcciones (
  cliente_direccion_id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(cliente_id) ON DELETE CASCADE,
  direccion_id INTEGER REFERENCES direcciones(direccion_id) ON DELETE CASCADE,
  principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_clientes_direcciones_cliente_id ON clientes_direcciones(cliente_id);

CREATE INDEX idx_clientes_direcciones_direccion_id ON clientes_direcciones(direccion_id);