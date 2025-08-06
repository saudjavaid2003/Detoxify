(async () => {
  // 1. Configuration and Initial Checks
  const { userId, token, detoxifyEnabled } = await chrome.storage.local.get([
    'userId', 'token', 'detoxifyEnabled'
  ]);

  if (!userId || !token || !detoxifyEnabled) {
    return console.log("Detoxify: Disabled or missing credentials");
  }

  // 2. Fetch Interests (now using HTTP)
  let interests = [];
  try {
    const response = await fetch('http://localhost:5000/api/user/interests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    interests = (await response.json()).interests || [];
    if (!interests.length) return;
  } catch (error) {
    console.error("Detoxify: Failed to fetch interests", error);
    return;
  }

  // 3. Filter Logic
  const filterVideos = () => {
    const container = document.querySelector('ytd-rich-grid-renderer');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('ytd-rich-item-renderer'));
    if (cards.length === 0) return;

    let visibleCount = 0;

    cards.forEach(card => {
      card.style.display = 'none';
    });

    cards.forEach(card => {
      const titleElement = card.querySelector('#video-title');
      const title = titleElement?.textContent?.toLowerCase() || '';

      const shouldShow = interests.some(interest =>
        title.includes(interest.toLowerCase())
      );

      if (shouldShow) {
        card.style.display = '';
        visibleCount++;
      }
    });

    console.log(`Detoxify: Showing ${visibleCount} matching videos`);

    if (visibleCount === 0) {
      const message = document.createElement('div');
      message.textContent = 'No videos match your current interests.';
      message.style.cssText = `
        color: #fff;
        padding: 20px;
        text-align: center;
        font-size: 1.2rem;
        width: 100%;
      `;
      container.prepend(message);
    }
  };

  // 4. Mutation Observer
  let isFiltering = false;
  const observer = new MutationObserver(() => {
    if (isFiltering) return;
    isFiltering = true;
    setTimeout(() => {
      filterVideos();
      isFiltering = false;
    }, 1000);
  });

  // 5. Initialize
  const initialize = () => {
    if (window.location.href.includes('/watch')) return;
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(filterVideos, 3000);
  };

  if (document.readyState === 'complete') {
    initialize();
  } else {
    window.addEventListener('load', initialize);
  }

  window.addEventListener('yt-navigate-finish', initialize);
})();
