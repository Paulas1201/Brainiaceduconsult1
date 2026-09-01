import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { LearningModes } from './components/LearningModes';
import { ExamPrep } from './components/ExamPrep';
import { SubjectsGrid } from './components/SubjectsGrid';
import { WhatYouGain } from './components/WhatYouGain';
import { Testimonials } from './components/Testimonials';
import { WhoCanEnroll } from './components/WhoCanEnroll';
import { UrgencyCta } from './components/UrgencyCta';
import { LeadModal } from './components/LeadModal';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin' ||
        new URLSearchParams(window.location.search).has('admin')
      );
    }
    return false;
  });

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      const isAdmin =
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin' ||
        new URLSearchParams(window.location.search).has('admin');
      setIsAdminView(isAdmin);
    };

    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const handleOpenLeadModal = () => setIsLeadModalOpen(true);
  const handleCloseLeadModal = () => setIsLeadModalOpen(false);

  const handleOpenAdminPortal = () => {
    window.location.hash = 'admin';
    setIsAdminView(true);
  };

  const handleBackToWebsite = () => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    setIsAdminView(false);
  };

  // If in Admin Backend Mode: Render dedicated backend portal ONLY
  if (isAdminView) {
    return <AdminPortal onBackToWebsite={handleBackToWebsite} />;
  }

  // Public Landing Page: Clean student/parent conversion experience
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header Navbar */}
      <Navbar onOpenLeadModal={handleOpenLeadModal} />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenLeadModal={handleOpenLeadModal} />
        <WhyChooseUs />
        <LearningModes onOpenLeadModal={handleOpenLeadModal} />
        <ExamPrep onOpenLeadModal={handleOpenLeadModal} />
        <SubjectsGrid onOpenLeadModal={handleOpenLeadModal} />
        <WhatYouGain onOpenLeadModal={handleOpenLeadModal} />
        <Testimonials />
        <WhoCanEnroll onOpenLeadModal={handleOpenLeadModal} />
        <UrgencyCta onOpenLeadModal={handleOpenLeadModal} />
      </main>

      {/* Footer */}
      <Footer
        onOpenLeadModal={handleOpenLeadModal}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Public Student Enrollment Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={handleCloseLeadModal}
      />

    </div>
  );
}
