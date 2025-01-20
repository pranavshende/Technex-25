// ContractFormController.js
const { jsPDF } = require('jspdf');

exports.generateAgreementPDF = async (req, res) => {
    const {
        farmerName,
        farmerAddress,
        farmerAadhar,
        farmerBankAccount,
        buyerName,
        buyerAddress,
        startDate,
        endDate,
        cropType,
        expectedYield,
        pricingDetails,
        signature,
    } = req.body;

    try {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Agreement for Contract Farming Between Farmer and Buyer', 20, 20);

        // Party Details
        doc.setFontSize(14);
        doc.text('1. Parties to the Agreement', 20, 40);
        doc.setFontSize(12);
        doc.text(`Farmer's Name: ${farmerName || 'N/A'}`, 20, 50);
        doc.text(`Farmer's Address: ${farmerAddress || 'N/A'}`, 20, 60);
        doc.text(`Farmer's Aadhar/ID Number: ${farmerAadhar || 'N/A'}`, 20, 70);
        doc.text(`Farmer's Bank Account: ${farmerBankAccount || 'N/A'}`, 20, 80);
        doc.text(`Buyer's Name: ${buyerName || 'N/A'}`, 20, 90);
        doc.text(`Buyer's Address: ${buyerAddress || 'N/A'}`, 20, 100);

        // Agreement Period
        doc.setFontSize(14);
        doc.text('2. Agreement Period', 20, 120);
        doc.setFontSize(12);
        doc.text(`Start Date: ${startDate || 'N/A'}`, 20, 130);
        doc.text(`End Date: ${endDate || 'N/A'}`, 20, 140);

        // Crop Details
        doc.setFontSize(14);
        doc.text('3. Crop Details', 20, 160);
        doc.setFontSize(12);
        doc.text(`Crop Type: ${cropType || 'N/A'}`, 20, 170);
        doc.text(`Expected Yield: ${expectedYield || 'N/A'}`, 20, 180);

        // Pricing and Payment Terms
        doc.setFontSize(14);
        doc.text('4. Pricing and Payment Terms', 20, 200);
        doc.setFontSize(12);
        doc.text(`Pricing Details: ${pricingDetails || 'N/A'}`, 20, 210);

        // Add Signature if exists
        if (signature) {
            const signatureData = signature.split(',')[1];
            doc.addImage(signatureData, 'PNG', 20, 220, 100, 50);
        }

        // Send PDF as response
        const pdfBytes = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="contract_farming_agreement.pdf"');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
};
