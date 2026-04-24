# Checklist predespliegue (sin publicar)

Usar esta lista antes de cada release. Marcar cada punto.

## 1) Calidad de codigo
- [ ] npm run lint en estado OK.
- [ ] npm run build en estado OK.
- [ ] Backend: npm test y npm run test:e2e en estado OK.
- [ ] Sin errores en el panel Problems del workspace.
- [ ] Sin console errors criticos en navegacion base.

## 2) Funcionalidad critica por rol
- [ ] Flujo login y registro en /login funciona.
- [ ] Redireccion por rol funciona al iniciar sesion.
- [ ] Dashboard Cliente: crear solicitud, ver historial y detalle.
- [ ] Dashboard Tecnico: tomar ticket, actualizar estado y registrar nota.
- [ ] Dashboard Administrativo: asignar tecnico, cambiar prioridad y cerrar ticket.
- [ ] Dashboard Admin plataforma: usuarios, roles, catalogos y parametros.

## 3) Rutas y acceso
- [ ] Rutas publicas cargan correctamente.
- [ ] Rutas protegidas bloquean acceso sin sesion.
- [ ] Rutas de otro rol redirigen correctamente.
- [ ] Logout limpia sesion y localStorage asociado.

## 4) Persistencia y datos backend
- [ ] localStorage conserva solo la sesion autenticada esperada.
- [ ] Dashboard Cliente consulta y crea tickets contra backend.
- [ ] Dashboard Tecnico toma tickets y actualiza estado contra backend.
- [ ] Dashboard Administrativo asigna y cierra tickets contra backend.
- [ ] Dashboard Admin plataforma consulta usuarios, catalogos, parametros y auditoria reales.
- [ ] Prueba de recarga del navegador mantiene la sesion esperada y vuelve a consultar datos reales.
- [ ] Health check backend responde en /api/v1/health.
- [ ] Swagger backend responde en /api/docs.

## 5) UI y responsive
- [ ] Header, menu y card de acceso alineados en desktop.
- [ ] Layout de dashboards usable en mobile (<900px).
- [ ] Formularios con estados de error y exito visibles.
- [ ] Contraste y legibilidad adecuados en modo actual.

## 6) Seguridad basica frontend
- [ ] No exponer secretos reales en codigo.
- [ ] Sanitizar texto de entrada antes de integracion backend.
- [ ] Mantener validaciones de longitud y formato en formularios.
- [ ] Revisar que no existan rutas administrativas publicas.

## 7) Seguridad backend y dependencias
- [ ] JWT secret y credenciales SMTP definidos fuera de valores demo.
- [ ] Variables DB revisadas para entorno objetivo.
- [ ] `npm audit` revisado y documentado antes del release.
- [ ] Evaluar upgrade de TypeORM cuando exista parche compatible para la vulnerabilidad transitiva de `uuid`.

## 8) Artefactos y release
- [ ] dist/ generado localmente y verificado.
- [ ] Imagen Docker backend construida correctamente.
- [ ] docker compose up -d levanta backend, postgres y pgAdmin sin errores.
- [ ] Version/tag definida para release.
- [ ] Changelog o notas de cambios actualizado.
- [ ] Aprobacion funcional antes de desplegar.

## 9) Comandos de referencia
1. npm install
2. npm run lint
3. npm run build
4. npm test
5. npm run test:e2e
6. npm run preview
7. docker compose up -d

Nota: este checklist es previo al despliegue; no ejecuta publicacion por si mismo.
