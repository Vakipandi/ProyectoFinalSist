# Sistema de Gestión Administrativa para Consultas Estudiantiles - Mejoras Propuestas

## Contexto del Proyecto

Estoy desarrollando un Sistema de Gestión Administrativa para Consultas Estudiantiles de una facultad universitaria.

Actualmente el sistema cuenta con:

* Registro e inicio de sesión.
* Roles: Alumno, Secretaria y Administrador.
* Registro de consultas.
* Historial de cambios.
* Base de conocimientos (KMS).
* Reportes estadísticos.
* Priorización automática de consultas.
* Frontend en React.
* Backend en FastAPI.
* Base de datos PostgreSQL/Supabase.

El curso corresponde a **Sistemas de Información**, por lo que el enfoque principal debe centrarse en:

* Automatización de procesos administrativos.
* Gestión de información.
* Modelado de procesos.
* Optimización de flujos de atención.
* Centralización del conocimiento institucional.

No se requiere implementar soluciones avanzadas de inteligencia artificial ni agentes autónomos complejos.

---

# Objetivo

Mejorar el sistema actual para alinearlo con los problemas identificados durante las entrevistas realizadas al personal administrativo de la facultad.

---

# Funcionalidades a Implementar

## 1. Catálogo de Servicios Académicos

Crear un módulo independiente denominado **Catálogo de Servicios**.

Este módulo debe mostrar servicios frecuentes como:

* Acceso SAP
* Recuperación de correo institucional
* Aula virtual
* Constancia de estudios
* Retiro de curso
* Retiro de ciclo
* Carnet universitario
* Becas
* Matrícula
* Reubicación

Cada servicio debe contener:

* Nombre del servicio
* Descripción
* Requisitos
* Responsable
* Tiempo estimado de atención
* Procedimiento
* Categoría

Si la información mostrada resuelve la duda del estudiante, no será necesario generar una consulta.

---

## 2. Mejora de la Base de Conocimientos (KMS)

Organizar los artículos del KMS por categorías:

* Académico
* Sistemas
* Financiero
* Matrícula
* Trámites

Características:

* Búsqueda por palabras clave.
* Sugerencias automáticas mientras el alumno escribe.
* Asociación de artículos a categorías.
* Visualización de artículos relacionados.

Ejemplos:

* ¿Cómo recuperar mi acceso SAP?
* ¿Cómo ingresar al aula virtual?
* ¿Cómo solicitar una constancia de estudios?

---

## 3. Derivación Automática de Consultas

Agregar reglas de negocio para asignar automáticamente el área responsable.

Ejemplos:

| Consulta               | Área Responsable        |
| ---------------------- | ----------------------- |
| SAP                    | Sistemas                |
| Correo institucional   | Sistemas                |
| Aula virtual           | Sistemas                |
| Constancia de estudios | Registro Académico      |
| Retiro de curso        | Registro Académico      |
| Retiro de ciclo        | Registro Académico      |
| Becas                  | Bienestar Universitario |
| Pagos                  | Finanzas                |

La asignación debe realizarse automáticamente mediante categoría o palabras clave.

La secretaria no debe realizar la clasificación manual de la mayoría de consultas.

---

## 4. Seguimiento de Consultas

Implementar una línea de tiempo para visualizar el estado de cada consulta.

Estados permitidos:

* Registrado
* Derivado
* En revisión
* Resuelto

Descripción:

### Registrado

La consulta ha sido creada por el estudiante.

### Derivado

La consulta ha sido enviada automáticamente al área responsable.

### En revisión

El área responsable está evaluando o procesando la solicitud.

### Resuelto

La consulta fue atendida y cuenta con una respuesta final.

Registrar:

* Fecha
* Hora
* Responsable
* Comentario asociado al cambio

El estudiante debe visualizar todo el historial de seguimiento.

---

## 5. Dashboard Administrativo

Implementar indicadores para el personal administrativo.

Métricas:

* Total de consultas
* Consultas registradas
* Consultas derivadas
* Consultas en revisión
* Consultas resueltas
* Consultas por categoría
* Consultas por mes
* Tiempo promedio de resolución

Filtros:

* Fecha
* Categoría
* Estado

---

# Documentación del Sistema

## 6. Modelado AS-IS y TO-BE

### AS-IS (Proceso Actual)

Canales utilizados:

* WhatsApp
* Correo institucional
* Teléfono
* Excel compartido

Problemas detectados:

* Información dispersa.
* Consultas repetitivas.
* Seguimiento manual.
* Dependencia de personas.
* Respuestas inconsistentes.

### TO-BE (Proceso Propuesto)

Proceso digitalizado mediante:

* Portal web.
* Catálogo de servicios.
* Base de conocimientos (KMS).
* Derivación automática.
* Seguimiento digital.
* Reportes administrativos.

---

## 7. Diagramas BPMN

### BPMN: Atención de Consulta

Flujo:

Inicio
→ Consultar Catálogo de Servicios
→ Buscar en KMS
→ ¿La información resolvió la duda?
→ Sí → Fin
→ No → Crear Consulta
→ Derivación Automática
→ En Revisión
→ Respuesta del Área Responsable
→ Resuelto
→ Fin

### BPMN: Gestión Administrativa

Flujo:

Consulta recibida
→ Clasificación automática
→ Derivación al área correspondiente
→ Atención de la consulta
→ Actualización de estado
→ Resolución
→ Fin

---

## 8. Diagrama de Contexto

Actores externos:

* Alumno
* Secretaria
* Administrador
* Sistemas
* Registro Académico
* Finanzas
* Bienestar Universitario

Mostrar los flujos de información entre cada actor y el sistema.

---

## 9. Indicadores de Mejora

Beneficios esperados:

* Reducción de consultas repetitivas.
* Centralización de la información.
* Menor tiempo de respuesta.
* Mayor trazabilidad.
* Mejor seguimiento de solicitudes.
* Menor dependencia de canales informales.
* Mejor organización administrativa.

---

# Restricciones Técnicas

Mantener la arquitectura actual:

* Frontend: React + Vite
* Backend: FastAPI
* Base de Datos: PostgreSQL / Supabase

No implementar:

* Agentes autónomos.
* Sistemas multiagente.
* IA generativa compleja.
* Infraestructura adicional innecesaria.

Priorizar:

* Procesos de negocio.
* Gestión de información.
* Usabilidad.
* Modelado de procesos.
* Objetivos académicos del curso de Sistemas de Información.
