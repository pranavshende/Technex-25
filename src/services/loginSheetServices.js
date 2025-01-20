const mongoose = require('mongoose');

// Connect to MongoDB (make sure you have MongoDB running locally or use a cloud service like MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/contract_farming', {
});

// Define the schema for registrations and users
const registrationSchema = new mongoose.Schema({
    firmName: String,
    firmType: String,
    registrationNumber: String,
    dateOfEstablishment: Date,
    contactPerson: String,
    designation: String,
    contactEmail: String,
    contactPhone: String,
    coreBusiness: String,
    annualTurnover: String,
    certifications: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
});

// Create models for the schemas
const Registration = mongoose.model('Registration', registrationSchema);
const User = mongoose.model('User', userSchema);

// Fetch users from MongoDB
async function fetchUsers() {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.error('Error fetching users from MongoDB:', error);
        return [];
    }
}

// Add a new registration to MongoDB
async function addRegistrationToMongoDB(firmName, firmType, registrationNumber, dateOfEstablishment, contactPerson, designation, contactEmail, contactPhone, coreBusiness, annualTurnover, certifications) {
    const newRegistration = new Registration({
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
    });

    try {
        await newRegistration.save();
        console.log('Registration added to MongoDB:', newRegistration);
    } catch (error) {
        console.error('Error adding registration to MongoDB:', error);
    }
}

async function addFarmersRegistrationToMongoDB( fullName,
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
    storageFacilities) {
    const newRegistration = new farmerRegistration({
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
    });

    try {
        await newRegistration.save();
        console.log('Registration added to MongoDB:', newRegistration);
    } catch (error) {
        console.error('Error adding registration to MongoDB:', error);
    }
}


// Fetch registration by email
async function fetchRegistrationByEmail(email) {
    try {
        const registration = await Registration.findOne({ contactEmail: email });
        
        if (!registration) {
            console.log('No registration found for email:', email);
            return null;
        }
        console.log('Fetched registration:', registration);
        return registration;
    } catch (error) {
        console.error('Error fetching registration from MongoDB:', error);
        return null;
    }
}
async function fetchFarmerRegistrationByEmail(email) {
    try {
        const farmerRegistration = await farmerRegistration.findOne({ email });

        if (!farmerRegistration) {
            console.log('No farmer registration found for email:', email);
            return null;
        }

        console.log('Fetched farmer registration:', farmerRegistration);
        return farmerRegistration;
    } catch (error) {
        console.error('Error fetching farmer registration from MongoDB:', error);
        return null;
    }
}

// Add user to MongoDB
async function addToMongoDB(name, email, password, role) {
    const newUser = new User({
        name,
        email,
        password,
        role,
    });

    try {
        await newUser.save();
        console.log('User added to MongoDB:', newUser);
    } catch (error) {
        console.error('Error adding user to MongoDB:', error);
    }
}

// Function to authenticate a user
const bcrypt = require('bcrypt');

async function authenticateUser(email, password) {
    try {
        const users = await fetchUsers();
        const user = users.find(user => user.email === email);

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                console.log('User authenticated and logged in:', user.email);
                return user;
            } else {
                console.log('Invalid password for email:', email);
                return undefined;
            }
        } else {
            console.log('No matching user found for email:', email);
            return undefined;
        }
    } catch (error) {
        console.error('Error during user authentication:', error);
        throw new Error('An error occurred during authentication. Please try again later.');
    }
}

// Signup user and check if user exists
async function signupUser(email) {
    try {
        const users = await fetchUsers();
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            console.log('User already exists:', email);
            return { success: false, message: 'User already exists' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error during user signup:', error);
        throw new Error('An error occurred during signup. Please try again later.');
    }
}

// Export functions for use in other parts of the application
module.exports = {
    fetchUsers,
    authenticateUser,
    addToMongoDB,
    signupUser,
    addRegistrationToMongoDB,
    fetchRegistrationByEmail,
    addFarmersRegistrationToMongoDB,
    fetchFarmerRegistrationByEmail,
};
