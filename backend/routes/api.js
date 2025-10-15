const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Load beneficiaries data
const beneficiariesPath = path.join(__dirname, '../data/beneficiaries.json');

// Get all beneficiaries
router.get('/beneficiaries', async (req, res) => {
  try {
    const data = await fs.readFile(beneficiariesPath, 'utf8');
    const beneficiaries = JSON.parse(data);
    res.json(beneficiaries);
  } catch (error) {
    console.error('Error reading beneficiaries data:', error);
    res.status(500).json({ error: 'Failed to load beneficiaries data' });
  }
});

// Update beneficiary status
router.post('/update-status', async (req, res) => {
  try {
    const { id, status, remarks } = req.body;
    
    const data = await fs.readFile(beneficiariesPath, 'utf8');
    const beneficiaries = JSON.parse(data);
    
    const beneficiaryIndex = beneficiaries.findIndex(b => b.id === parseInt(id));
    
    if (beneficiaryIndex !== -1) {
      beneficiaries[beneficiaryIndex].status = status;
      beneficiaries[beneficiaryIndex].remarks = remarks;
      beneficiaries[beneficiaryIndex].updatedAt = new Date().toISOString();
      
      await fs.writeFile(beneficiariesPath, JSON.stringify(beneficiaries, null, 2));
      
      res.json({ 
        success: true, 
        message: `Status updated to ${status}`,
        beneficiary: beneficiaries[beneficiaryIndex]
      });
    } else {
      res.status(404).json({ error: 'Beneficiary not found' });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;