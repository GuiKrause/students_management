export default async function login(credentials: any) {
    const url = 'http://localhost:3000/auth/login'; // Replace with your API endpoint

    try {
        // Send POST request with user credentials
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();

        // Retrieve and return the token
        const token = data.token; // Adjust this based on your API response structure
        if (!token) {
            throw new Error('Token not received from server');
        }

        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}