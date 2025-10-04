const axios = require('axios');

const baseUrl = 'http://localhost:5002/api';

async function testAuthentication() {
    try {
        console.log('=== TESTING AUTHENTICATION FLOW ===');
        
        // First, let's check existing schools
        console.log('0. Checking existing schools...');
        const schoolsResponse = await axios.get(`${baseUrl}/school/all`);
        console.log('Available schools:', schoolsResponse.data.data?.length || 0);
        
        if (schoolsResponse.data.data && schoolsResponse.data.data.length > 0) {
            console.log('First school:', schoolsResponse.data.data[0].school_name);
        }
        
        // Test login with sample credentials
        const loginData = {
            email: 'test@school.com',
            password: 'testpassword'
        };
        
        console.log('\n1. Testing student records with authentication...');
        
        // Test without authentication first to see the error
        try {
            const statsResponse = await axios.get(`${baseUrl}/student-records/stats`);
            console.log('✅ Stats without auth:', statsResponse.data);
        } catch (error) {
            console.log('❌ Stats error (expected):', error.response?.data?.message);
        }
        
        try {
            const recordsResponse = await axios.get(`${baseUrl}/student-records`);
            console.log('✅ Records without auth:', recordsResponse.data);
        } catch (error) {
            console.log('❌ Records error (expected):', error.response?.data?.message);
        }
        
        // Test creating a student record with unique data
        const timestamp = Date.now();
        const uniqueRollNumber = `R${timestamp.toString().slice(-6)}`; // Use last 6 digits
        const studentData = {
            student_name: `Test Student ${timestamp}`,
            father_name: 'Test Father',
            class: '11th', // Use different class to avoid conflict
            section: 'B',
            roll_number: uniqueRollNumber,
            phone_number: '9876543210',
            fees: {
                tuition_fees: 5000,
                paid_fees: 2000
            }
        };
        
        console.log('\n2. Testing student record creation with unique data...');
        try {
            const createResponse = await axios.post(`${baseUrl}/student-records`, studentData);
            console.log('✅ Student record created successfully:', createResponse.data.message);
        } catch (error) {
            console.log('❌ Create error:', error.response?.data?.message);
        }
        
        console.log('\n3. Testing duplicate key error handling...');
        try {
            const duplicateResponse = await axios.post(`${baseUrl}/student-records`, duplicateData);
            console.log('✅ Duplicate record created (unexpected):', duplicateResponse.data.message);
        } catch (error) {
            console.log('✅ Duplicate error handled correctly:', error.response?.data?.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.log('Authentication issue - need valid school credentials');
        }
    }
}

testAuthentication();
