// routes/pdf.routes.js
import express from 'express';
import { generateQRPdf } from '../controllers/downloader.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Endpoint para descargar el PDF con los códigos QR generados.
// Se asume que el controlador "downloadQRPdf" genera el PDF en memoria o lo guarda en disco y lo envía en la respuesta.
router.get('/qr', authMiddleware, generateQRPdf);

export default router;
