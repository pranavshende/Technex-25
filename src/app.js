// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passportConfig2'); 
const Contract = require('./models/contract')
const loginRoutes = require('./routes/loginRoutes'); 
const  Application = require('./models/application')
const path = require('path');
const bcrypt = require('bcrypt');
const {
    fetchUsers,
    authenticateUser,
    addToMongoDB,
    signupUser,
    addRegistrationToMongoDB,
    fetchRegistrationByEmail,
    addFarmersRegistrationToMongoDB,
    fetchFarmerRegistrationByEmail,
} = require('./services/loginSheetServices');
const { fetchUserRole, authorize } = require('./middlewares/loginMiddleware');

const app = express();
const mainContract = require('./models/mainContract');
// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
    session({
        secret: 'your-secure-secret-here',
        resave: false,
        saveUninitialized: false,
    })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Authenticate the user (implement `authenticateUser` to validate credentials)
        const user = await authenticateUser(email, password);

        if (user) {
            req.login(user, (err) => {
                if (err) {
                    console.error('Error logging in user:', err);
                    return res.status(500).json({ success: false, message: 'Server error during login' });
                }

                // Include the role in the response
                return res.json({
                    success: true,
                    message: `Welcome, ${user.name}! You have been authenticated.`,
                    role: user.role, // Return user's role
                });
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. Please try again.',
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
});


// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const signupResult = await signupUser(email);
        if (!signupResult.success) {
            return res.status(400).json({
                success: false,
                message: signupResult.message,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await addToMongoDB(name, email, hashedPassword, role);

        return res.json({
            success: true,
            message: `Signup successful! Welcome, ${name}! You have been successfully registered.`,
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ success: false, message: 'Server error during signup' });
    }
});

// Fetch registration data by email
app.get('/api/fetch-registration', async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const registration = await fetchRegistrationByEmail(email);
    

        if (!registration) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/fetchfarmer-registration', async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const registration = await fetchFarmerRegistrationByEmail(email);

        if (!registration) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



// Get logged-in user's email
app.get('/api/logged-in-email', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ email: req.user.email });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Handle Contract Farming Form Submission
app.post('/firmRegistration', async (req, res) => {
    const {
        firmName,
        firmType,
        registrationNumber,
        dateOfEstablishment,
        contactPerson,
        designation,
        contactEmail,
        contactPhone,
        coreBusiness,
        annualTurnover,
        certifications,
    } = req.body;

    try {
        await addRegistrationToMongoDB(
            firmName,
            firmType,
            registrationNumber,
            dateOfEstablishment,
            contactPerson,
            designation,
            contactEmail,
            contactPhone,
            coreBusiness,
            annualTurnover,
            certifications
        );

        return res.json({
            success: true,
            message: 'Contract farming application submitted successfully!',
        });
    } catch (error) {
        console.error('Error submitting contract farming application:', error);
        return res.status(500).json({ success: false, message: 'Server error while submitting the application' });
    }
});

app.post('/submit-farmer-registration', async (req, res) => {
    const {
        fullName,
        phoneNumber,
        email,
        residentialAddress,
        farmLocation,
        idProof,
        farmSize,
        soilType,
        irrigationFacilities,
        cropsGrown,
        yieldHistory,
        equipment,
        storageFacilities,
    } = req.body;

    try {
        await addFarmersRegistrationToMongoDB(
            fullName,
            phoneNumber,
            email,
            residentialAddress,
            farmLocation,
            idProof,
            farmSize,
            soilType,
            irrigationFacilities,
            cropsGrown,
            yieldHistory,
            equipment,
            storageFacilities
        );

        // Redirect to the login page after successful submission
        return res.redirect('/loginpage');
    } catch (error) {
        console.error('Error submitting farmer registration:', error);
        return res.status(500).json({ success: false, message: 'Server error while submitting the registration' });
    }
});


app.post('/create-contract', async (req, res) => {
    const { firmName,
        company_address,
        cropType,
        cropQuality,
        contract_type,
        start_date,
        end_date,
        price_per_unit,
        timePeriod,
        payment_schedule,
        amountOfCrop,
        amount,
        quality_standards,
        additionalInfo} = req.body;

    const newContract = new Contract({
        firmName,
        company_address,
        cropType,
        cropQuality,
        contract_type,
        start_date,
        end_date,
        price_per_unit,
        timePeriod,
        payment_schedule,
        amountOfCrop,
        amount,
        quality_standards,
        additionalInfo
    });

    try {
        const savedContract = await newContract.save();
        console.log('Contract created successfully:', savedContract);
        // Redirect to the profile page with a success message
        res.redirect('/companydashboard');
    } catch (err) {
        console.error('Error creating contract:', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the contract.',
            error: err.message
        });
    }
});


app.get('/api/contracts', async (req, res) => {
    try {
      const contracts = await Contract.find();
      res.json(contracts);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching contracts' });
    }
  });

  app.post('/apply', async (req, res) => {
    const { name, email, phone, fieldSize, cropType, additionalInfo } = req.body;
    const newApplication = new Application({
      name,
      email,
      fieldSize,
      cropType,
      additionalInfo,
      farmeraddress,
      farmerContact,
      farmerId,
    });
    try {
      await newApplication.save();
      console.log(`New application submitted: ${name} (${email})`);
      res.send('Application submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      res.status(400).send('Error submitting application: ' + err);
    }
  });
  
  app.get('/api/applications', async (req, res) => {
    try {
        const applications = await Application.find(); // Fetch all applications from DB
        console.log(applications); // Log to see what data is returned
        res.json(applications); // Send data as JSON
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send('Error fetching applications.');
    }
});
app.get('/data', async (req, res) => {
    try {
      const data = await mainContract.find(); // Fetch all documents from the collection
      res.json(data); // Send data as JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data' });
    }
  });
  

app.post('/applyContract', async (req, res) => {
    try {
        // Destructure the incoming request body
        const {
            date, month, year,
            farmerName, farmerAddress, farmerContact, farmerId,
            companyName, companyAddress, companyContact, companyId,
            crops, price, advance, advanceDate, finalPaymentDays,
            farmerSignName, farmerSignDate, companySignName, companySignDesignation, companySignDate
        } = req.body;

        // Validate required fields (simple validation as an example)
        if (
            !date || !month || !year ||
            !farmerName || !farmerAddress || !farmerContact || !farmerId ||
            !companyName || !companyAddress || !companyContact || !companyId ||
            !crops || !price || !advance || !advanceDate || !finalPaymentDays ||
            !farmerSignName || !farmerSignDate || !companySignName || !companySignDesignation || !companySignDate
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please ensure all fields are provided.'
            });
        }

        // Create a new contract instance
        const newContract = new mainContract({
            date,
            month,
            year,
            farmer: {
                name: farmerName,
                address: farmerAddress,
                contact: farmerContact,
                id: farmerId
            },
            company: {
                name: companyName,
                address: companyAddress,
                contact: companyContact,
                id: companyId
            },
            crops,
            price,
            payment: {
                advance,
                advanceDate,
                finalPaymentDays
            },
            signatures: {
                farmerName: farmerSignName,
                farmerSignDate,
                companyName: companySignName,
                companySignDesignation,
                companySignDate
            }
        });

        // Attempt to save the contract in the database
        const savedContract = await newContract.save();

        // Return a success response with the saved contract details
        return res.status(201).json({
            success: true,
            message: 'Contract saved successfully!',
            data: savedContract
        });
    } catch (err) {
        console.error('Error saving contract:', err);

        // Handle validation errors
        if (err.name === 'ValidationError') {
            return res.status(422).json({
                success: false,
                message: 'Validation failed. Please check the submitted data.',
                error: err.errors
            });
        }

        // Handle database connection or save errors
        if (err.name === 'MongoError' || err.name === 'MongooseError') {
            return res.status(503).json({
                success: false,
                message: 'Database error. Please try again later.',
                error: err.message
            });
        }

        // Generic error handler
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while saving the contract.',
            error: err.message
        });
    }
});


app.get('/confirmedcontract',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/confirmedContract.html'));
});

app.get('/companydashboard2',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/company/companyprofile2.html'));
});
app.get('/companydashboard',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/company/company.html'));
});

app.get('/logo-photo',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/farmhub.jpg'));
});
app.get('/account-photo',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/account2.jpg'));
});

app.get('/contractterms',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/fullcontract.html'));
});

app.get('/marketplace',(req,res)=>{
    res.sendFile(path.join(__dirname , '../public/dashboard/marketplace2.html'));
});

app.get('/applications', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/receivedapplication.html'));
});

app.get('/farmerdashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/farmerdashboard.html'));
});
// Dashboard Route with Authorization
app.get('/companyprofile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/firmProfile.html'));
});
app.get('/farmerprofile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/farmerProfile.html'));
});

app.get('/farmerReq', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/applicationform.html'));
});

app.get('/requirementform', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/requirementpage.html'));
});

app.get('/farmerprofile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/farmerProfile.html'));
});
app.get('/marketplace', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/marketplace2.html'));
});
// Serve the Contract Farming Form
app.get('/registrationForm', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/FirmRegistration.html'));
});

app.get('/farmerRegistrationForm', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/farmerRegistrationForm.html'));
});


// Root route (Serve login page)
app.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/login.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/landingpage.html'));
});

// Middleware for user role fetching and route protection
app.use(fetchUserRole);

// Use login-related routes
app.use('/', loginRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
