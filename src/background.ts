let previousTabData = {}
const addTab = async (tabId: number) => {

  chrome.tabs.get(tabId).catch().then(tabData => {
    if (JSON.stringify(previousTabData) === JSON.stringify(tabData)) return; //just to prevent unnecessary uploads
    previousTabData = tabData;
    if (tabData.status === "complete" && tabData.url && tabData.active) {
      const origin = new URL(tabData.url).origin;
      if (new URL(tabData.url).host === "workona.com") return;

      fetch("https://cirex-dev-default-rtdb.firebaseio.com/history.json", {
        method: "POST",
        body: JSON.stringify({
          tabId: tabId,
          url: origin,
          title: tabData.title,
          favicon: tabData.favIconUrl,
          time: +new Date()

        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }
  });

}
chrome.tabs.onActivated.addListener((tab) => { addTab(tab.tabId) });
chrome.tabs.onUpdated.addListener(addTab);
chrome.windows.onFocusChanged.addListener(async windowId => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    const activeTabs = await chrome.tabs.query({ active: true, windowId });
    if (activeTabs.length > 0 && activeTabs[0].id) {
      addTab(activeTabs[0].id); //yeah it's kinda duplicated
    }
  }
})