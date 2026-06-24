import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import HeroSection from './sections/HeroSection';
import AnnouncementMarquee from './components/AnnouncementMarquee';
import LemonChat from './sections/LemonChat';
import UpcomingEvents from './sections/UpcomingEvents';
import NewsSection from './sections/NewsSection';
import ProjectsSection from './sections/ProjectsSection';
import ServicesSection from './sections/ServicesSection';
import FeatureShowcase from './sections/FeatureShowcase';
import UsefulSitesSection from './sections/UsefulSitesSection';
import WeeklyTip from './sections/WeeklyTip';
import Testimonials from './sections/Testimonials';
import SuggestionsSection from './sections/SuggestionsSection';
import GraduationPromo from './sections/GraduationPromo';
import Footer from './components/Footer';
import PageTitleUpdater from './components/PageTitleUpdater';

import StudyMaterials from './pages/StudyMaterials';
import AcademicPlans from './pages/AcademicPlans';
import Quiz from './pages/Quiz';
import AcademicCalendar from './pages/AcademicCalendar';
import GradingSystem from './pages/GradingSystem';
import MaterialExchange from './pages/MaterialExchange';

import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import AdminCourseStatusManager from './components/AdminCourseStatusManager';
import AdminDashboard from './pages/AdminDashboard';

import Legal from './pages/Legal';
import './index.css';

import FeedbackPopup from './components/FeedbackPopup';
import NashmiGuide from './components/NashmiGuide';

const HomePage = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Handle manual scroll state
    if (location.state?.scrollToReviews) {
      const section = document.getElementById('testimonials-section');
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    // Handle hash fragments (e.g., #/#lemon-chat)
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <AnnouncementMarquee />
      <LemonChat />
      <UpcomingEvents />
      <GraduationPromo />
      {/* <NewsSection /> */}
      <WeeklyTip />
      <ProjectsSection />

      <ServicesSection />
      <FeatureShowcase />
      <UsefulSitesSection />
      <div id="testimonials-section">
        <Testimonials />
      </div>
      <SuggestionsSection />
    </>
  );
};


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  React.useEffect(() => {
    // Check if user has already rated or dismissed in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenFeedbackPopup');

    if (!hasSeenPopup) {
      // Show popup after 5 minutes (300,000 ms)
      // For testing, you might want to reduce this time
      const timer = setTimeout(() => {
        setShowFeedbackPopup(true);
      }, 5 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowFeedbackPopup(false);
    sessionStorage.setItem('hasSeenFeedbackPopup', 'true');
  };

  return (
    <Router>
      <ScrollToTop />
      <PageTitleUpdater />
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          zIndex: 99999, // Ensure it's above everything including navbar
        }}
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
      />
      <div className="app-container">
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <FeedbackPopup
          isOpen={showFeedbackPopup}
          onClose={handleClosePopup}
        />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/materials" element={<StudyMaterials />} />
            <Route path="/plans" element={<AcademicPlans />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/calendar" element={<AcademicCalendar />} />
            <Route path="/grading" element={<GradingSystem />} />
            <Route path="/exchange" element={<MaterialExchange />} />
            <Route path="/exchange-admin" element={<AdminCourseStatusManager />} />

            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<AboutUs />} />

            <Route path="/legal" element={<Legal />} />
          </Routes>
        </main>

        <NashmiGuide />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
