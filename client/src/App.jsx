import React from "react";
// Make sure Navigate is imported from react-router-dom
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Search from "./pages/Search";
import About from "./pages/About";
import Upload from "./pages/Upload";
import FAQSection from "./components/landing/FAQSection";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// Optional: A component for a 404 page
// import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";

const App = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <Router>
      <Header />

      {/* Main content area */}
      {/* Consider adding padding-top if Header is sticky/fixed */}
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQSection />} />

          {/* Conditional Routes */}
          {isAuthenticated ? (
            <>
              {/* Authenticated user routes */}
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />

              {/* If authenticated user tries to go to login/signup, redirect them (e.g., to home or profile) */}
              <Route path="/login" element={<Navigate replace to="/" />} />
              <Route path="/signup" element={<Navigate replace to="/" />} />
            </>
          ) : (
            <>
              {/* Non-authenticated user routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* If non-authenticated user tries to access protected pages, redirect to login */}
              <Route
                path="/upload"
                element={<Navigate replace to="/login" />}
              />
              <Route
                path="/profile"
                element={<Navigate replace to="/login" />}
              />
              <Route
                path="/search"
                element={<Navigate replace to="/login" />}
              />
            </>
          )}

        </Routes>
      </div>
    </Router>
  );
};

export default App;
