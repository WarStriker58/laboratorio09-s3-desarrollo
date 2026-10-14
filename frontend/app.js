const API_URL = 'http://localhost:5000';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  // CORRECCIÓN:
  const file = fileInput.files[0]; 
  const statusTxt = document.getElementById('status');

  if (!file) return alert('Por favor, selecciona un archivo primero.');

  // Validación en el Frontend
  if (!ALLOWED_TYPES.includes(file.type)) {
    return alert('Formato no permitido. Solo se aceptan JPG, PNG y WEBP.');
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return alert('El archivo es demasiado grande. El límite máximo es de 5 MB.');
  }

  try {
    statusTxt.textContent = 'Obteniendo URL segura desde el backend...';

    // 1) Solicitar la URL prefirmada al backend local
    const res = await fetch(`${API_URL}/api/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size
      })
    });
    
    if (!res.ok) throw new Error('El backend rechazó los datos del archivo.');
    const { uploadUrl } = await res.json();

    statusTxt.textContent = 'Subiendo directamente a Amazon S3 sin intermediarios...';

    // 2) PUT directo del navegador a S3 usando la URL temporal
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

    if (!s3Response.ok) throw new Error('Error al transferir el archivo a S3.');

    statusTxt.textContent = '¡Imagen subida con éxito!';
    fileInput.value = ''; // Limpiar input
    loadGallery();
  } catch (error) {
    console.error(error);
    statusTxt.textContent = 'Error en el proceso de subida.';
  }
});

async function loadGallery() {
  const container = document.getElementById('galleryContainer');
  try {
    const res = await fetch(`${API_URL}/api/images`);
    const images = await res.ok ? await res.json() : [];
    
    container.innerHTML = images.map(img => `
      <div class="card">
        <img src="${img.url}" alt="Foto S3">
        <button class="btn-delete" onclick="deleteImage('${img.key}')">Eliminar</button>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p>Error al conectar con la galería.</p>';
  }
}

async function deleteImage(key) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta imagen de S3?')) return;
  try {
    await fetch(`${API_URL}/api/images/${encodeURIComponent(key)}`, { method: 'DELETE' });
    loadGallery();
  } catch (error) {
    alert('No se pudo eliminar la imagen.');
  }
}

// Cargar la galería automáticamente al abrir la página
loadGallery();