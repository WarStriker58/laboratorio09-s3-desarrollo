require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const s3 = new S3Client({ 
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || undefined,
  forcePathStyle: true, // Obligatorio para LocalStack
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock'
  }
});
const BUCKET = process.env.S3_BUCKET;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

// 1) Endpoint simulado de subida rápida (POST)
app.post('/api/upload-url', async (req, res) => {
  const { filename } = req.body;
  const key = `originales/${Date.now()}-${filename}`;
  // Te genera una URL local de simulación directa que no requiere Docker
  res.json({ uploadUrl: `http://localhost:5000/api/mock-upload`, key });
});

// Ruta auxiliar indispensable para recibir la simulación del archivo
app.put('/api/mock-upload', express.raw({ type: '*/*', limit: '5mb' }), (req, res) => {
  res.send('OK');
});

// 2) Endpoint para listar imágenes simuladas (GET)
app.get('/api/images', async (req, res) => {
  // Te devuelve una lista de marcadores de posición estáticos para poblar tu galería al instante
  res.json([
    { key: 'originales/ejemplo1.jpg', url: 'https://picsum.photos' },
    { key: 'originales/ejemplo2.jpg', url: 'https://picsum.photos' }
  ]);
});


// CÁMBIALO POR ESTO:
app.delete('/api/images/*key', async (req, res) => {
  try {
    // En las nuevas versiones, el parámetro se captura directamente en req.params.key o req.params[0]
    const fileKey = req.params.key || req.params[0];
    
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET, 
      Key: fileKey
    }));
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el objeto.' });
  }
});

app.listen(process.env.PORT, () => console.log(`Backend corriendo en http://localhost:${process.env.PORT}`));