document.addEventListener('DOMContentLoaded', () => {
  const leftSelect = document.getElementById('leftWindow');
  const rightSelect = document.getElementById('rightWindow');
  const saveBtn = document.getElementById('saveBtn');

  // Populate window dropdowns with open windows
  function populateWindows() {
    chrome.windows.getAll({}, (windows) => {
      leftSelect.innerHTML = '';
      rightSelect.innerHTML = '';
      windows.forEach(win => {
        const optionLeft = document.createElement('option');
        optionLeft.value = win.id;
        optionLeft.textContent = `Window ${win.id} (${win.type})`;
        leftSelect.appendChild(optionLeft);

        const optionRight = document.createElement('option');
        optionRight.value = win.id;
        optionRight.textContent = `Window ${win.id} (${win.type})`;
        rightSelect.appendChild(optionRight);
      });

      // Load saved selections
      chrome.storage.sync.get(['leftWindowId', 'rightWindowId'], (data) => {
        if (data.leftWindowId) {
          leftSelect.value = data.leftWindowId;
        }
        if (data.rightWindowId) {
          rightSelect.value = data.rightWindowId;
        }
      });
    });
  }

  saveBtn.addEventListener('click', () => {
    const leftWindowId = parseInt(leftSelect.value);
    const rightWindowId = parseInt(rightSelect.value);

    if (leftWindowId === rightWindowId) {
      alert('Left and Right windows must be different.');
      return;
    }

    // Save selections to storage
    chrome.storage.sync.set({ leftWindowId, rightWindowId }, () => {
      alert('Window selections saved.');
      // Notify background to update target windows
      chrome.runtime.sendMessage({ action: 'updateTargetWindows' });
    });
  });

  populateWindows();
});
