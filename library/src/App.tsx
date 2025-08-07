import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { Routes, Route, Navigate } from "react-router"; // ✅ Added Navigate
import { BookCheckoutPage } from "./layouts/BookCheckOutPage/BookCheckOutPage";

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1">
        <Routes>
          {/* Redirect / to /homepage */}
          <Route path="/" element={<Navigate to="/homepage" replace />} />

          {/* Actual pages */}
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/search" element={<SearchBooksPage />} />
          <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
};
