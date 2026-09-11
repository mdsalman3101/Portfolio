import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Portfolio from './pages/Portfolio'

const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Admin = lazy(() => import('./pages/Admin'))

export default function App(){return <Suspense fallback={<main className="admin-loading">Loading…</main>}><Routes><Route path="/" element={<Portfolio/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense>}
