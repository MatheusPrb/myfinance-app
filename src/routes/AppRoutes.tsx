import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '../components/auth/RouteGuards'
import { RequireAdmin } from '../components/auth/RequireAdmin'
import { AppShell } from '../components/layout/AppShell'
import { AdminCategoriesPage } from '../pages/AdminCategoriesPage'
import { AdminLogsPage } from '../pages/AdminLogsPage'
import { AdminSubcategoriesPage } from '../pages/AdminSubcategoriesPage'
import { ExpenseDetailPage } from '../pages/ExpenseDetailPage'
import { ExpensesPage } from '../pages/ExpensesPage'
import { HomePage } from '../pages/HomePage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { LoginPage } from '../pages/LoginPage'
import { NewExpensePage } from '../pages/NewExpensePage'
import { RegisterPage } from '../pages/RegisterPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route element={<GuestOnly />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="expenses/new" element={<NewExpensePage />} />
            <Route path="expenses/:id" element={<ExpenseDetailPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="admin/categories" element={<AdminCategoriesPage />} />
              <Route path="admin/subcategories" element={<AdminSubcategoriesPage />} />
              <Route path="admin/logs" element={<AdminLogsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
