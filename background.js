// Track two designated windows by ID
let leftWindowId = null;
let rightWindowId = null;

function updateTargetWindows() {
  chrome.storage.sync.get(['leftWindowId', 'rightWindowId'], (data) => {
    leftWindowId = data.leftWindowId || null;
    rightWindowId = data.rightWindowId || null;
    console.log("Loaded target windows from storage:", leftWindowId, rightWindowId);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-left",
    title: "Open in Left Window",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "open-right",
    title: "Open in Right Window",
    contexts: ["link"]
  });

  // Load stored target windows on install
  updateTargetWindows();
});

// Load stored target windows when service worker starts
updateTargetWindows();

// Helper: Open in a known window by ID
function openInWindow(linkUrl, windowId) {
  if (windowId !== null) {
    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError) {
        console.error("Window not found:", windowId);
        // alert removed because not available in service worker
        return;
      }
      chrome.tabs.create({
        url: linkUrl,
        windowId: windowId
      });
    });
  } else {
    console.error("Target window ID not set.");
    // alert removed because not available in service worker
  }
}

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-left") {
    openInWindow(info.linkUrl, leftWindowId);
  }
  if (info.menuItemId === "open-right") {
    openInWindow(info.linkUrl, rightWindowId);
  }
});

// Listen for messages from popup.js to update target windows
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateTargetWindows") {
    updateTargetWindows();
  }
});
