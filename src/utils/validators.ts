export function isValidYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if it's a valid YouTube domain
    if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(hostname)) {
      return false;
    }

    // Check for video ID in different URL formats
    if (hostname === 'youtu.be') {
      return urlObj.pathname.length > 1; // Should have content after '/'
    } else {
      const videoId = urlObj.searchParams.get('v');
      return !!videoId && videoId.length > 0;
    }
  } catch {
    return false;
  }
}

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  // Common error patterns
  if (error.message?.includes('no audio')) {
    return 'This video has no audio content to transcribe. Please try a different video.';
  }
  if (error.message?.includes('too long')) {
    return 'This video is too long. Please try a video under 30 minutes.';
  }
  if (error.message?.includes('unavailable') || error.message?.includes('deleted')) {
    return 'This video is no longer available or has been deleted.';
  }
  if (error.message?.includes('private')) {
    return 'This video is private or requires authentication.';
  }
  
  return 'An unexpected error occurred. Please try again later.';
}