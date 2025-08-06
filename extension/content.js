(async () => {
  // Get user settings from storage
  const { userId, token, trackingEnabled } = await chrome.storage.local.get([
    'userId', 'token', 'trackingEnabled'
  ]);

  if (!userId || !token || !trackingEnabled) {
    return console.log("YouTube Tracker: Disabled or missing credentials");
  }

  // Track video views
  const trackVideoView = async (videoTitle, videoUrl) => {
    try {
      const response = await fetch('http://localhost:5000/api/tracking/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoTitle,
          videoUrl,
          timeSpent: 0 // Will be updated when user leaves the video
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to log video');
      }
      
      console.log('YouTube Tracker: Video view logged');
    } catch (error) {
      console.error('YouTube Tracker: Error logging video', error);
    }
  };

  // Update time spent when leaving video
  const updateTimeSpent = async (videoTitle, videoUrl, timeSpent) => {
    try {
      const response = await fetch('http://localhost:5000/api/tracking/update-time', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoTitle,
          videoUrl,
          timeSpent
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update time spent');
      }
      
      console.log('YouTube Tracker: Time spent updated');
    } catch (error) {
      console.error('YouTube Tracker: Error updating time', error);
    }
  };

  // Handle video page
  if (window.location.href.includes('/watch')) {
    const videoTitle = document.querySelector('h1.title yt-formatted-string')?.textContent;
    const videoUrl = window.location.href.split('&')[0]; // Clean URL
    
    if (videoTitle && videoUrl) {
      // Initial log when video loads
      await trackVideoView(videoTitle, videoUrl);
      
      // Track time when leaving the video
      let startTime = Date.now();
      window.addEventListener('beforeunload', () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // in minutes
        updateTimeSpent(videoTitle, videoUrl, timeSpent);
      });
    }
  }

  // Filter homepage based on interests (optional)
  const filterHomepage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/interests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { interests } = await response.json();
      
      if (!interests?.length) return;
      
      const container = document.querySelector('ytd-rich-grid-renderer');
      if (!container) return;
      
      const cards = Array.from(container.querySelectorAll('ytd-rich-item-renderer'));
      if (!cards.length) return;
      
      cards.forEach(card => {
        const title = card.querySelector('#video-title')?.textContent?.toLowerCase() || '';
        const shouldShow = interests.some(interest => 
          title.includes(interest.toLowerCase())
        );
        
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) {
          card.style.outline = '2px solid #3b82f6';
          card.style.borderRadius = '8px';
        }
      });
    } catch (error) {
      console.error('YouTube Tracker: Error filtering homepage', error);
    }
  };

  // Initialize homepage filtering
  if (!window.location.href.includes('/watch')) {
    const observer = new MutationObserver(() => {
      filterHomepage();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(filterHomepage, 3000);
  }
})();