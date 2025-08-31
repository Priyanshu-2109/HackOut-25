// Simple test to register a user
const testRegister = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@test.com',
        password: 'TestPass123!'
      })
    });
    
    const data = await response.json();
    console.log('Registration response:', data);
    
    if (response.ok) {
      console.log('✅ User registered successfully!');
    } else {
      console.log('❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testRegister();
