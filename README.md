# primarIA

## Tabla de contenidos
- [Objetivo](#Objetivo)
- [Integrantes](#Integrantes)
- [Tecnologías](#Tecnologías)
- [Rutas del Proyecto](#Rutas)


## Objetivo
Proyecto orientado a la integración de tecnologías de inteligencia artificial en los procesos de atención sanitaria primaria, con el objetivo de mejorar la eficiencia, la precisión diagnóstica y la toma de decisiones médicas.

## Integrantes
**DAW**
| Nombre | Rol |
|---------|-----|
| Alejandro Sierra Lagartera | Jefe de Equipo |
| Carlos Gómez Sánchez | Desarrollo Frontend |
| Laura Céspedes Berdonces | Desarrollo Frontend |
| Adrián González Chico | Desarrollo Frontend |


**DAM**
- Cheha Bahk Hwang
- Borja Logrosan Rodriguez
- Jose Gómez Nadal


## Tecnologías

| Tecnología | Descripción | Versión | Enlace |
|------------|-------------|---------|--------|
| ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) | **React.js**: Biblioteca de JavaScript para interfaces de usuario modulares y dinámicas. Permite crear dashboards interactivos para mostrar datos clínicos y predicciones de IA. | 18.x | [Documentación](https://reactjs.org/) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) | **Tailwind CSS**: Framework de CSS basado en utilidades para diseñar interfaces responsivas y modernas, optimizadas para entornos clínicos. | 3.x | [Documentación](https://tailwindcss.com/) |
| ![Java](https://img.shields.io/badge/Java-007396?logo=java&logoColor=white) | **Java**: Lenguaje de programación para el backend, utilizado para implementar lógica de negocio y procesar datos de IA. | 17.x | [Documentación](https://www.oracle.com/java/) |
| ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=spring-boot&logoColor=white) | **Spring Boot**: Framework de Java para desarrollar APIs REST robustas y escalables, conectando el frontend con la base de datos y los modelos de IA. | 3.x | [Documentación](https://spring.io/projects/spring-boot) |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) | **MySQL**: Base de datos relacional para almacenar datos clínicos, historias médicas y resultados de predicciones de IA. | 8.x | [Documentación](https://www.mysql.com/) |


### Detalles
- **Frontend**:
  - **React**: Permite crear componentes reutilizables para dashboards médicos, visualización de datos clínicos y resultados de IA en tiempo real.
  - **Tailwind CSS**: Garantiza un diseño responsivo y accesible, ideal para profesionales de la salud que usan la aplicación en dispositivos móviles o de escritorio.
- **Backend**:
  - **Java + Spring Boot**: Proporciona una arquitectura robusta para manejar APIs REST que integran el frontend con la base de datos y los modelos de IA, asegurando escalabilidad y seguridad.
  - **MySQL**: Almacena datos estructurados como historias clínicas, resultados de diagnósticos y configuraciones de usuarios.

### Por qué estas tecnologías
- **Escalabilidad**: React y Spring Boot permiten añadir nuevas funcionalidades, como módulos de IA o integraciones con sistemas de salud.
- **Rendimiento**: Spring Boot optimizan el backend, reduciendo tiempos de respuesta en entornos clínicos.
- **Fiabilidad**: MySQL garantiza un almacenamiento seguro y estructurado de datos sensibles, cumpliendo con los requisitos del sector salud.
- **Diseño centrado en el usuario**: Tailwind CSS asegura una experiencia visual consistente y profesional para médicos y administradores.

## Rutas
### Casos Clínicos

A continuación, se detallan los endpoints principales para la gestión de casos clínicos:

| Método | Ruta            | Descripción                                                                 | Respuesta Exitosa |
|--------|-----------------|-----------------------------------------------------------------------------|-------------------|
| ![GET](https://img.shields.io/badge/GET-28A745?logo=get&logoColor=white) | `/casos`        | Devuelve un caso clínico pendiente de valoración, listo para revisión médica. | `200 OK` con JSON del caso clínico. |
| ![POST](https://img.shields.io/badge/POST-0078D4?logo=post&logoColor=white) | `/casos/:id`    | Permite valorar un caso clínico enviando datos de diagnóstico o comentarios. | `201 Created` con confirmación. |
