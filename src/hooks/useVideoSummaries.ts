// import { useState } from 'react';
// import { VideoSummary } from '../types';

// export function useVideoSummaries(userId: string | undefined) {
//   const [summaries, setSummaries] = useState<VideoSummary[]>([]);

//   // const handleSubmitVideo = async (url: string) => {
//   //   // Create a temporary summary for guest mode
//   //   const newSummary: VideoSummary = {
//   //     id: crypto.randomUUID(),
//   //     youtube_url: url,
//   //     summary: 'Processing...', // Set it as 'Processing' while waiting for response
//   //     created_at: new Date().toISOString()
//   //   };

//   //   const updatedSummaries = [newSummary, ...summaries];
//   //   setSummaries(updatedSummaries);
//   //   localStorage.setItem('guestSummaries', JSON.stringify(updatedSummaries));

//   //   try {
//   //     // Call n8n workflow to fetch summary
//   //     const response = await fetch(targetUrl, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ url })
//   //     });

//   //     const result = await response.json();

//   //     // Find the new summary in the list and update it with the result
//   //     const updatedSummariesWithSummary = updatedSummaries.map(summary => {
//   //       if (summary.id === newSummary.id) {
//   //         return {
//   //           ...summary,
//   //           summary: result.summary || 'Summary not available'
//   //         };
//   //       }
//   //       return summary;
//   //     });

//   //     // Update the state and localStorage
//   //     setSummaries(updatedSummariesWithSummary);
//   //     localStorage.setItem('guestSummaries', JSON.stringify(updatedSummariesWithSummary));
//   //   } catch (error) {
//   //     console.error('Error submitting video URL:', error);

//   //     // Update summary if there was an error
//   //     const updatedSummariesWithError = updatedSummaries.map(summary => {
//   //       if (summary.id === newSummary.id) {
//   //         return {
//   //           ...summary,
//   //           summary: 'Failed to retrieve summary'
//   //         };
//   //       }
//   //       return summary;
//   //     });

//   //     setSummaries(updatedSummariesWithError);
//   //     localStorage.setItem('guestSummaries', JSON.stringify(updatedSummariesWithError));
//   //   }
//   // };


//   const handleSubmitVideo = async (url: string) => {
//     if (!userId) return;

//     // Example for n8n workflow API request
//     try {
//       const response = await fetch('https://n8n-dev.subspace.money/webhook/summarize-youtube-video', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url }),
//       });

//       const data = await response.json();
//       console.log('n8n Workflow Response:', data);

//       // Update summaries (if response includes processed summary)
//       if (data.summary) {
//         const newSummary: VideoSummary = {
//           id: crypto.randomUUID(),
//           youtube_url: url,
//           summary: data.summary,
//           created_at: new Date().toISOString(),
//         };
//         setSummaries([newSummary, ...summaries]);
//       }
//     } catch (err) {
//       console.error('Error submitting video to n8n:', err);
//     }
//   };

//   return {
//     summaries,
//     handleSubmitVideo,
//   };
// }




import { useState } from 'react';
import { VideoSummary } from '../types';

export function useVideoSummaries(userId: string | undefined) {
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);

  const handleSubmitVideo = async (url: string) => {
    if (!userId) return;

    // Create a temporary summary for guest mode (only in state, not backend)
    const newSummary: VideoSummary = {
      id: crypto.randomUUID(),
      youtube_url: url,
      summary: 'Processing...', // Set it as 'Processing' while waiting for response
      created_at: new Date().toISOString()
    };

    const updatedSummaries = [newSummary, ...summaries];
    setSummaries(updatedSummaries);

    try {
      // Call n8n workflow to fetch transcription_id
      const response = await fetch('https://n8n-dev.subspace.money/webhook/summarize-youtube-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      // Check if transcription_id exists
      if (result.transcription_id) {
        const transcription_id = result.transcription_id;

        // Start polling the transcription status every second
        let isPolling = true;
        while (isPolling) {
          // Send GET request to check the transcription status
          const statusResponse = await fetch(`https://n8n-dev.subspace.money/webhook/youtube-summery-responce?transcription_id=${transcription_id}`);
          const statusResult = await statusResponse.json();

          if (statusResult.result === 'pending') {
            // Wait for 1 second before polling again
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else if (statusResult.error || !statusResult.summary) {
            // If there's an error or no summary, stop polling
            console.error('Failed to retrieve summary:', statusResult.error);
            isPolling = false;

            // Update summary with an error message
            const updatedSummariesWithError = updatedSummaries.map(summary => {
              if (summary.id === newSummary.id) {
                return {
                  ...summary,
                  summary: 'Failed to retrieve summary'
                };
              }
              return summary;
            });

            setSummaries(updatedSummariesWithError);
          } else {
            // If transcription is complete, update the summary with the result
            isPolling = false;
            const updatedSummariesWithSummary = updatedSummaries.map(summary => {
              if (summary.id === newSummary.id) {
                return {
                  ...summary,
                  summary: statusResult.summary || 'Summary not available'
                };
              }
              return summary;
            });

            setSummaries(updatedSummariesWithSummary);

            // Now insert the valid summary into the backend
            await insertSummaryIntoBackend(url, statusResult.summary || 'Summary not available');
          }
        }
      } else {
        // Handle case when transcription_id is not found
        throw new Error('Failed to get transcription_id');
      }
    } catch (error) {
      console.error('Error submitting video URL:', error);

      // Update summary if there was an error
      const updatedSummariesWithError = updatedSummaries.map(summary => {
        if (summary.id === newSummary.id) {
          return {
            ...summary,
            summary: 'Failed to retrieve summary'
          };
        }
        return summary;
      });

      setSummaries(updatedSummariesWithError);
    }
  };

  const insertSummaryIntoBackend = async (youtube_url: string, summary: string) => {
    try {
      const response = await fetch('https://your-backend-url.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddSummary($youtube_url: String!, $user_id: uuid!, $summary: String!) {
              insert_video_summaries(objects: { youtube_url: $youtube_url, user_id: $user_id, summary: $summary }) {
                returning {
                  id
                  youtube_url
                  created_at
                }
              }
            }
          `,
          variables: {
            youtube_url,
            user_id: userId,
            summary,
          },
        }),
      });

      const data = await response.json();
      console.log('Summary successfully added to backend:', data);
    } catch (err) {
      console.error('Error adding summary to backend:', err);
    }
  };

  return {
    summaries,
    handleSubmitVideo,
  };
}
