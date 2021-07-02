// PorNo!
// @author Vivek Bhookya
// My home-made porn filtering algorithm
// 1. Does the url match a recognized porn site url? PorNo!
// 2. Else, does the url contain enough porn keywords? Check w API, then maybe
//  PorNo!
// 3. Else, carry on!
// https://stackoverflow.com/questions/18242527/stop-a-web-page-from-loading-until-a-jquery-ajax-call-completes
// Is it possible to collect the links from storage, then have them in a kind of "permanent cache"?
//  This would help with adding links dynamically without releasing an update. storage.local.get takes too long
//  to retrieve values, contrary to what I believed....

let links = [];
let size = -1;
let counter = 0;
let safeSearch = "&safe=active";
let defaultLink = "https://github.com/mrvivacious/PorNo-_Porn_Blocker";
// 'https://fiftyshadesoflove.org/#connection'

// Let's go
main();

// Function main()
// Evaluates current site for ban status
function main() {
  let location = window.location;
  let href = window.location.href;

  if (isUnsafeGoogleSearch(href)) {
    window.location.href = location + safeSearch;
    return;
  }

  // ROUTE LOCALSTORAGE ( [ideally is] MOST UP TO DATE )
  chrome.storage.local.get("realtimeBannedLinks", function (returnValue) {
    let firebaseLinks = returnValue.realtimeBannedLinks;
    let hostname = location.hostname;

    // console.log(firebaseLinks);
    // If the url is a porn site, PorNo!
    if (
      isBannedFirebase(firebaseLinks) &&
      location.hostname !== "console.firebase.google.com" &&
      location.hostname !== "www.google.com"
    ) {
      if (
        hostname.includes("google") ||
        hostname.includes("gmail") ||
        hostname.includes("youtube") ||
        hostname.includes("amazon") ||
        hostname.includes("instagram") ||
        hostname.includes("is.muni.cs") ||
        hostname.includes("virtual-addiction")
      ) {
        return;
      } else {
        PorNo();
      }
    }
    // Else, if the url has four or more "banned words",
    //  check the url's category through the IBM XFORCE API
    // Four because there are four inner planets in our solar system
    // jk I don't have a better system for checking these links faster than the page
    //  can load
    else {
      // checkURL(); commented out because this function is empty atm
    }
  });

  // ROUTE HARDCODED ( FASTER but does not contain latest links )
  // If the url is a porn site, PorNo!
  if (
    isBannedURL() &&
    window.location.hostname !== "console.firebase.google.com" &&
    window.location.hostname !== "www.google.com"
  ) {
    let hostname = window.location.hostname;

    if (
      hostname.includes("google") ||
      hostname.includes("gmail") ||
      hostname.includes("youtube") ||
      hostname.includes("amazon") ||
      hostname.includes("instagram") ||
      hostname.includes("is.muni.cs") ||
      hostname.includes("virtual-addiction")
    ) {
      return;
    } else {
      // todo: if url contains 'reddit', regex the url (check with pathname or smth)
      PorNo();
    }
  }
}

// If our local route fails, the database route will still be checked.
// This is because local will finish before the database (due to the storage.local.get)
// If the database route fails, then we check our url to see if we need to call
//  the IBM api
function checkURL() {
  // if (evaluateWords()) { // rip ibm
  //   checkWithIBM();
  // }
  // checkTitle();
}

// Function PorNo()
// Adds links from storage to our links array so that
// openLink() can select a random wholesome link to fill the user's window with
function PorNo() {
  window.stop();

  // Get all/no urls currently in storage
  chrome.storage.sync.get(null, function (items) {
    urls = Object.keys(items);
    size = urls.length;

    // If urls[0] is undefined (aka nothing exists in storage), open
    //  the default link
    if (urls[0] !== undefined) {
      // Iterate through the urls array
      //  and add the urls to our links list to select from
      for (let i = 0; urls[i] !== undefined; i++) {
        links.push(urls[i]);
      }

      openLink();
    }
    else {
      // When your wholesome list is empty, redirect to quality education
      window.location.href = defaultLink;
    }
  });
}

// Function openLink()
// Redirects users to a random website from their wholesome sites lists
// Runs only after links[] is fully filled with the links from storage
function openLink() {
  // Selecting a random link
  let linkIndex = Math.floor(Math.random() * links.length);
  let linkToOpen = links[linkIndex];
  // Open within same window
  window.location.href = linkToOpen;
}

// Function evaluateWords()
// Goes through bannedWordsList and counts the number of banned words
//  in the current window's url
function evaluateWords() {
  let counter = 0;

  let url = window.location.href.toLowerCase();

  // Remove all "url buffers" for easier parsing
  while (url.indexOf("-") != -1) {
    url = url.replace("-", " ");
  }
  while (url.indexOf("+") != -1) {
    url = url.replace("+", " ");
  }

  // mfw 12000~ array size
  // console.log(url);
  // console.log('evaluateWords() -- List of keywords:');
  for (let i = 0; i < bannedWordsList.length; i++) {
    if (url.includes(bannedWordsList[i].toLowerCase())) {
      // console.log(bannedWordsList[i]);
      counter++;
    }
    // >== because I don't know how async works and I don't want async
    //  to increment counter from four to five+ too fast
    if (counter >= 4) {
      return true;
    }
  }

  // If we reach here, counter is < 4
  return false;
}

// Function checkTitle()
// Evaluates the title of the current page for porn clues
// NOT a better indicator than the URL (don't use!)
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

function store(url) {
  // If there is a www. header, remove it
  if (url.includes("www.")) {
    let idxOfPeriod = url.indexOf(".");
    url = url.substring(idxOfPeriod + 1, url.length);
  }

  // Begin database process
  chrome.storage.local.set(
    {
      [url]: url,
    },
    function () {}
  );

  // Meanwhile, update local storage list
  chrome.storage.local.get("realtimeBannedLinks", function (returnValue) {
    let urls = returnValue.realtimeBannedLinks;
    urls.push(url);

    chrome.storage.local.set(
      {
        realtimeBannedLinks: urls,
      },
      function () {}
    );
  });
}

//                                                                                                                                    dddddddd
//    iiii                   BBBBBBBBBBBBBBBBB                                                                                        d::::::d     ((((((  ))))))
//   i::::i                  B::::::::::::::::B                                                                                       d::::::d   ((::::::()::::::))
//    iiii                   B::::::BBBBBB:::::B                                                                                      d::::::d ((:::::::(  ):::::::))
//                           BB:::::B     B:::::B                                                                                     d:::::d (:::::::((    )):::::::)
//  iiiiiii     ssssssssss     B::::B     B:::::B  aaaaaaaaaaaaa  nnnn  nnnnnnnn    nnnn  nnnnnnnn        eeeeeeeeeeee        ddddddddd:::::d (::::::(        )::::::)
//  i:::::i   ss::::::::::s    B::::B     B:::::B  a::::::::::::a n:::nn::::::::nn  n:::nn::::::::nn    ee::::::::::::ee    dd::::::::::::::d (:::::(          ):::::)
//   i::::i ss:::::::::::::s   B::::BBBBBB:::::B   aaaaaaaaa:::::an::::::::::::::nn n::::::::::::::nn  e::::::eeeee:::::ee d::::::::::::::::d (:::::(          ):::::)
//   i::::i s::::::ssss:::::s  B:::::::::::::BB             a::::ann:::::::::::::::nnn:::::::::::::::ne::::::e     e:::::ed:::::::ddddd:::::d (:::::(          ):::::)
//   i::::i  s:::::s  ssssss   B::::BBBBBB:::::B     aaaaaaa:::::a  n:::::nnnn:::::n  n:::::nnnn:::::ne:::::::eeeee::::::ed::::::d    d:::::d (:::::(          ):::::)
//   i::::i    s::::::s        B::::B     B:::::B  aa::::::::::::a  n::::n    n::::n  n::::n    n::::ne:::::::::::::::::e d:::::d     d:::::d (:::::(          ):::::)
//   i::::i       s::::::s     B::::B     B:::::B a::::aaaa::::::a  n::::n    n::::n  n::::n    n::::ne::::::eeeeeeeeeee  d:::::d     d:::::d (:::::(          ):::::)
//   i::::i ssssss   s:::::s   B::::B     B:::::Ba::::a    a:::::a  n::::n    n::::n  n::::n    n::::ne:::::::e           d:::::d     d:::::d (::::::(        )::::::)
//  i::::::is:::::ssss::::::sBB:::::BBBBBB::::::Ba::::a    a:::::a  n::::n    n::::n  n::::n    n::::ne::::::::e          d::::::ddddd::::::dd(:::::::((    )):::::::)
//  i::::::is::::::::::::::s B:::::::::::::::::B a:::::aaaa::::::a  n::::n    n::::n  n::::n    n::::n e::::::::eeeeeeee   d:::::::::::::::::d ((:::::::(  ):::::::))
//  i::::::i s:::::::::::ss  B::::::::::::::::B   a::::::::::aa:::a n::::n    n::::n  n::::n    n::::n  ee:::::::::::::e    d:::::::::ddd::::d   ((::::::()::::::)
//  iiiiiiii  sssssssssss    BBBBBBBBBBBBBBBBB     aaaaaaaaaa  aaaa nnnnnn    nnnnnn  nnnnnn    nnnnnn    eeeeeeeeeeeeee     ddddddddd   ddddd     ((((((  ))))))
//
// Function isBanned
// Extract the domain name from the inputted url and check if the input's
//  domain name is a porn site domain
// Ya boi Vivek out here writing a porn filter
// @param url The url whose domain name we check against the porn sites
function isBannedFirebase(linksFromFirebase) {
  // Header(s) removed so that we can find the correct period to substring to
  //  in order to collect only the domain name
  let url = window.location.href.toLowerCase();

  // fightthenewdrug was flagged...let's avoid that
  if (
    linksFromFirebase &&
    !url.includes("fightthenewdrug") &&
    !url.includes("github")
  ) {
    // O(n) worst case feels bad but whO(l)esome porn-checker feels good
    for (let i = 0; linksFromFirebase[i]; i++) {
      if (url.includes(linksFromFirebase[i].toLowerCase())) {
        return true; // gtfo
      }
    }
  }

  // Inconclusive
  return false;
}

function isBannedURL() {
  // Header(s) removed so that we can find the correct period to substring to
  //  in order to collect only the domain name
  let host = window.location.hostname.toLowerCase();
  let idx = host.indexOf(".");
  let trimmedUrl; //todo re-evaluate 4chan strategy

  let href = window.location.href.toLowerCase();
  let hrefWithPath = href.substring(href.indexOf("://") + 3, href.length);

  // 8 to account for sites with extended intros (ie. boards.4chan)
  // This evaluates to false for a URL that looks like abcdefgh.name.com
  // Here's to hoping that there aren't too many of those URLs around
  if (idx < 8) {
    // todo rethink this strategy...
    trimmedUrl = host.substring(idx + 1);
  }

  // O(1) and whO(l)esome
  if (pornMap[host] || pornMap[trimmedUrl] || pornMap[hrefWithPath]) {
    window.stop();
    return true;
  }

  // Inconclusive
  return false;
}

function checkWithIBM() {
  let url = window.location.hostname;
  let api = "https://api.xforce.ibmcloud.com/url/" + url;

  if (!url.includes("fightthenewdrug")) {
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
    let request = new XMLHttpRequest();
    request.open("GET", api, false);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        let data = JSON.parse(request.responseText);
        if (data.result.cats.Pornography) {
          window.stop();
          PorNo();
          store(url);
        }
      } else {
        // We received an error from the api!
        // console.log('PorNo! is having some errors, hmmm....');
      }
    };

    request.onerror = function () {
      // There was another error, not from the api,
      // alert('PorNo! : Error');
    };
    request.send();
  }
}

function isUnsafeGoogleSearch(url) {
  return url.includes("google.com/search?") && !url.includes(safeSearch);
}
