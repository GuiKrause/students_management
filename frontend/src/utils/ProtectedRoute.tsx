// ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider.tsx";

// Explicitly typing children prop
interface ProtectedRouteProps {
    children: ReactNode; // Ensure it accepts children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { authToken } = useAuth(); // Get token from AuthContext

    if (!authToken) {
        // If no authToken, redirect to login
        return <Navigate to="/" />;
    }

    // If authenticated, render the child route (protected content)
    return <>{children}</>;
};

export default ProtectedRoute;
