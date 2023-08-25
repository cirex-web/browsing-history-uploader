
const addTab = async (tabId: number) => {
  const tabData = await chrome.tabs.get(tabId);
  if (tabData.status === "complete" && tabData.url && tabData.active) {

    console.log(tabData.url, tabData.title);
    fetch("https://cirex-dev-default-rtdb.firebaseio.com/history.json", {
      method: "POST",
      body: JSON.stringify({
        tabId: tabId,
        url: new URL(tabData.url).origin,
        title: tabData.title,
        favicon: tabData.favIconUrl,
        time: +new Date()

      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }
}
chrome.tabs.onActivated.addListener((tab) => addTab(tab.tabId));
chrome.tabs.onUpdated.addListener(addTab);