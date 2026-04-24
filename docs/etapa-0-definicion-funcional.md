# Etapa 0 - Definicion funcional y reglas base

## 1) Objetivo del sistema
Construir una plataforma web para centralizar la gestion de servicios de tecnologia, donde clientes y equipos internos puedan registrar, atender, supervisar y administrar solicitudes de soporte y proyectos tecnicos.

## 2) Alcance funcional inicial (MVP)
La plataforma cubrira los siguientes servicios:

1. Soporte TI general (incidencias de software, hardware y usuario final).
2. Manejo de servidores (instalacion, configuracion, monitoreo y mantenimiento).
3. Soporte a desarrollo (apoyo tecnico en despliegues, entornos y ajustes operativos).
4. Instalacion y soporte de redes (LAN, Wi-Fi, cableado, diagnostico).
5. Instalacion y soporte de camaras (CCTV, configuracion, mantenimiento basico).

## 3) Roles del sistema
1. Cliente.
2. Personal tecnico.
3. Personal administrativo.
4. Administrador de la plataforma.

## 4) Matriz de permisos inicial
| Modulo / Accion | Cliente | Personal tecnico | Personal administrativo | Administrador plataforma |
|---|---|---|---|---|
| Ver sitio publico (Home, Servicios, Quienes somos, Contactanos) | Si | Si | Si | Si |
| Registro de cliente | Si | No | No | No |
| Iniciar sesion | Si | Si | Si | Si |
| Crear solicitud/ticket | Si | Si (interno) | Si (interno) | Si |
| Ver solicitudes propias | Si | Si | Si | Si |
| Ver todas las solicitudes | No | Parcial (asignadas o disponibles) | Si | Si |
| Asignar tecnico a solicitud | No | No | Si | Si |
| Actualizar estado tecnico | No | Si | Si | Si |
| Cerrar solicitud | No | Si (si fue asignada) | Si | Si |
| Gestionar usuarios y roles | No | No | No | Si |
| Configurar catalogos (servicios, prioridades, estados) | No | No | Parcial | Si |
| Ver reportes operativos | Basico (propios) | Basico (rendimiento propio) | Si | Si |

## 5) Flujos principales por rol
### Cliente
1. Se registra o inicia sesion.
2. Crea solicitud seleccionando tipo de servicio.
3. Adjunta evidencia y describe el problema.
4. Consulta estado y mensajes hasta cierre.

### Personal tecnico
1. Accede a su dashboard tecnico.
2. Toma o recibe solicitudes asignadas.
3. Registra diagnostico, avances y solucion.
4. Cambia estados hasta resolucion/cierre tecnico.

### Personal administrativo
1. Monitorea bandeja global de solicitudes.
2. Prioriza y asigna tecnicos.
3. Da seguimiento a SLA y tiempos.
4. Escala casos y valida cierres operativos.

### Administrador de plataforma
1. Administra usuarios y roles.
2. Define catalogos y reglas del sistema.
3. Supervisa reportes globales y auditoria.
4. Mantiene parametros de seguridad y operacion.

## 6) Navegacion publica obligatoria
Menu principal del sitio publico:
1. Home
2. Servicios
3. Quienes somos
4. Contactanos
5. Registro de clientes

## 7) Dashboards personalizados obligatorios
1. Dashboard Cliente.
2. Dashboard Personal tecnico.
3. Dashboard Personal administrativo.
4. Dashboard Administrador de plataforma.

## 8) Criterios de aceptacion de Etapa 0
1. Existe acuerdo sobre alcance de servicios del MVP.
2. Existe acuerdo sobre permisos por rol.
3. Existe acuerdo sobre flujos principales por rol.
4. Existe acuerdo sobre menu publico obligatorio.
5. Existe acuerdo sobre dashboards por rol.

## 9) Supuestos iniciales
1. Esta etapa no define aun integracion backend final.
2. Se permitira usar datos mock en las primeras pantallas.
3. Las reglas aqui definidas podran ajustarse en la etapa de arquitectura.
