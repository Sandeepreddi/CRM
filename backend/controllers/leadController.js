const Lead = require('../models/Lead');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all leads with optional filtering
exports.getLeads = async (req, res) => {
  try {
    const { status, tags, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a note to a lead
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type, followUp } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const newNote = {
      content,
      type,
      date: new Date(),
      followUp: followUp ? new Date(followUp) : undefined
    };

    lead.notes = lead.notes || [];
    lead.notes.push(newNote);
    await lead.save();

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting lead' });
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { to, subject, text } = req.body;

    console.log('Attempting to send email with config:', {
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL,
      to,
      subject
    });

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is missing');
      throw new Error('SendGrid API key is not configured');
    }

    // Check if sender email is configured
    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.error('Sender email is missing');
      throw new Error('Sender email is not configured');
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      console.error('Lead not found:', id);
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Create email message
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
    };

    console.log('Sending email with message:', msg);

    // Send email using SendGrid
    await sgMail.send(msg);

    // Save email to lead's email history
    const newEmail = {
      to,
      subject,
      text,
      sentAt: new Date()
    };

    lead.emails = lead.emails || [];
    lead.emails.push(newEmail);
    await lead.save();

    console.log('Email sent and saved successfully');
    res.status(201).json(newEmail);
  } catch (err) {
    console.error('Detailed error in sendEmail:', {
      message: err.message,
      code: err.code,
      response: err.response?.body,
      stack: err.stack
    });
    
    // Send more detailed error message
    res.status(500).json({ 
      error: 'Failed to send email',
      details: err.message,
      code: err.code,
      response: err.response?.body
    });
  }
};



