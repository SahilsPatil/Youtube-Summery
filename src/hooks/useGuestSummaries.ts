import { useState, useEffect } from 'react';
import axios from 'axios';
import { nhost } from '../lib/nhost';
import { VideoSummary } from '../types';
import { isValidYouTubeUrl, getErrorMessage } from '../utils/validators';

const MAX_GUEST_TRIES = 2;

export function useGuestSummaries() {
  // ... [previous state declarations remain the same]
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = "https://n8n-dev.subspace.money/webhook/summarize-youtube-video";
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [triesLeft, setTriesLeft] = useState<number | undefined>(undefined);

  // Check remaining tries on mount
  useEffect(() => {
    checkRemainingTries();
  }, []);
  
  useEffect(() => {
    const savedSummaries = localStorage.getItem('guestSummaries');
    if (savedSummaries) {
      setSummaries(JSON.parse(savedSummaries));
    }
  }, []);
  
  const checkRemainingTries = async () => {
    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip = ipResponse.data.ip;

      const { data, error: gqlError } = await nhost.graphql.request(
        `
        query CheckGuestUsage($ip: String!) {
          guest_usage(where: { ip: { _eq: $ip } }) {
            tries
          }
        }
        `,
        { ip }
      );

      if (gqlError) throw gqlError;

      const currentTries = data.guest_usage?.[0]?.tries || 0;
      setTriesLeft(Math.max(0, MAX_GUEST_TRIES - currentTries));
    } catch (err) {
      console.error('Error checking remaining tries:', err);
    }
  };


  // const handleSubmitVideo = async (url: string) => {
  //   try {
  //     setError(null);

  //     // Validate YouTube URL
  //     if (!isValidYouTubeUrl(url)) {
  //       setError('Please enter a valid YouTube video URL.');
  //       return;
  //     }

  //     // Check guest usage limit
  //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //     const ip = ipResponse.data.ip;

  //     const { data, error: gqlError } = await nhost.graphql.request(
  //       `query CheckGuestUsage($ip: String!) {
  //         guest_usage(where: { ip: { _eq: $ip } }) {
  //           tries
  //         }
  //       }`,
  //       { ip }
  //     );

  //     if (gqlError) throw gqlError;

  //     const tries = data.guest_usage?.[0]?.tries || 0;
  //     const remaining = MAX_GUEST_TRIES - tries;

  //     if (remaining <= 0) {
  //       setError('You have exceeded the guest trial limit. Please sign in or create an account to continue.');
  //       setTriesLeft(0);
  //       return;
  //     }

  //     // Create temporary summary and update UI
  //     const newSummary: VideoSummary = {
  //       id: crypto.randomUUID(),
  //       youtube_url: url,
  //       summary: 'Processing...',
  //       created_at: new Date().toISOString(),
  //     };

  //     const updatedSummaries = [newSummary, ...summaries];
  //     setSummaries(updatedSummaries);
  //     localStorage.setItem('guestSummaries', JSON.stringify(updatedSummaries));

  //     // Process video
  //     const response = await fetch(targetUrl, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json'},
  //       body: JSON.stringify({ url })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to process video');
  //     }

  //     const result = await response.json();

  //     if (!result.transcription_id) {
  //       throw new Error('No transcription ID received');
  //     }

  //     // Poll for results
  //     let isPolling = true;
  //     while (isPolling) {
  //       const statusResponse = await fetch(
  //         `https://n8n-dev.subspace.money/webhook/youtube-summery-responce?transcription_id=${result.transcription_id}`
  //       );
  //       const statusResult = await statusResponse.json();

  //       if (statusResult.result === 'pending') {
  //         await new Promise(resolve => setTimeout(resolve, 1000));
  //         continue;
  //       }

  //       isPolling = false;

  //       if (statusResult.error || !statusResult.summary) {
  //         throw new Error(statusResult.error || 'Failed to generate summary');
  //       }

  //       // Update summary with result
  //       const finalSummaries = summaries.map(summary => {
  //         if (summary.id === newSummary.id) {
  //           return { ...summary, summary: statusResult.summary };
  //         }
  //         return summary;
  //       });

  //       setSummaries(finalSummaries);
  //       localStorage.setItem('guestSummaries', JSON.stringify(finalSummaries));

  //       // Increment usage count
  //       await nhost.graphql.request(
  //         `mutation IncrementGuestUsage($ip: String!, $tries: Int!) {
  //           insert_guest_usage_one(
  //             object: { ip: $ip, tries: $tries }
  //             on_conflict: { constraint: guest_usage_ip_unique, update_columns: tries }
  //           ) {
  //             tries
  //           }
  //         }`,
  //         { ip, tries: tries + 1 }
  //       );

  //       setTriesLeft(remaining - 1);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setError(getErrorMessage(error));
      
  //     // Update the failed summary in the list
  //     const updatedSummaries = summaries.map(summary => {
  //       if (summary.summary === 'Processing...') {
  //         return { ...summary, summary: 'Failed to generate summary' };
  //       }
  //       return summary;
  //     });
      
  //     setSummaries(updatedSummaries);
  //     localStorage.setItem('guestSummaries', JSON.stringify(updatedSummaries));
  //   }
  // };

 const handleSubmitVideo = async (url: string) => {
  try {
    setError(null);

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube video URL.');
      return;
    }

    // Check guest usage limit
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const ip = ipResponse.data.ip;

    const { data, error: gqlError } = await nhost.graphql.request(
      `query CheckGuestUsage($ip: String!) {
        guest_usage(where: { ip: { _eq: $ip } }) {
          tries
        }
      }`,
      { ip }
    );

    if (gqlError) throw gqlError;

    const tries = data.guest_usage?.[0]?.tries || 0;
    const remaining = MAX_GUEST_TRIES - tries;

    if (remaining <= 0) {
      setError('You have exceeded the guest trial limit. Please sign in or create an account to continue.');
      setTriesLeft(0);
      return;
    }

    // Create temporary summary and update UI
    const newSummary: VideoSummary = {
      id: crypto.randomUUID(),
      youtube_url: url,
      summary: 'Processing...',
      created_at: new Date().toISOString(),
    };

    const updatedSummaries = [newSummary, ...summaries];
    setSummaries(updatedSummaries);
    localStorage.setItem('guestSummaries', JSON.stringify(updatedSummaries));

    console.log('Temporary summary added:', updatedSummaries);

    // Process video
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to process video');
    }

    const result = await response.json();

    if (!result.transcription_id) {
      throw new Error('No transcription ID received');
    }

    console.log('Received transcription ID:', result.transcription_id);

    // Poll for results
    let isPolling = true;
    let statusResult = null;
    while (isPolling) {
      const statusResponse = await fetch(
        `https://n8n-dev.subspace.money/webhook/youtube-summery-responce?transcription_id=${result.transcription_id}`
      );
      statusResult = await statusResponse.json();

      if (statusResult.result === 'pending') {
        console.log('Polling status: pending');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      isPolling = false;

      if (statusResult.error || !statusResult.summary) {
        throw new Error(statusResult.error || 'Failed to generate summary');
      }

      console.log('Summary received:', statusResult.summary);
    }

    // Update summary with result
    const finalSummaries = updatedSummaries.map((summary) => {
      if (summary.id === newSummary.id) {
        return { ...summary, summary: statusResult.summary };
      }
      return summary;
    });

    console.log('Final summaries:', finalSummaries);

    setSummaries(finalSummaries);
    localStorage.setItem('guestSummaries', JSON.stringify(finalSummaries));

    // Increment usage count
    await nhost.graphql.request(
      `mutation IncrementGuestUsage($ip: String!, $tries: Int!) {
        insert_guest_usage_one(
          object: { ip: $ip, tries: $tries }
          on_conflict: { constraint: guest_usage_ip_unique, update_columns: tries }
        ) {
          tries
        }
      }`,
      { ip, tries: tries + 1 }
    );

    setTriesLeft(remaining - 1);
  } catch (error) {
    console.error('Error:', error);
    setError(getErrorMessage(error));

    // Update the failed summary in the list
    const updatedSummaries = summaries.map((summary) => {
      if (summary.summary === 'Processing...') {
        return { ...summary, summary: 'Failed to generate summary' };
      }
      return summary;
    });

    setSummaries(updatedSummaries);
    localStorage.setItem('guestSummaries', JSON.stringify(updatedSummaries));
  }
};


  
  return {
    summaries,
    handleSubmitVideo,
    error,
    triesLeft,
  };
}