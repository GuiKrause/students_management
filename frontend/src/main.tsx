import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthProvider.tsx'
import Home from './pages/Home.tsx'
import ProtectedRoute from './utils/ProtectedRoute.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App key={'login'}/>
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home key={'home'}/>
      </ProtectedRoute>
    ),
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
