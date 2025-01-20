const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { generateAgreementPDF } = require('./config/controllers/ContractFormController'); // Correct path

const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve the static HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission and generate the PDF
app.post('/submit', async (req, res) => {
    try {
        // Call the generateAgreementPDF function from the controller
        await generateAgreementPDF(req, res);
    } catch (error) {
        console.error('Error in form submission:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
