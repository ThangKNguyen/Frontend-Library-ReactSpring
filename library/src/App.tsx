import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { Footer } from "./layouts/NavbarAndFooter/Footer";

import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { BookCheckoutPage } from "./layouts/BookCheckOutPage/BookCheckOutPage";
import { ReviewListPage } from "./layouts/BookCheckOutPage/ReviewListPage/ReviewListPage";
// import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
// import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
// import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
// import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";

import LoginPage from "./Auth/LoginPage";
import { SpinnerLoading } from "./layouts/utils/SpinnerLoading";

import { Auth0Provider /*, withAuthenticationRequired*/ } from "@auth0/auth0-react";
import { auth0Config } from "./lib/auth0Config";

// Wrap Auth0 with v6 navigation
const Auth0ProviderWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    // land on the intended path or fallback to root
    navigate(appState?.returnTo || "/", { replace: true });
  };

  return (
    <Auth0Provider
      domain={auth0Config.issuer}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri, // e.g., http://localhost:5173/callback
        audience: auth0Config.audience,        // must match your API Identifier in Auth0
        scope: auth0Config.scope,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
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
            {/* Redirect /home -> / */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchBooksPage />} />
            {/* <Route path="/reviewlist/:bookId" element={<ReviewListPage />} /> */}
            <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reviewlist/:bookId" element={<ReviewListPage />} />

            {/* Auth0 callback landing (required since redirectUri ends with /callback) */}
            <Route path="/callback" element={<SpinnerLoading />} />

            {/* Protected routes (same logic, updated syntax) */}
            {/* <Route path="/shelf" element={<ShelfPageProtected />} />
            <Route path="/messages" element={<MessagesPageProtected />} />
            <Route path="/admin" element={<ManageLibraryPageProtected />} /> */}

            {/* Fallback (optional) */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </div>

        <Footer />
      </Auth0ProviderWithRouter>
    </div>
  );
};


