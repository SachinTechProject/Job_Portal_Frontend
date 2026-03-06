import React,{ useState } from 'react'
import Header from './components/Header'
import { UserContext } from './context/Usercontext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Register from './components/Register'
import Login from './components/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import ApplicantDashboard from './pages/ApplicantDashboard'
import FindJob from './pages/FindJob'
import Companies from './pages/Companies'

// additional helpers
import PrivateRoute from './components/PrivateRoute'
import NotFound from './pages/NotFound'
import PostJob from './pages/PostJob'
import AddCompany from './pages/AddCompany'
import Setting from './pages/Setting'
function App() {


  return (
    <BrowserRouter>
    <UserContext>
     <Header/>
     
     <Routes>
      {/* public pages */}
      <Route path='/' element={<Home/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />

      {/* anything inside this <Route> will check auth first */}
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/recruiter' element={<RecruiterDashboard/>} />
        <Route path='/application' element={<ApplicantDashboard/>} />
        <Route path='/jobs' element={<FindJob/>} />
        <Route path='/companies' element={<Companies/>} />
        <Route path='/post-job' element={<PostJob/>} />
        <Route path='/add-company' element={<AddCompany/>} />
        <Route path='/setting' element={<Setting/>} />
      </Route>

      {/* catch‑all */}
      <Route path="*" element={<NotFound />} />
     </Routes>
    </UserContext>
    </BrowserRouter>
    
  )
}

export default App
