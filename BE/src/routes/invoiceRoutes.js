const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createInvoice,
    getInvoices,
    getInvoiceById
} = require('../controllers/invoiceController');

router.post('/', authMiddleware, createInvoice);
router.get('/', authMiddleware, getInvoices);
router.get('/:id', authMiddleware, getInvoiceById);

module.exports = router;