const Invoice = require('../models/Invoice');

const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);

    res.status(201).json({
      status: true,
      message: 'Invoice saved successfully',
      data: invoice
    });

  } catch (error) {
    console.error('Create invoice error:', error);

    res.status(500).json({
      status: false,
      message: 'Failed to save invoice',
      error: error.message
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: invoices
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        status: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      status: true,
      data: invoice
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById
};