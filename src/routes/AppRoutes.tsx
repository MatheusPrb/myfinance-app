import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '../components/auth/RouteGuards'
import { AppShell } from '../components/layout/AppShell'
import { ExpenseDetailPage } from '../pages/ExpenseDetailPage'
import { ExpensesPage } from '../pages/ExpensesPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NewExpensePage } from '../pages/NewExpensePage'
import { RegisterPage } from '../pages/RegisterPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route element={<GuestOnly />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="expenses/new" element={<NewExpensePage />} />
            <Route path="expenses/:id" element={<ExpenseDetailPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
