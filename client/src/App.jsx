import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import MenCategory from './pages/MenCategory.jsx'
import Payment from './pages/Payment.jsx'
import Shop from './pages/Shop.jsx'
import WomenCategory from './pages/WomenCategory.jsx'
import Register from './pages/Register.jsx'
import SignIn from './pages/SignIn.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category/men" element={<MenCategory />} />
        <Route path="/category/women" element={<WomenCategory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
