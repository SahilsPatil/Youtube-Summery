import React from 'react';
import { VideoInput } from './components/VideoInput';
import { SummaryList } from './components/SummaryList';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Toast } from './components/Toast';
import { useAuth } from './hooks/useAuth';
import { useSummaries } from './hooks/useSummaries';
import { useToast } from './hooks/useToast';

export default function App() {
  const { user, error: authError, successMessage, handleAuth, handleLogout } = useAuth();
  const { summaries, handleSubmitVideo, error: summaryError, triesLeft } = useSummaries(user);
  const { toasts, showToast, removeToast } = useToast();

  // Show auth-related toasts
  React.useEffect(() => {
    if (successMessage) {
      showToast(successMessage, 'success');
    }
    if (authError) {
      showToast(authError, 'error');
    }
  }, [successMessage, authError, showToast]);

  // Show summary-related errors
  React.useEffect(() => {
    if (summaryError) {
      showToast(summaryError, 'error');
    }
  }, [summaryError, showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header 
        user={user} 
        error={authError}
        onLogout={handleLogout}
        onAuth={handleAuth}
      />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-12">
            <VideoInput
              onSubmit={handleSubmitVideo}
              isAuthenticated={!!user}
              error={summaryError}
              triesLeft={triesLeft}
            />
            <SummaryList summaries={summaries} />
          </div>
        </div>
      </main>
      
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}