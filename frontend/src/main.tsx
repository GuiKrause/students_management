import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthProvider.tsx'
import Home from './pages/Home.tsx'
import ProtectedRoute from './utils/ProtectedRoute.tsx'
import UserForm from './pages/UserForm.tsx'

import { Toaster } from "@/components/ui/toaster"

const router = createBrowserRouter([
  {
    path: '/',
    element: <App key={'login'} />
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home key={'home'} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute>
        <UserForm key={'user-form'} />
      </ProtectedRoute>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </StrictMode>,
)
