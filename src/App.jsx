import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';
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

// Blog pages
import Blog from "./Pages/Blog";
import BlogDetail from "./Pages/BlogDetail";
import BlogManagement from "./Pages/Admin/BlogManagement";

// Admin components
import AdminLayout from "./Pages/Admin/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard";
import Projects from "./Pages/Admin/Projects";
import ProjectForm from "./Pages/Admin/ProjectForm";
import Certificates from "./Pages/Admin/Certificates";
import CertificateForm from "./Pages/Admin/CertificateForm";
import TechStack from "./Pages/Admin/TechStack";
import Experience from "./Pages/Admin/Experience";
import Profile from "./Pages/Admin/Profile";
import SocialLinks from "./Pages/Admin/SocialLinks";
import Settings from "./Pages/Admin/Settings";
import Login from "./Pages/Admin/Login";
import AuthGuard from "./Pages/Admin/AuthGuard";

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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AuthGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/edit/:id" element={<ProjectForm />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="certificates/new" element={<CertificateForm />} />
              <Route path="certificates/edit/:id" element={<CertificateForm />} />
              <Route path="tech-stack" element={<TechStack />} />
              <Route path="experience" element={<Experience />} />
              <Route path="profile" element={<Profile />} />
              <Route path="social-links" element={<SocialLinks />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="settings" element={<Settings />} />
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
