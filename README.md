# 📸 Galería de Imágenes en la Nube - Laboratorio 09 (S3)

Este proyecto corresponde al **Laboratorio 9: "Cloud Storage (S3)"** del curso *Desarrollo de Soluciones en la Nube*. Implementa una arquitectura desacoplada para la carga, listado y eliminación de imágenes utilizando el SDK de AWS, garantizando que las credenciales de acceso nunca se expongan al cliente mediante el uso de **URLs Prefirmadas (Presigned URLs)**.

---

## 🏗️ Arquitectura del Proyecto

El flujo de la aplicación web sigue las mejores prácticas de seguridad recomendadas por AWS:
1. El **Frontend** realiza validaciones locales (tipo de archivo y peso máximo de 5 MB).
2. El **Frontend** solicita una URL prefirmada al **Backend** enviando solo los metadatos.
3. El **Backend** re-valida los datos y genera una firma segura de corta duración (TTL).
4. El **Frontend** realiza una petición `PUT` transfiriendo el archivo binario directamente al almacenamiento, liberando de carga de red al servidor central.

---

## 🛠️ Stack Tecnológico
* **Backend:** Node.js, Express.js, CORS, Dotenv.
* **AWS SDK v3:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`.
* **Frontend:** HTML5, CSS3, JavaScript Vanilla (Fetch API).

---

## 🚀 Entorno de Desarrollo Local (Modo Mock / Offline)

Para facilitar la evaluación, pruebas de caja negra y desarrollo ágil sin depender de conectividad externa o aprovisionamiento activo en la nube, el servidor cuenta con un **mecanismo de simulación integrado (Mocking)**. 

Este modo emula con precisión milimétrica las respuestas HTTP, las restricciones de CORS y los payloads de los endpoints de AWS S3, permitiendo comprobar de forma inmediata:
* El correcto funcionamiento de las directivas de seguridad.
* El flujo de peticiones asíncronas entre cliente-servidor.
* El renderizado dinámico de la galería web y el funcionamiento del botón de eliminación.

---

## 📦 Instrucciones de Ejecución

### 1. Clonar el repositorio y preparar el Backend
```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` dentro de la carpeta `backend` con la estructura base (el archivo original se encuentra protegido por políticas de `.gitignore`):
```env
PORT=5000
AWS_REGION=us-east-1
S3_BUCKET=lab-imagenes-local
AWS_ACCESS_KEY_ID=mock_key_id
AWS_SECRET_ACCESS_KEY=mock_secret_key
```

### 3. Iniciar el Servidor
```bash
node server.js
```

### 4. Lanzar la Aplicación
Abre el archivo `frontend/index.html` directamente en tu navegador web preferido para interactuar con la interfaz de usuario.
