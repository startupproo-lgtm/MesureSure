import React from 'react';
import { MetrologyProvider, useMetrology } from './context/MetrologyContext';
import { HeaderBar } from './components/common/HeaderBar';
import { LandingScreen } from './components/screens/LandingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { InspectionWorkspaceScreen } from './components/screens/InspectionWorkspaceScreen';
import { PublicQrVerificationScreen } from './components/screens/PublicQrVerificationScreen';
import { CertificateModal } from './components/modals/CertificateModal';
import { RegisterInstrumentModal } from './components/modals/RegisterInstrumentModal';
import { InstrumentDetailsModal } from './components/modals/InstrumentDetailsModal';
import { StatutoryPaymentModal } from './components/modals/StatutoryPaymentModal';
import { StatutoryChallanReceiptModal } from './components/modals/StatutoryChallanReceiptModal';
import { ScannedCertificatePhotoViewer } from './components/common/ScannedCertificatePhotoViewer';
import { TechnicalSupportModal } from './components/modals/TechnicalSupportModal';
import { GovernmentGrievanceModal } from './components/modals/GovernmentGrievanceModal';
import { MobilePaymentCheckoutScreen } from './components/screens/MobilePaymentCheckoutScreen';

const AppContent: React.FC = () => {
  const [mobilePaySessionId, setMobilePaySessionId] = React.useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const querySession = searchParams.get('paySession') || searchParams.get('pay') || searchParams.get('session');
      if (querySession) return querySession;

      const pathMatch = window.location.pathname.match(/^\/pay\/([^\/\?#]+)/);
      if (pathMatch && pathMatch[1]) return pathMatch[1];
    }
    return null;
  });

  const {
    activeScreen,
    isAuthenticated,
    selectedCertificate,
    showCertificateModal,
    setShowCertificateModal,
    showRegisterModal,
    setShowRegisterModal,
    selectedInstrument,
    setSelectedInstrument,
    requestVerification,
    setSelectedCertificate,
    certificates,
    // Payments
    activePaymentInstrument,
    showPaymentModal,
    activeReceiptToView,
    showReceiptModal,
    openPaymentModalForInstrument,
    closePaymentModal,
    openReceiptModal,
    closeReceiptModal,
    processInstrumentPayment,
    // Scanned Certificate Photo Viewer
    scannedCertificateForViewer,
    showScannedPhotoViewer,
    openScannedPhotoViewer,
    closeScannedPhotoViewer
  } = useMetrology();

  const matchingCert = selectedInstrument
    ? certificates.find(c => c.instrumentId === selectedInstrument.instrumentId || c.certificateNumber === selectedInstrument.certificateId) || null
    : null;

  // Dedicated Mobile Smartphone Checkout Mode (when scanned via phone QR code)
  if (mobilePaySessionId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-white font-sans antialiased">
        <MobilePaymentCheckoutScreen
          sessionId={mobilePaySessionId}
          onBackToApp={() => {
            setMobilePaySessionId(null);
            try {
              window.history.replaceState({}, '', '/');
            } catch {}
          }}
        />
        <StatutoryChallanReceiptModal
          isOpen={showReceiptModal}
          receipt={activeReceiptToView}
          onClose={closeReceiptModal}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-cyan-500 selection:text-white font-sans antialiased">
      <HeaderBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'PUBLIC_VERIFY' && <PublicQrVerificationScreen />}
        {activeScreen === 'LANDING' && <LandingScreen />}
        {(!isAuthenticated && activeScreen !== 'LANDING' && activeScreen !== 'PUBLIC_VERIFY') && <LoginScreen />}
        {(isAuthenticated && activeScreen === 'LOGIN') && <LoginScreen />}
        {(isAuthenticated && activeScreen === 'DASHBOARD') && <DashboardScreen />}
        {(isAuthenticated && activeScreen === 'INSPECTION_WORKSPACE') && <InspectionWorkspaceScreen />}
      </main>

      {/* Global Modals */}
      <CertificateModal
        isOpen={showCertificateModal}
        certificate={selectedCertificate}
        onClose={() => setShowCertificateModal(false)}
      />

      <RegisterInstrumentModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

      <InstrumentDetailsModal
        isOpen={!!selectedInstrument}
        instrument={selectedInstrument}
        certificate={matchingCert}
        onClose={() => setSelectedInstrument(null)}
        onRequestVerification={requestVerification}
        onViewCertificate={(cert) => {
          setSelectedCertificate(cert);
          setShowCertificateModal(true);
        }}
        onPayFee={(inst) => {
          openPaymentModalForInstrument(inst);
        }}
        onViewReceipt={(receipt) => {
          openReceiptModal(receipt);
        }}
      />

      {/* Bharat Kosh Statutory Payment Gateway Modal */}
      <StatutoryPaymentModal
        isOpen={showPaymentModal}
        instrument={activePaymentInstrument}
        onClose={closePaymentModal}
        onPaymentSuccess={(receipt) => {
          processInstrumentPayment(receipt);
          openReceiptModal(receipt);
        }}
      />

      {/* Statutory e-Challan / Treasury Form TR-5 Receipt Modal */}
      <StatutoryChallanReceiptModal
        isOpen={showReceiptModal}
        receipt={activeReceiptToView}
        onClose={closeReceiptModal}
      />

      {/* Scanned Certificate Photo Viewer (Dedicated photo viewer for scanned certificates with QR removed) */}
      <ScannedCertificatePhotoViewer
        isOpen={showScannedPhotoViewer}
        certificate={scannedCertificateForViewer}
        onClose={closeScannedPhotoViewer}
        availableCertificates={certificates}
        onSelectCertificate={(cert) => openScannedPhotoViewer(cert)}
      />

      {/* Technical Support & Bug Reporting Modal */}
      <TechnicalSupportModal />

      {/* Government Grievance & Malpractice Complaint Modal */}
      <GovernmentGrievanceModal />
    </div>
  );
};

export function App() {
  return (
    <MetrologyProvider>
      <AppContent />
    </MetrologyProvider>
  );
}

export default App;
