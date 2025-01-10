// import { useState, useEffect } from 'react';
// import { gql, GraphQLClient } from 'graphql-request';
// import { VideoSummary } from '../types';

// const nhostGraphQLClient = new GraphQLClient(import.meta.env.VITE_NHOST_URL, {
//   headers: {
//     'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET,
//   },
// });

// const GET_SUMMARIES = gql`
//   query GetSummaries($user_id: uuid!) {
//     video_summaries(where: { user_id: { _eq: $user_id } }) {
//       id
//       youtube_url
//       summary
//       created_at
//     }
//   }
// `;

// const ADD_SUMMARY = gql`
//   mutation AddSummary($youtube_url: String!, $user_id: uuid!) {
//     insert_video_summaries(objects: { youtube_url: $youtube_url, user_id: $user_id }) {
//       returning {
//         id
//         youtube_url
//         created_at
//       }
//     }
//   }
// `;

// export function useUserSummaries(userId: string | undefined) {
//   const [summaries, setSummaries] = useState<VideoSummary[]>([]);

//   useEffect(() => {
//     if (userId) {
//       const fetchSummaries = async () => {
//         try {
//           const data = await nhostGraphQLClient.request(GET_SUMMARIES, { user_id: userId });
//           setSummaries(data.video_summaries);
//         } catch (err) {
//           console.error('Error fetching summaries:', err);
//         }
//       };

//       fetchSummaries();
//     }
//   }, [userId]);

//   const handleSubmitVideo = async (url: string) => {
//     if (!userId) return;

//     try {
//       const { insert_video_summaries } = await nhostGraphQLClient.request(ADD_SUMMARY, {
//         youtube_url: url,
//         user_id: userId,
//       });
//       const newSummary = insert_video_summaries.returning[0];
//       setSummaries([newSummary, ...summaries]);
//     } catch (err) {
//       console.error('Error adding summary:', err);
//     }
//   };

//   return {
//     summaries,
//     handleSubmitVideo,
//   };
// }



import { useState, useEffect } from 'react';
import { gql, GraphQLClient } from 'graphql-request';
import { VideoSummary } from '../types';

// Nhost GraphQL Client for backend communication
const nhostGraphQLClient = new GraphQLClient(import.meta.env.VITE_NHOST_URL, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
  },
});

const GET_SUMMARIES = gql`
  query GetSummaries($user_id: uuid!) {
    video_summaries(where: { user_id: { _eq: $user_id } }) {
      id
      youtube_url
      summary
      created_at
    }
  }
`;

const ADD_SUMMARY = gql`
  mutation AddSummary($youtube_url: String!, $user_id: uuid!, $summary: String!) {
    insert_video_summaries(objects: { youtube_url: $youtube_url, user_id: $user_id, summary: $summary }) {
      returning {
        id
        youtube_url
        created_at
      }
    }
  }
`;

export function useUserSummaries(userId: string | undefined) {
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);

  useEffect(() => {
    if (userId) {
      const fetchSummaries = async () => {
        try {
          const data = await nhostGraphQLClient.request(GET_SUMMARIES, { user_id: userId });
          setSummaries(data.video_summaries);
        } catch (err) {
          console.error('Error fetching summaries:', err);
        }
      };

      fetchSummaries();
    }
  }, [userId]);

  const handleSubmitVideo = async (url: string) => {
    if (!userId) return;

    // Create a temporary summary entry
    const newSummary: VideoSummary = {
      id: crypto.randomUUID(),
      youtube_url: url,
      summary: 'Processing...', // Set as 'Processing' until n8n response
      created_at: new Date().toISOString(),
    };

    const updatedSummaries = [newSummary, ...summaries];
    setSummaries(updatedSummaries);

    try {
      // Send request to n8n workflow to get transcription ID
      const response = await fetch('https://n8n-dev.subspace.money/webhook/summarize-youtube-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ url })
      });

      const result = await response.json();

      if (result.transcription_id) {
        const transcription_id = result.transcription_id;

        let isPolling = true;
        while (isPolling) {
          const statusResponse = await fetch(
            `https://n8n-dev.subspace.money/webhook/youtube-summery-responce?transcription_id=${transcription_id}`
          );
          const statusResult = await statusResponse.json();

          if (statusResult.result === 'pending') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every second
          } else if (statusResult.error || !statusResult.summary) {
            console.error('Failed to retrieve summary:', statusResult.error);
            isPolling = false;

            // Update state with error message
            const updatedWithError = updatedSummaries.map(summary => {
              if (summary.id === newSummary.id) {
                return { ...summary, summary: 'Failed to retrieve summary' };
              }
              return summary;
            });
            setSummaries(updatedWithError);
          } else {
            isPolling = false;

            // Update state with the final summary
            const updatedWithSummary = updatedSummaries.map(summary => {
              if (summary.id === newSummary.id) {
                return { ...summary, summary: statusResult.summary || 'Summary not available' };
              }
              return summary;
            });
            setSummaries(updatedWithSummary);

            // Now insert the summary into the backend
            await insertSummaryIntoBackend(url, statusResult.summary || 'Summary not available');
          }
        }
      } else {
        throw new Error('Failed to get transcription_id');
      }
    } catch (error) {
      console.error('Error submitting video URL:', error);

      // Handle error by updating state
      const updatedWithError = updatedSummaries.map(summary => {
        if (summary.id === newSummary.id) {
          return { ...summary, summary: 'Failed to retrieve summary' };
        }
        return summary;
      });
      setSummaries(updatedWithError);
    }
  };

  const insertSummaryIntoBackend = async (youtube_url: string, summary: string) => {
    try {
      const { insert_video_summaries } = await nhostGraphQLClient.request(ADD_SUMMARY, {
        youtube_url,
        user_id: userId,
        summary,
      });

      const newSummary = insert_video_summaries.returning[0];
      console.log('Summary successfully added to backend:', newSummary);
    } catch (err) {
      console.error('Error adding summary to backend:', err);
    }
  };

  return {
    summaries,
    handleSubmitVideo,
  };
}
