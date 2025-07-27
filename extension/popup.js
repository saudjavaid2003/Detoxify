document.addEventListener('DOMContentLoaded', async () => {
  const userIdInput = document.getElementById('userId');
  const tokenInput = document.getElementById('token');
  const toggleSwitch = document.getElementById('toggleSwitch');
  const saveBtn = document.getElementById('save');

  // Load saved values
  const { userId, token, detoxifyEnabled } = await chrome.storage.local.get(['userId', 'token', 'detoxifyEnabled']);
  if (userId) userIdInput.value = userId;
  if (token) tokenInput.value = token;
  toggleSwitch.checked = detoxifyEnabled ?? true;

  // Save updated values
  saveBtn.addEventListener('click', async () => {
    const userId = userIdInput.value.trim();
    const token = tokenInput.value.trim();
    const detoxifyEnabled = toggleSwitch.checked;

    if (!userId || !token) {
      alert('Please enter both userId and token.');
      return;
    }

    await chrome.storage.local.set({ userId, token, detoxifyEnabled });
    alert('Saved successfully!');
  });
});
