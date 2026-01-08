import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, Suspense, lazy } from 'react';
import "./index.css";
import NotFound from "./Pages/NotFound";
import Home from "./Pages/Home";
import About from "./Pages/About";
import ExperienceSection from "./Pages/ExperienceSection";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from 'framer-motion';
import { supabase } from "./supabase";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";

// Blog pages - keep synchronous for SEO
import Blog from "./Pages/Blog";
import BlogDetail from "./Pages/BlogDetail";

// Lazy-loaded Admin components for bundle splitting
const AdminLayout = lazy(() => import("./Pages/Admin/AdminLayout"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const Projects = lazy(() => import("./Pages/Admin/Projects"));
const ProjectForm = lazy(() => import("./Pages/Admin/ProjectForm"));
const Certificates = lazy(() => import("./Pages/Admin/Certificates"));
const CertificateForm = lazy(() => import("./Pages/Admin/CertificateForm"));
const TechStack = lazy(() => import("./Pages/Admin/TechStack"));
const Experience = lazy(() => import("./Pages/Admin/Experience"));
const Profile = lazy(() => import("./Pages/Admin/Profile"));
const SocialLinks = lazy(() => import("./Pages/Admin/SocialLinks"));
const Settings = lazy(() => import("./Pages/Admin/Settings"));
const Login = lazy(() => import("./Pages/Admin/Login"));
const AuthGuard = lazy(() => import("./Pages/Admin/AuthGuard"));
const BlogManagement = lazy(() => import("./Pages/Admin/BlogManagement"));

// Loading fallback component for lazy-loaded routes
const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-[#030014] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  const [sectionVisibility, setSectionVisibility] = useState({
    about: true,
    experience: true,
    projects: true,
    certificates: true,
    techStack: true,
    contact: true
  });
  useEffect(() => {
    const fetchVisibility = async () => {
      const { data, error } = await supabase
        .from('section_visibility')
        .select('*')
        .single();
      if (!error && data) setSectionVisibility(data);
    };
    fetchVisibility();
  }, []);
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          {sectionVisibility.about && <About />}
          {sectionVisibility.experience && <ExperienceSection />}
          {sectionVisibility.projects && <Portofolio />}
          {sectionVisibility.contact && <ContactPage />}
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                © 2025{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  ABC™
                </a>
                . All Rights Reserved.
              </span>
            </center>
          </footer>
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            ABHIJITH™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <BrowserRouter>
        <Routes>
          {/* Main Website Routes */}
          <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
          <Route path="/project/:id" element={<ProjectPageLayout />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* Admin Routes - Suspense wraps lazy components inside Route elements */}
          <Route path="/admin/login" element={<Suspense fallback={<AdminLoadingFallback />}><Login /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<AdminLoadingFallback />}><AuthGuard /></Suspense>}>
            <Route element={<Suspense fallback={<AdminLoadingFallback />}><AdminLayout /></Suspense>}>
              <Route index element={<Suspense fallback={<AdminLoadingFallback />}><Dashboard /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<AdminLoadingFallback />}><Projects /></Suspense>} />
              <Route path="projects/new" element={<Suspense fallback={<AdminLoadingFallback />}><ProjectForm /></Suspense>} />
              <Route path="projects/edit/:id" element={<Suspense fallback={<AdminLoadingFallback />}><ProjectForm /></Suspense>} />
              <Route path="certificates" element={<Suspense fallback={<AdminLoadingFallback />}><Certificates /></Suspense>} />
              <Route path="certificates/new" element={<Suspense fallback={<AdminLoadingFallback />}><CertificateForm /></Suspense>} />
              <Route path="certificates/edit/:id" element={<Suspense fallback={<AdminLoadingFallback />}><CertificateForm /></Suspense>} />
              <Route path="tech-stack" element={<Suspense fallback={<AdminLoadingFallback />}><TechStack /></Suspense>} />
              <Route path="experience" element={<Suspense fallback={<AdminLoadingFallback />}><Experience /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<AdminLoadingFallback />}><Profile /></Suspense>} />
              <Route path="social-links" element={<Suspense fallback={<AdminLoadingFallback />}><SocialLinks /></Suspense>} />
              <Route path="blog" element={<Suspense fallback={<AdminLoadingFallback />}><BlogManagement /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<AdminLoadingFallback />}><Settings /></Suspense>} />
            </Route>
          </Route>

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
