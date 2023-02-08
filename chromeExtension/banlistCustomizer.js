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

  // Find & remove "?"
  hostname = hostname.split('?')[0];

  // Thank you, https://github.com/mrvivacious/PorNo-_public/blob/master/porNo.js#L194
  // If there is a www. header, remove it
  if (hostname.includes('www.')) {
    let idxOfPeriod = hostname.indexOf('.');
    hostname = hostname.substring(idxOfPeriod + 1, hostname.length);
  }

  return hostname;
}

function toggleURL() {
  // alert("slider clicked");

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


  // document.getElementById("INPUT_url").value = getHostnameFromURL();


  // fillInputWithURLHostname();

}

let URL = undefined;
let HOSTNAME = undefined;

window.onload = () => {
  fillInputWithCurrentURL();

  let inputSlider = document.getElementById('INPUT_slider')
  inputSlider.addEventListener('click', toggleURL);
}

// chrome.storage.sync.set(
//     { 
//         customBanlistByExactURL: {"https://www.yahoo.com/": !0} 
//     }, 
//     function () {}
// );
