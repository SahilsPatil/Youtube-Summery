import React from 'react';
import { Clock, Link } from 'lucide-react';
import { VideoSummary } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SummaryListProps {
  summaries: VideoSummary[];
}

export function SummaryList({ summaries }: SummaryListProps) {
  if (summaries.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        No summaries yet. Try generating one!
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4 mt-8">
      {summaries.map((summary) => (
        <div
          key={summary.id}
          className="bg-white p-6 rounded-lg shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <a
              href={summary.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              {new URL(summary.youtube_url).pathname.slice(-11)}
            </a>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(summary.created_at).toLocaleDateString()}
            </div>
          </div>
          {summary.summary ? (
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary.summary}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-500 italic">Processing summary...</p>
          )}
        </div>
      ))}
    </div>
  );
}