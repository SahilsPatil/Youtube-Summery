import React, { useState } from 'react';
import { Youtube, Loader2 } from 'lucide-react';

interface VideoInputProps {
  onSubmit: (url: string) => Promise<void>;
  isAuthenticated: boolean;
  triesLeft?: number;
  error?: string | null;
}

export function VideoInput({ onSubmit, isAuthenticated, triesLeft, error }: VideoInputProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(url);
      setUrl('');
    } catch (error) {
      console.error('Error submitting URL:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Paste your YouTube URL below
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Youtube className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Generating Summary...
              </>
            ) : (
              'Generate Summary'
            )}
          </button>
        </form>
        {!isAuthenticated && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            {triesLeft !== undefined && triesLeft > 0 ? (
              <p>Using guest mode. <span className="font-medium">{triesLeft} {triesLeft === 1 ? 'try' : 'tries'} remaining</span>. <button className="text-blue-600 hover:text-blue-700 font-medium">Sign in</button> for unlimited access.</p>
            ) : (
              <p>Guest trial expired. <button className="text-blue-600 hover:text-blue-700 font-medium">Sign in</button> or <button className="text-blue-600 hover:text-blue-700 font-medium">create an account</button> for unlimited access.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}