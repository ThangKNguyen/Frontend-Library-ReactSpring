import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { Footer } from "./layouts/NavbarAndFooter/Footer";

import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { BookCheckoutPage } from "./layouts/BookCheckOutPage/BookCheckOutPage";
// import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
// import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
// import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
// import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";

import LoginPage from "./Auth/LoginPage";

import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import { auth0Config } from "./lib/auth0Config";

// Wrap Auth0 with v6 navigation
const Auth0ProviderWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || "/home", { replace: true });
  };

  return (
    <Auth0Provider
      domain={auth0Config.issuer}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

// // Protect the same pages using the same HOC logic
// const ShelfPageProtected = withAuthenticationRequired(ShelfPage);
// const MessagesPageProtected = withAuthenticationRequired(MessagesPage);
// const ManageLibraryPageProtected = withAuthenticationRequired(ManageLibraryPage);

export const App: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Auth0ProviderWithRouter>
        <Navbar />

        <div className="flex-grow-1">
          <Routes>
            {/* Redirect / -> /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Public routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchBooksPage />} />
            {/* <Route path="/reviewlist/:bookId" element={<ReviewListPage />} /> */}
            <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes (same logic, updated syntax) */}
            {/* <Route path="/shelf" element={<ShelfPageProtected />} />
            <Route path="/messages" element={<MessagesPageProtected />} />
            <Route path="/admin" element={<ManageLibraryPageProtected />} /> */}

            {/* Fallback (optional) */}
            {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
          </Routes>
        </div>

        <Footer />
      </Auth0ProviderWithRouter>
    </div>
  );
};

