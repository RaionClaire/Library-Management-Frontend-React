import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth.jsx";
import RequireRole from "./guards/RequireRole.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Profile from "../pages/profil.jsx";
import DetailBuku from "../pages/detailBuku.jsx";
import Notifikasi from "../pages/notifikasi.jsx";
import PeminjamanAktif from "../pages/peminjamanAktif.jsx";
import PinjamBuku from "../pages/pinjamBuku.jsx";
import TotalBuku from "../pages/totalBuku.jsx";
import UbahPassword from "../pages/ubahPassword.jsx";
import LupaPassword from "../pages/lupaPassword.jsx";
import MemberFines from "../pages/memberFines.jsx";
import Authors from "../pages/authors.jsx";
import AuthorDetail from "../pages/authorDetail.jsx";
import Categories from "../pages/categories.jsx";
import CategoryDetail from "../pages/categoryDetail.jsx";
import UnifiedSidebar from "../components/UnifiedSidebar.jsx";

// Admin CRUD Components
import BooksTable from "../components/BooksTable.jsx";
import AuthorsTable from "../components/AuthorsTable.jsx";
import CategoriesTable from "../components/CategoriesTable.jsx";
import LoansTable from "../components/LoansTable.jsx";
import FinesTable from "../components/FinesTable.jsx";
import UsersTable from "../components/UsersTable.jsx";
import Reports from "../components/Reports.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";

function AppRoutes() {
  const location = useLocation();

  const hideSidebar = ["/", "/login", "/register", "/lupaPassword"].includes(
    location.pathname
  );

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <UnifiedSidebar />}

      {/* Konten utama */}
      <div
        style={{
          flex: 1,
          marginLeft: hideSidebar ? "0" : "230px", 
          padding: "20px",
          transition: "margin 0.3s ease",
        }}
      >
        <Routes>
          {/* Halaman tanpa sidebar */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lupaPassword" element={<LupaPassword />} />

          {/* Protected routes - MEMBER ONLY */}
          <Route element={<RequireAuth />}> 
            <Route element={<RequireRole roles={["member"]} />}> 
              <Route path="/home" element={<Home />} />
              <Route path="/totalBuku" element={<TotalBuku />} />
              <Route path="/detailBuku" element={<DetailBuku />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/authors/:id" element={<AuthorDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<CategoryDetail />} />
              <Route path="/pinjamBuku" element={<PinjamBuku />} />
              <Route path="/pinjamBuku/:id" element={<PinjamBuku />} />
              <Route path="/peminjaman" element={<PeminjamanAktif />} />
              <Route path="/member-fines" element={<MemberFines />} />
              <Route path="/notification" element={<Notifikasi />} />

            </Route>

            {/* Protected routes - SHARED (both admin and member can access) */}
            <Route path="/profil" element={<Profile />} />
            <Route path="/ubahPassword" element={<UbahPassword />} />

            {/* Protected routes - ADMIN ONLY */}
            <Route element={<RequireRole roles={["admin"]} />}> 
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<BooksTable />} />
              <Route path="/admin/authors" element={<AuthorsTable />} />
              <Route path="/admin/categories" element={<CategoriesTable />} />
              <Route path="/admin/loans" element={<LoansTable />} />
              <Route path="/admin/fines" element={<FinesTable />} />
              <Route path="/admin/users" element={<UsersTable />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

// Komponen utama router aplikasi
export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
