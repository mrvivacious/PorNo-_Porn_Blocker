function fillInputWithCurrentURL() {
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    let url = tabs[0].url;
    document.getElementById("INPUT_url").value = url;
    URL = url;
  });
}

function getHostnameFromURL(url) {
  let hostname;

  // Find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    // Split into ['https:', '', 'hostnameBeforePath']
    // [2] grabs the 'hostnameBeforePath'
    hostname = url.split('/')[2];
  }
  else {
    // Otherwise, split the hostname and path and save the hostname
    hostname = url.split('/')[0];
  }

  // Find & remove port number
  hostname = hostname.split(':')[0];

  // Find & remove "?" from path queries
  hostname = hostname.split('?')[0];

  // If there is a www. header, remove it
  if (hostname.includes('www.')) {
    let idxOfPeriod = hostname.indexOf('.');
    hostname = hostname.substring(idxOfPeriod + 1, hostname.length);
  }

  return hostname;
}

function toggleURL() {
  if (HOSTNAME === undefined) {
    chrome.tabs.query({
      'active': true,
      'currentWindow': true
    }, function (tabs) {
      let url = tabs[0].url;
      let hostname = getHostnameFromURL(url)
      document.getElementById("INPUT_url").value = hostname;
      HOSTNAME = hostname;
    });
  }
  else {
    document.getElementById("INPUT_url").value = URL;
    HOSTNAME = undefined;
  }
}

function isChromeURL(url) {
  return url.startsWith('chrome');
}

function addSiteToBanlist() {
  // alert(URL)
  if (isChromeURL(URL)) {
    alert(`Chrome browser pages* will not be blocked.\n
    The user shouldn't lose access to important browser functionality.\n\n
    * = URLs that start with "chrome"`);

    return;
  }

  // Else, URL is not a Chrome/browser page, so add the site.
  // chrome.storage.sync.get specific sites map
  chrome.storage.sync.get(`userBanlists`, function(returnedObject) {
    let userBanlistsMap = returnedObject[`userBanlists`];

    if (userBanlistsMap === undefined) {
      // if map does not exist, create empty map ... here? not in linkManager.js??

      userBanlistsMap = {};
    }

    // else map exists, so map[URL] = true (or !0)

    if (HOSTNAME === undefined) {
      alert('add this site to the Specific Sites Map');
      userBanlistsMap[URL] = !0;
    }
    else {
      alert('add this site to the Entire Sites List');

    }

    // chrome.storage.sync.set map with the map we just made
    chrome.storage.sync.set({
      userBanlists: userBanlistsMap
    }, function() {alert('site added to Specific Sites!')});
  });

    /* 
      Can use one object to save on get/set calls, but really my interest is
      less lines of code for me to deal with and look at HA
      userBanlists {
        specificSite1 : true,
        specificSite2 : true,
        specificSite3 : !0,

        generalSites : [domain1, domain2, domain3, domain4]
      }
    */
}

let URL = undefined;
let HOSTNAME = undefined;

window.onload = () => {
  fillInputWithCurrentURL();

  let inputSlider = document.getElementById('INPUT_slider')
  inputSlider.addEventListener('click', toggleURL);

  let addButton = document.getElementById('BUTTON_addToBanlist')
  addButton.addEventListener('click', addSiteToBanlist)
}
