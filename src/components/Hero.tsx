import React from 'react';
import { Youtube, Sparkles, Clock } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Video Summarizer</span>
          <span className="block text-blue-600 text-3xl sm:text-4xl mt-3">
            AI-Powered YouTube Summaries
          </span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
          Get instant summaries of any YouTube video. Save time and extract key insights quickly.
        </p>
        
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
              <Youtube className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Works with any YouTube video
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              AI-powered analysis
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Save hours of watching
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}