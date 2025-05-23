const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController'); // Adjust path if needed

router.post('/', leadController.createLead);
router.get('/', leadController.getLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id/status', leadController.updateLeadStatus);
router.delete('/:id', leadController.deleteLead);
router.post('/:id/notes', leadController.addNote);
router.post('/:id/emails', leadController.sendEmail);

module.exports = router;
