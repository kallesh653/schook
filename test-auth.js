// Move this file to api directory to access axios
const axios = require('./node_modules/axios');

const baseUrl = 'http://localhost:5002/api';

async function testAuthentication() {
    try {
        console.log('=== TESTING AUTHENTICATION FLOW ===');
        
        // Test login with sample credentials
        const loginData = {
            email: 'test@school.com',
            password: 'testpassword'
        };
        
        console.log('1. Testing login...');
        const loginResponse = await axios.post(`${baseUrl}/school/login`, loginData);
        
        if (loginResponse.data.success) {
            console.log('✅ Login successful');
            console.log('User data:', loginResponse.data.user);
            
            const token = loginResponse.headers.authorization;
            console.log('Token received:', token ? 'Yes' : 'No');
            
            if (token) {
                console.log('\n2. Testing student records with authentication...');
                
                // Test fetching student records
                const headers = { Authorization: `Bearer ${token}` };
                
                const statsResponse = await axios.get(`${baseUrl}/student-records/stats`, { headers });
                console.log('✅ Stats fetched successfully:', statsResponse.data);
                
                const recordsResponse = await axios.get(`${baseUrl}/student-records`, { headers });
                console.log('✅ Records fetched successfully. Count:', recordsResponse.data.data?.length || 0);
                
                // Test creating a student record
                const studentData = {
                    student_name: 'Test Student',
                    father_name: 'Test Father',
                    class: '10th',
                    section: 'A',
                    roll_number: '001',
                    phone_number: '9876543210',
                    fees: {
                        tuition_fees: 5000,
                        paid_fees: 2000
                    }
                };
                
                console.log('\n3. Testing student record creation...');
                const createResponse = await axios.post(`${baseUrl}/student-records`, studentData, { headers });
                console.log('✅ Student record created successfully:', createResponse.data);
                
            } else {
                console.log('❌ No token received from login');
            }
        } else {
            console.log('❌ Login failed:', loginResponse.data.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.log('Authentication issue - need valid school credentials');
        }
    }
}

testAuthentication();
