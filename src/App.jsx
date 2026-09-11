import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
const HeroSection = React.lazy(() => import('./sections/HeroSection'));
const AnnouncementMarquee = React.lazy(() => import('./components/AnnouncementMarquee'));
const LemonChat = React.lazy(() => import('./sections/LemonChat'));
const UpcomingEvents = React.lazy(() => import('./sections/UpcomingEvents'));
const ProjectsSection = React.lazy(() => import('./sections/ProjectsSection'));
const ServicesSection = React.lazy(() => import('./sections/ServicesSection'));
const RequestServicesSection = React.lazy(() => import('./sections/RequestServicesSection'));
const UsefulSitesSection = React.lazy(() => import('./sections/UsefulSitesSection'));
const WeeklyTip = React.lazy(() => import('./sections/WeeklyTip'));
const Testimonials = React.lazy(() => import('./sections/Testimonials'));
const SuggestionsSection = React.lazy(() => import('./sections/SuggestionsSection'));
const GraduationPromo = React.lazy(() => import('./sections/GraduationPromo'));
const Footer = React.lazy(() => import('./components/Footer'));
import PageTitleUpdater from './components/PageTitleUpdater';

const StudyMaterials = React.lazy(() => import('./pages/StudyMaterials'));
const AcademicPlans = React.lazy(() => import('./pages/AcademicPlans'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const AcademicCalendar = React.lazy(() => import('./pages/AcademicCalendar'));
const GradingSystem = React.lazy(() => import('./pages/GradingSystem'));
const MaterialExchange = React.lazy(() => import('./pages/MaterialExchange'));
const SecureGateway = React.lazy(() => import('./pages/SecureGateway'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Legal = React.lazy(() => import('./pages/Legal'));
import './index.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

import CookieConsent from './components/CookieConsent';
import SplashScreen from './components/SplashScreen';

const ReportModal = React.lazy(() => import('./components/ReportModal'));
import StudyProgressTracker from './components/StudyProgressTracker';
import ReadingProgressBar from './components/ReadingProgressBar';
import DailyMotivation from './components/DailyMotivation';
import BackToTopBtn from './components/BackToTopBtn';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import NoticeBoard from './components/NoticeBoard';

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
      <RequestServicesSection />
      <UsefulSitesSection />
      <div id="testimonials-section">
        <Testimonials />
      </div>
      <SuggestionsSection />
    </>
  );
};


const StudyProgressSection = () => (
  <div style={{ padding: '0 16px' }}>
    <StudyProgressTracker />
  </div>
);

const MaintenanceScreen = ({ message }) => (
  <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f8fafc', direction: 'rtl' }}>
    <div style={{ width: 'min(100%, 620px)', padding: '40px 32px', textAlign: 'center', background: '#fff', border: '1px solid #fde68a', borderRadius: '20px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.10)' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚧</div>
      <h1 style={{ margin: '0 0 12px', color: '#172033', fontSize: 'clamp(24px, 5vw, 34px)' }}>الموقع تحت الصيانة</h1>
      <p style={{ margin: 0, color: '#64748b', fontSize: '16px', lineHeight: 1.8 }}>{message || 'المنصة تحت الصيانة، نعود قريباً!'}</p>
    </div>
  </div>
);

const LegacyAdminRedirect = () => {
  React.useEffect(() => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const adminPath = `${basePath}/admin`;

    if (window.location.pathname.replace(/\/$/, '') === adminPath && !window.location.hash) {
      window.location.replace(`${basePath}/#/admin`);
    }
  }, []);

  return null;
};


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = React.useState('');

  // Splash screen disabled
  const [showSplash] = React.useState(false);
  const handleSplashFinish = React.useCallback(() => { }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'system_configs', 'global_settings'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setMaintenanceMode(data.maintenance_mode === true);
          setMaintenanceMessage(data.maintenance_message || '');
        }
      } catch (err) {
        console.warn('Failed to load site settings:', err);
      }
    };

    loadSettings();
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <LegacyAdminRedirect />
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
        <React.Suspense fallback={
          <div className="page-loading-screen">
            <div className="page-loading-inner">
              <div className="page-loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring spinner-ring-2"></div>
              </div>
              <p className="page-loading-text">جاري تحميل الصفحة...</p>
            </div>
          </div>
        }>
          <Routes>
            {/* Standalone report page - no navbar/footer */}
            <Route path="/report" element={<ReportModal />} />

            {/* 🔒 Isolated coordinator gateway - completely hidden from site, no navbar/footer/sidebar */}
            <Route path="/portal" element={<SecureGateway />} />

            {/* All other pages wrapped in site layout */}
            <Route path="*" element={
              <div className="app-container">
                {maintenanceMode ? <MaintenanceScreen message={maintenanceMessage} /> : <>
                  <Navbar toggleSidebar={toggleSidebar} />
                  <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                  <CookieConsent />

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


                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/about" element={<AboutUs />} />

                      <Route path="/legal" element={<Legal />} />
                    </Routes>
                  </main>

                  {/* Back to top button */}
                  <BackToTopBtn />
                  {/* Keyboard shortcuts help modal (press ?) */}
                  <KeyboardShortcutsHelp />
                  {/* Reading scroll progress bar */}
                  <ReadingProgressBar />
                  {/* Admin notice board (Firebase-driven) */}
                  <NoticeBoard />
                  <Footer />
                </>}
              </div>
            } />
          </Routes>
        </React.Suspense>

      </Router>
    </>
  );
}

export default App;
