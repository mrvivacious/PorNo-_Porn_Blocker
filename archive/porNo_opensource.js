// PorNo!
// Home-made open source porn filtering algorithm
// 1. Does the url match a porn site url from our hardcoded list? PorNo!
// 2. Else, does the url contain enough porn keywords? If yes, check with IBM API, then
//  PorNo! should IBM return true for pornographic nature
// This file uses chrome.storage to illustrate how to dynamically capture porn sites
//  not hardcoded in the file -- any other type of DB can be used, Chrome is just
//  an example

// FUNCTION LIST:
// isBannedURL - Compares URL to porn links hardcoded
// isBannedSavedLinks - Compares URL to porn links saved in storage
// checkURL - Helper function that handles URL evaluation
// evaluateWords - Counts adult-y words in the url (top-tier NLP, thank you thank you)
// checkTitle - Counts adult-y words in the page title (Supreme NLP)
// checkWithIBM - (Deprecated, issue 2) Passes URL to IBM XFORCE API for a more formal evaluation of the URL's nature
// store - Save the URL determined to be pornographic by IBM to storage (dynamic capture)
// porNo - Response behavior for when the site visited is pornographic

// pornMap and bannedWordsList are found in lists.js to help make this file more readable
// Please ensure those structures are copied over correctly ~

// ROUTE LOCALSTORAGE (Contains links saved in storage )
chrome.storage.local.get("linksInStorage", function(returnValue) {
  let savedLinks = returnValue.linksInStorage;

  // console.log(savedLinks);
  // If the url is a porn site, PorNo!
  if (isBannedSavedLinks(savedLinks) && window.location.hostname !== 'console.firebase.google.com' && window.location.hostname !== 'www.google.com') {
    PorNo();
  }
  // Else, check if the url has four or more "banned words"
  // Four because there are four inner planets in our solar system
  // jk I don't have a better system for checking these links faster than the page
  //  can load
  else {
    checkURL();
  }
});

// ROUTE HARDCODED ( FASTER but does not contain links saved in storage )
// If the url is a porn site, PorNo!
if (isBannedURL() && window.location.hostname !== 'console.firebase.google.com' && window.location.hostname !== 'www.google.com') {
  PorNo();
}
else {
  checkTitle();
}

// If the database route fails, then we check our url to see if we need to call
//  the IBM api
function checkURL() {
//   No more IBM -- see issue 2
//   if (evaluateWords()) {
//     checkWithIBM();
//   }
  checkTitle();
}

// Function PorNo()
// TODO: Implement actions to take after site has successfully been established as a
//  porn site
function PorNo() {
  // Add your desired behavior here!
  // Example: window.stop(); window.location.href = 'https://google.com';
}

// Function evaluateWords()
// Goes through bannedWordsList and counts the number of banned words
//  in the current window's url
function evaluateWords() {
  let counter = 0;

  let url = window.location.href;
  url = url.toLowerCase();

  // Remove "url buffers" for easier parsing
  while (url.indexOf('-') != -1) {
    url = url.replace('-', ' ');
  }
  while (url.indexOf('+') != -1) {
    url = url.replace('+', ' ');
  }

  // tfw 12000~ array size
  // console.log(url);
  // console.log('evaluateWords() -- List of keywords:');
  for (let i = 0; i < bannedWordsList.length; i++) {
    if (url.includes(bannedWordsList[i].toLowerCase())) {
      // console.log(bannedWordsList[i]);
      counter++;
    }
    // >= instead of === because I don't know how async works and I don't want async
    //  to increment counter from four to five+ too fast
    // Four because it seems like a good enough number (first name, last name, two+
    //  words describing a video should add up to at least 4 keywords generally)
    if (counter >= 4) {
      return true;
    }
  }

  // If we reach here, counter is < 4
  return false;
}

// Function checkTitle()
// Evaluates the title of the current page for porn clues
// Usually a better indicator than the URL (less false positives)
function checkTitle() {
  $(document).ready(function () {
    let title = document.title.toLowerCase();
    let ctr = 0;

    for (let i = 0; i < bannedWordsList.length; i++) {
      if (title.includes(bannedWordsList[i])) {
        ctr++;
      }
    }
    // Moment of silence for IBM XFORCE
    // RIP
    // Here comes some fresh NLP, title analysis
    // 3 because fun
    if (ctr >= 3) {
      store(window.location.hostname);
    }
  });
}

// Function store()
// When a domain is determined to be adult in nature, this function saves the domain name
// @param url URL of site determined as adult in nature
function store(url) {
  // If there is a www. header, remove it
  if (url.includes('www.')) {
    let idxOfPeriod = url.indexOf('.');
    url = url.substring(idxOfPeriod + 1, url.length);
  }

  // Update local storage list
  chrome.storage.local.get("linksInStorage", function(returnValue) {
    let urls = returnValue.linksInStorage;
    urls.push(url);

    chrome.storage.local.set({linksInStorage:urls}, function() {});
  });
}

// Function isBannedSavedLinks
// Extract the domain name from the inputted url and check if the input's
//  domain name is a porn site domain
// @param linksFromStorage The sites to check with
function isBannedSavedLinks(linksFromStorage) {
  // Header(s) removed so that we can find the correct period to substring to
  //  in order to collect only the domain name
  let url = window.location.href;
  url = url.toLowerCase();

  if (!url.includes('fightthenewdrug') && !url.includes('github') ) {
    // O(n) worst case feels bad but whO(l)esome porn-checker feels good
    for (let i = 0; i < linksFromStorage.length; i++) {
      if (url.includes(linksFromStorage[i].toLowerCase())) {
        // GTFOOOO
        return true;
      }
    }
  }

  // Inconclusive
  return false;
}

// Function isBannedURL
// Evaluate if the current URL is a porn url by comparing it with our array of
//  urls
function isBannedURL() {
  // Header(s) removed so that we can find the correct period to substring to
  //  in order to collect only the domain name
  let url = window.location.href;
  url = url.toLowerCase();
	
  // O(1) and whO(l)esome
  if (!url.includes('fightthenewdrug') && !url.includes('github') ) {
    if (pornMap[url]) {
      window.stop();
      return true;
    }
  }

//   Old method of detection
//   if (!url.includes('fightthenewdrug') && !url.includes('github') ) {
//     // O(n) worst case feels bad but whO(l)esome porn-checker feels good
//     // $$$$$ B R U T E  F O R C E $$$$$
//     for (let i = 0; i < bannedLinks.length; i++) {
//       if (url.includes(bannedLinks[i].toLowerCase())) {
//         // GTFOOOO
//         return true;
//       }
//     }
//   }

  // Inconclusive
  return false;
}

// DOES NOT WORK -- SEE ISSUE 2
// Function checkWithIBM()
// When a url seems to be adult-y in nature, we check the site's nature with
//  the IBM XFORCE API
// This allows some peace of mind in regards to the "What happens when a
//  user visits a site not hardcoded?" situation
function checkWithIBM() {
  let url = window.location.hostname;
  let api = 'https://api.xforce.ibmcloud.com/url/' + url;

  // Too slow -- some websites load before PorNo! executes
  // $.getJSON(api, function(data) {
  //   if (data.result.cats.Pornography) {
  //     alert('PorNo!');
  //     PorNo();
  //   }
  // });

  // The "Vanilla JS" version of $.getJSON(), but with async turned off ('GET', api, false)
  // This allows us to delay website load by just a teeny bit (hopefully teeny) enough
  //  to get to PorNo! if needed
  // Thank you, http://youmightnotneedjquery.com/#json
  var request = new XMLHttpRequest();
  request.open('GET', api, false);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      if (data.result.cats.Pornography) {
        // Run desired response to visitng porn site then save the domain
        PorNo();
        store(url);
      }
    }
    else {
      // We received an error from the api!
      // console.log('Uh oh spaghetti o');
    }
  };

  request.onerror = function() {
    // There was another error, not from the api,
    // alert('Error');
  };
  request.send();
}
