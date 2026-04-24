import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import { HomePage } from '../features/public/pages/HomePage'
import { ServicesPage } from '../features/public/pages/ServicesPage'
import { AboutPage } from '../features/public/pages/AboutPage'
import { ContactPage } from '../features/public/pages/ContactPage'
import { ClientRegistrationPage } from '../features/public/pages/ClientRegistrationPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { DashboardHomePage } from '../features/dashboard/pages/DashboardHomePage'
import { ClientDashboardPage } from '../features/dashboard/pages/ClientDashboardPage'
import { TechnicianDashboardPage } from '../features/dashboard/pages/TechnicianDashboardPage'
import { AdministrativeDashboardPage } from '../features/dashboard/pages/AdministrativeDashboardPage'
import { PlatformAdminDashboardPage } from '../features/dashboard/pages/PlatformAdminDashboardPage'
import { DashboardIndexRedirect } from '../features/dashboard/pages/DashboardIndexRedirect'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'servicios', element: <ServicesPage /> },
      { path: 'quienes-somos', element: <AboutPage /> },
      { path: 'contactanos', element: <ContactPage /> },
      { path: 'registro-clientes', element: <ClientRegistrationPage /> },
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'recuperar-acceso', element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['client', 'technician', 'administrative', 'platform_admin']}
      />
    ),
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardIndexRedirect /> },
          { path: 'resumen', element: <DashboardHomePage /> },
          {
            path: 'cliente',
            element: <ProtectedRoute allowedRoles={['client']} />,
            children: [{ index: true, element: <ClientDashboardPage /> }],
          },
          {
            path: 'tecnico',
            element: <ProtectedRoute allowedRoles={['technician']} />,
            children: [{ index: true, element: <TechnicianDashboardPage /> }],
          },
          {
            path: 'administrativo',
            element: <ProtectedRoute allowedRoles={['administrative']} />,
            children: [{ index: true, element: <AdministrativeDashboardPage /> }],
          },
          {
            path: 'admin-plataforma',
            element: <ProtectedRoute allowedRoles={['platform_admin']} />,
            children: [{ index: true, element: <PlatformAdminDashboardPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
