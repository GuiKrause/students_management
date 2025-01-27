export default async function login(credentials: any) {
    const url = 'http://localhost:3000/auth/login';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const data = await response.json();

        const token = data.token;
        if (!token) {
            throw new Error('Token not received from server');
        }

        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export async function register(credentials: any) {
    const url = 'http://localhost:3000/auth/register';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`Registration failed: ${response.statusText}`);
        }

        return true;

    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}