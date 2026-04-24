-- Inicializacion basica de esquema para proyectoIAbkacend
-- Se ejecuta solo en la primera creacion del volumen.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Esquema dedicado para la app
CREATE SCHEMA IF NOT EXISTS app;
