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
      document.getElementById("INPUT_url").disabled = true;
      document.getElementById("INPUT_url").className = 'disabled';

      HOSTNAME = hostname;
    });
  }
  else {
    document.getElementById("INPUT_url").value = URL;
    document.getElementById("INPUT_url").disabled = false;
    document.getElementById("INPUT_url").className = '';

    HOSTNAME = undefined;
  }
}

function isChromeURL(url) {
  return url.startsWith('chrome');
}

// TODO can break up this method somehow so it's not 60 lines to have to read and work through
// maybe, isInputValid() -> addToBanlists() or smtn
function addSiteToBanlist() {
  // alert(URL)
  if (isChromeURL(document.getElementById("INPUT_url").value)) {
    alert(`Chrome browser pages* will not be blocked.\n
    The user shouldn't lose access to important browser functionality.\n\n
    * = URLs that start with "chrome"`);

    return;
  }

  // Else, URL is not a Chrome/browser page, so add the site, then PorNo (lmao how porNo from here?)
  // chrome.storage.sync.get specific sites map
  chrome.storage.sync.get(`userBanlists`, function(returnedObject) {
    let userBanlistsMap = returnedObject[`userBanlists`];
    if (userBanlistsMap === undefined) {
      // if map does not exist, create empty map ... here? not in linkManager.js?? ANSWER: should create only when SET is called
      userBanlistsMap = {};
    }

    let urlFromInput = document.getElementById("INPUT_url").value;

    if (HOSTNAME === undefined) {
      // alert('ADDING site to the SPECIFIC Sites Map');
      userBanlistsMap[urlFromInput] = !0;
    }
    else {
      // alert('ADDING site to the ENTIRE Sites List');
      let listOfEntireSites = userBanlistsMap['listOfEntireSites'];
      if (listOfEntireSites === undefined) {
        listOfEntireSites = [];
      }

      // todo refactor isSiteAlreadyInBanlist
      if (listOfEntireSites.includes(HOSTNAME)) { 
        let feedback = document.getElementById(`feedbackForAddButton`);
        feedback.innerText = `${HOSTNAME} already in banlist.`;
        return; 
      }

      listOfEntireSites.push(HOSTNAME);
      userBanlistsMap['listOfEntireSites'] = listOfEntireSites;
    }

    try {
      chrome.storage.sync.set({ userBanlists: userBanlistsMap }, function() {
        // TODO add visual indicator (under or above the ADD button? or smth else?) that the item was saved to the appropriate list (SPECIFIC/ENTIRE)
        let feedback = document.getElementById(`feedbackForAddButton`);
        let siteToShow = HOSTNAME ? HOSTNAME : urlFromInput;
        feedback.style.color = 'green';
        feedback.innerText = `Successfully added\n${siteToShow}`;

        setTimeout(() => {
          let url = chrome.runtime.getURL('banlistViewer.html');

          // https://stackoverflow.com/questions/1891738
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, { url: url });
          });

          }, 1000); // 1 second

      });
    } catch (e) {
      let feedback = document.getElementById(`feedbackForAddButton`);
      feedback.innerText = `Error with data sync. Please try again after a minute.\n(From banlistPopupLogic)`;
    }
  });

    /* 
      Can use one object to save on get/set calls, but really my interest is
      less lines of code for me to deal with and look at HA
      userBanlists {
        specificSite1 : true,
        specificSite2 : true,
        ...,
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
