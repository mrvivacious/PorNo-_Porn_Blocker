// PorNo!
// @author Vivek Bhookya
//  with help from https://www.w3schools.com/howto/howto_js_todolist.asp
// This file is responsible for the addition and deletion of links to the list
//  of website redirect links
//  as well as realtime updates for the collection of porn urls in the cloud
//  and the local machine to use
// ASCII art font is "Doh" from: http://patorjk.com/software/taag/#p=display&v=0&f=Doh&t=FUNCTIONS

// https://codepen.io/ArtZ91/pen/NggJBM

// TODO:
// CURRENTLY::

// POPUP

// OTHER
// o onInstalled, open intro youtube video and how to use page

// WRAP UP
// o Refactor me pleaseeeee (hash maps???)
// o ???
// –––
// √ Finish this checklist
// √ When I click on a list item, I should go to a new website
// √ When I click the website, I should go to the website url that is in the name
// √ Opening links shouldn't hijack me out of my current window
// √ Enable random selection from list of links to open when visiting a porn site
// √ The data should persist
// √ I should be able to delete urls
// √ Rotate the text in the url input to display ideas and inspiration for users
// √ I must screen the input links so that the user experience will be seamless and great
// √ What happens when a person inputs a banned link into the redirect url list???
// √ Instruct users to enable the extension in incognito upon download
// √ Allow users to add local files as well
// √ Open a survey when extension is deleted
// √ I should be able to add urls with custom names (titles seperate from the links)
// √ use keyword analysis to determine if a website is adult upon visit so that i
//    can finally stop having to look at porn sites
// √ Enable realtime updates of banned urls through Firebase
// √ The links should be written to a personal database (Firebase DB) for me to screen
// √ Test sync persistence between updates and diff machines https://developer.chrome.com/apps/storage
// √ Add an "emergency button" where ALL LINKS and QUALITY EDUCATION are opened
// √ Screen all inputted redirect urls with the realtime urls
//   If any are of illegal domains, delete them
// √ Explain what data I do and don't collect
// √ How to ensure people open the popup long enough for firebase to work....?
// √ There must be a "how to use" section in the popup and another "about PorNo!" site -- implement
// √ Add links to quality education
// √ Add a place to contact me about links that bypass the filter and other issues in the popup
// √ Add link to  a quiz in the popup
// √ Publish
// √ marquee and promo photos
// √ Make a how-to youtube video / trailer

// Opens a survey when PorNo! is deleted
try {
  chrome.runtime.setUninstallURL(
    "https://docs.google.com/forms/d/e/1FAIpQLSd1f_0gTaqpFPAznFzcsF_Wsb0xLv9Y0Nli-0_CG6-jG3r54Q/viewform?usp=sf_link",
    function () {}
  );
} catch (e) {
  // hide warning in chrome://extensions
  console.log("Error with chrome.runtime.setUninstallURL");
  console.log(e)
}


// Open welcome and how to use pages on initial download
chrome.storage.local.get("notFirstTime", function (returnValue) {
  if (returnValue.notFirstTime === undefined) {
    openURLInSameWindow("user_manual/welcome.html");
    // openURLInSameWindow("user_manual/help.html"); // Replace with youtube video TODO
    chrome.storage.local.set({ notFirstTime: true }, function () {});
    chrome.storage.sync.set(
      { lastTimestampSynced: new Date().getTime() },
      function () {}
    ); // TODO test this on raw install
  }
});

// https://stackoverflow.com/questions/13591983/
window.onload = function() {
  generateInputMessage();

  // updateDB(); // todo rename syncWithFirebase() ADD AFTER V3 MIGRATION
  ifIncognitoIsEnabledThenRemovePrompt();
  getUserLinksFromStorageAndAddToPopup(); // clean code says to break this into two functions get...() and add...()
  showStreakInPopup();

  if (window.location.href.includes("/stats.html")) {
    getRedirects();
  }

  document.addEventListener('keydown', handleEnterKeypress);

  let submitLinkButton = document.getElementById('submit');
  if (submitLinkButton) {
    submitLinkButton.addEventListener('click', submit);
  }

  let incognitoWarning = document.getElementById('setIncognito');
  if (incognitoWarning) {
    incognitoWarning.addEventListener('click', openExtensionSettingsPage);
  }

  let emergencyButton = document.getElementById('emergency');
  if (emergencyButton) {
    emergencyButton.addEventListener('click', openAllRedirectLinks);
  }
};

function handleEnterKeypress(event) { // submitLinkViaEnterKey todo refactor?
  if (event.keyCode === 13) { // isEnterKeyPressed() todo refactor
    submit();
  }
}

let start = new Date().getTime();
function showStreakInPopup() {
  chrome.storage.sync.get("redirectionHistory", function (returnedHistory) {
    let history = returnedHistory.redirectionHistory;
    if (!history) {
      return;
    }

    start = history[history.length - 1];
    calculateDiff();
  });
}

function calculateDiff() {
  setInterval(updateClock, 1000);
}

function updateClock() {
  // https://stackoverflow.com/questions/26049855
  let now = new Date().getTime();
  let diff = Math.round((now - start) / 1000);

  let d = Math.floor(diff / (24 * 60 * 60));
  diff = diff - d * 24 * 60 * 60;
  let h = Math.floor(diff / (60 * 60));
  diff = diff - h * 60 * 60;
  let m = Math.floor(diff / 60);
  diff = diff - m * 60;
  let s = diff;

  let streak = document.getElementById("streak");
  if (streak) {
    streak.innerHTML =
      d +
      " day(s), " +
      h +
      " hour(s), " +
      m +
      " minute(s), " +
      s +
      " second(s)<br>since your last redirect!";
  }
}

// todo A test function that should be removed in future (or associated with a proper button idk)
// $(document).on("click", "#testStats", function () {
//   window.open("stats.html");
// chrome.storage.sync.get("redirectionHistory", function (returnValue) {
//   let redirectionHistory = returnValue.redirectionHistory;

//   // pretty print for debugging sake
//   let prettyPrint = "STATISTICS DEBUG:\n\n";
//   // for (let i = 0, n = redirectionHistory.length; i < n; i++) {
//   for (let i = 0; redirectionHistory[i]; i++) {
//     let time = redirectionHistory[i];
//     let date = new Date(time);
//     // console.log(date);
//     prettyPrint += date.toLocaleString();
//     prettyPrint += "\n";
//   }

//   alert(prettyPrint);
// });
// });

// Gets the title attribute (the url) of the clicked li and sends that to openLink, which opens the url
// https://stackoverflow.com/questions/34964039
$(document).on("click", "li", function () {
  openURLInSameWindow(this.id);
});

// Deletes the selected list item and removes it from storage
$(document).on("click", "#delete", function (event) {
  let keyValueToRemove = this.parentElement.id;
  let listItemText = this.parentElement.innerText;
  let urlName = listItemText.substring(0, listItemText.length - 2);

  let userConfirmedDelete = confirm(
    "Delete this link?\n\nName: " + urlName + "\nLink: " + keyValueToRemove
  );

  if (userConfirmedDelete) {
    // Remove key-value from storage
    // Try-catch cause when the limits are exceeded, we receive an error message. We handle that
    //  in the catch block
    try {
      chrome.storage.sync.remove([keyValueToRemove], function () {});
    } catch (e) {
      document.getElementById("ERROR_MSG").innerHTML =
        "Too many operations...please try again later, sorry!";
    }

    // Only update list when we confirm that the desired deletion has succeeded
    if (
      chrome.storage.sync.get([keyValueToRemove], function () {}) === undefined
    ) {
      this.parentElement.remove();
    }
  }

  // Prevents the li.click from firing -- this resulted in opening a new tab of
  //  the deleted link
  event.stopPropagation();
});

// Display little text when hovering over the links
$(document).on("mouseover", "li", function () {
  $(this).attr("title", "Click to visit " + this.id);
});

$(document).on("mouseover", "#delete", function () {
  $(this).attr("title", "Delete link?");
});

$(document).on("mouseover", "#emergency", function () {
  $(this).attr("title", "It's time to PorNo!");
});

// TODO: read this https://artoflivingretreatcenter.org/slowing-down/?utm_campaign=General%20Registrations&utm_source=hs_email&utm_medium=email&utm_content=62426973&_hsenc=p2ANqtz-9_ANH5jVXnFguLeekK5mILFORbry13zYDIh_Gx7P9Tr-2ynINpNHbCCgLnqvu0EPWPP-ZfgLCu7mKBfoTp0XLnwKWuuw&_hsmi=62426973

//
// FFFFFFFFFFFFFFFFFFFFFFUUUUUUUU     UUUUUUUUNNNNNNNN        NNNNNNNN        CCCCCCCCCCCCCTTTTTTTTTTTTTTTTTTTTTTTIIIIIIIIII     OOOOOOOOO     NNNNNNNN        NNNNNNNN   SSSSSSSSSSSSSSS
// F::::::::::::::::::::FU::::::U     U::::::UN:::::::N       N::::::N     CCC::::::::::::CT:::::::::::::::::::::TI::::::::I   OO:::::::::OO   N:::::::N       N::::::N SS:::::::::::::::S
// F::::::::::::::::::::FU::::::U     U::::::UN::::::::N      N::::::N   CC:::::::::::::::CT:::::::::::::::::::::TI::::::::I OO:::::::::::::OO N::::::::N      N::::::NS:::::SSSSSS::::::S
// FF::::::FFFFFFFFF::::FUU:::::U     U:::::UUN:::::::::N     N::::::N  C:::::CCCCCCCC::::CT:::::TT:::::::TT:::::TII::::::IIO:::::::OOO:::::::ON:::::::::N     N::::::NS:::::S     SSSSSSS
// F:::::F       FFFFFF U:::::U     U:::::U N::::::::::N    N::::::N C:::::C       CCCCCCTTTTTT  T:::::T  TTTTTT  I::::I  O::::::O   O::::::ON::::::::::N    N::::::NS:::::S
// F:::::F              U:::::D     D:::::U N:::::::::::N   N::::::NC:::::C                      T:::::T          I::::I  O:::::O     O:::::ON:::::::::::N   N::::::NS:::::S
// F::::::FFFFFFFFFF    U:::::D     D:::::U N:::::::N::::N  N::::::NC:::::C                      T:::::T          I::::I  O:::::O     O:::::ON:::::::N::::N  N::::::N S::::SSSS
// F:::::::::::::::F    U:::::D     D:::::U N::::::N N::::N N::::::NC:::::C                      T:::::T          I::::I  O:::::O     O:::::ON::::::N N::::N N::::::N  SS::::::SSSSS
// F:::::::::::::::F    U:::::D     D:::::U N::::::N  N::::N:::::::NC:::::C                      T:::::T          I::::I  O:::::O     O:::::ON::::::N  N::::N:::::::N    SSS::::::::SS
// F::::::FFFFFFFFFF    U:::::D     D:::::U N::::::N   N:::::::::::NC:::::C                      T:::::T          I::::I  O:::::O     O:::::ON::::::N   N:::::::::::N       SSSSSS::::S
// F:::::F              U:::::D     D:::::U N::::::N    N::::::::::NC:::::C                      T:::::T          I::::I  O:::::O     O:::::ON::::::N    N::::::::::N            S:::::S
// F:::::F              U::::::U   U::::::U N::::::N     N:::::::::N C:::::C       CCCCCC        T:::::T          I::::I  O::::::O   O::::::ON::::::N     N:::::::::N            S:::::S
// FF:::::::FF            U:::::::UUU:::::::U N::::::N      N::::::::N  C:::::CCCCCCCC::::C      TT:::::::TT      II::::::IIO:::::::OOO:::::::ON::::::N      N::::::::NSSSSSSS     S:::::S
// F::::::::FF             UU:::::::::::::UU  N::::::N       N:::::::N   CC:::::::::::::::C      T:::::::::T      I::::::::I OO:::::::::::::OO N::::::N       N:::::::NS::::::SSSSSS:::::S
// F::::::::FF               UU:::::::::UU    N::::::N        N::::::N     CCC::::::::::::C      T:::::::::T      I::::::::I   OO:::::::::OO   N::::::N        N::::::NS:::::::::::::::SS
// FFFFFFFFFFF                 UUUUUUUUU      NNNNNNNN         NNNNNNN        CCCCCCCCCCCCC      TTTTTTTTTTT      IIIIIIIIII     OOOOOOOOO     NNNNNNNN         NNNNNNN SSSSSSSSSSSSSSS
//

// Rotates the input box messages to provoke new ideas for links
function generateInputMessage() {
  let messages = [
    "Your favorite websites!",
    "What's your favorite song?",
    "What picture inspires you?",
    "Is there an article that motivates you?",
    "What makes you feel your best?",
    "What defines you?",
    "What's a link to something you want?",
    "Link a picture to a role model of yours!",
    "A link to your greatest aspirations?",
  ];

  if (document.getElementById("INPUT_url")) {
    document.getElementById("INPUT_url").placeholder =
      messages[Math.floor(Math.random() * messages.length)];
  }
}

// Initializes the websites list with the links saved in storage
// Using Google.sync.storage allows the links to persist through devices as the
//  data is saved to the Google account currently signed in
function getUserLinksFromStorageAndAddToPopup() {
  // Array that stores all the keys (urls)
  let urls;

  // Get all keys currently in storage
  chrome.storage.sync.get(null, function (items) {
    urls = Object.keys(items);
    // console.log('Our keys: ' + urls);

    // If urls[0] is undefined (aka nothing exists in storage), skip
    //  initialization of the list
    if (urls[0] !== undefined) {
      // Iterate through the urls array
      //  and collect the names associated and add them to the list,
      //  one at a time with initList()
      // 4/27/18 - I encountered asynchronous programming
      for (let i = 0; urls[i]; i++) {
        if (
          urls[i] === "redirectionHistory" ||
          urls[i] === "lastTimestampSynced"
        ) {
          continue;
        }
        initList(urls[i]);
      }
    }

    // If nothing is in storage, show this prompt
    else {
      if (document.getElementById("ERROR_MSG")) {
        let msg = "Nothing here yet...add something that inspires you!";
        document.getElementById("ERROR_MSG").innerHTML =
          msg.fontcolor("DeepPink");
      }
    }
  });
}

// Creates the li objects with the values passed in from getUserLinksFromStorageAndAddToPopu()p
// The reason this function exists is to avoid race conditions between the for loop
//  iteration and the value sent into the get(). The loop resolves faster than the
//  get method can return the associated value and create an li, so we were left with
//  several "undefined" list objects
// @param currentKey The key we are retrieving the value of from storage
// tl;dr Something something asynchronous something something race condition
function initList(currentKey) {
  // Retrieve the value associated with the current key
  chrome.storage.sync.get(currentKey, function (returnValue) {
    let url = currentKey;
    // Check if this key-value pair exists
    if (returnValue[url] !== undefined) {
      // Pass in the url of the link and the name of the link
      // isBanned(url, returnValue[url], 'initList');
      if (isBanned(url, returnValue[url], "initList")) {
        // This key:value pair is removed from storage in isBanned()
      } else {
        let name = returnValue[url];
        let websiteList = document.getElementById("websites");
        let li = document.createElement("li");
        let t = document.createTextNode(name);

        li.appendChild(t);

        if (!websiteList) {
          return;
        }
        websiteList.appendChild(li);

        // ID the element we just made with its url
        li.id = url;

        let span = document.createElement("SPAN");
        let txt = document.createTextNode("\u00D7");
        span.className = "delete";
        span.id = "delete";
        span.appendChild(txt);
        li.appendChild(span);
      }
    }
  });
}

//  FFFFFFFFFFFFFFFFFFFFFFIIIIIIIIIIRRRRRRRRRRRRRRRRR   EEEEEEEEEEEEEEEEEEEEEE
//  F::::::::::::::::::::FI::::::::IR::::::::::::::::R  E::::::::::::::::::::E
//  F::::::::::::::::::::FI::::::::IR::::::RRRRRR:::::R E::::::::::::::::::::E
//  FF::::::FFFFFFFFF::::FII::::::IIRR:::::R     R:::::REE::::::EEEEEEEEE::::E
//    F:::::F       FFFFFF  I::::I    R::::R     R:::::R  E:::::E       EEEEEE
//    F:::::F               I::::I    R::::R     R:::::R  E:::::E
//    F::::::FFFFFFFFFF     I::::I    R::::RRRRRR:::::R   E::::::EEEEEEEEEE
//    F:::::::::::::::F     I::::I    R:::::::::::::RR    E:::::::::::::::E
//    F:::::::::::::::F     I::::I    R::::RRRRRR:::::R   E:::::::::::::::E
//    F::::::FFFFFFFFFF     I::::I    R::::R     R:::::R  E::::::EEEEEEEEEE
//    F:::::F               I::::I    R::::R     R:::::R  E:::::E
//    F:::::F               I::::I    R::::R     R:::::R  E:::::E       EEEEEE
//  FF:::::::FF           II::::::IIRR:::::R     R:::::REE::::::EEEEEEEE:::::E
//  F::::::::FF           I::::::::IR::::::R     R:::::RE::::::::::::::::::::E
//  F::::::::FF           I::::::::IR::::::R     R:::::RE::::::::::::::::::::E
//  FFFFFFFFFFF           IIIIIIIIIIRRRRRRRR     RRRRRRREEEEEEEEEEEEEEEEEEEEEE
//
// Send the links we've captured and set in local storage to my database
// I can update porNo.js accordingly with the links written
function updateDB() {
  chrome.storage.local.get(null, function (items) {
    let linkNames = Object.keys(items);
    DBOperations(linkNames);
  });
}

// Function submit()
// Begin the process of creating a new list item when clicking on the "Add" button
function submit() {
  let url = document.getElementById("INPUT_url").value.trim();
  let name = document.getElementById("INPUT_name").value.trim();

  // Avoid modifiying filepath submissions
  let isFilepath = url.includes("file://");

  if (!isFilepath) {
    if (url === "") {
      // Remove error message
      document.getElementById("ERROR_MSG").innerHTML = "";
      return;
    } else if (url.includes(" ")) {
      // Any spaces, display error
      document.getElementById("ERROR_MSG").innerHTML =
        "Invalid format, sorry. Do not include spaces in the link.";
      return;
    }
  }

  isBanned(url, name, "submit"); // Adds safe links to UI...todo refactor?
}

// Extract the domain name from the inputted url and check if the input's
//  domain name is a porn site domain
// Ya boi Vivek out here writing a porn filter ayy lmao
// @param url The url whose domain name we check against the porn sites
// @param name The name of the url
// @param origin The name of the function that called isBanned
function isBanned(url, name, origin) {
  chrome.storage.local.get("realtimeBannedLinks", function (retValue) {
    let bannedLinks = retValue.realtimeBannedLinks;

    // Final test
    if (isBannedURLRaceCondition(url, bannedLinks)) {
      return true;
    }
    // Origin tag exists bcuz initList() can add list items without unnecessarily
    //  calling storage.set calls, whereas submit() needs to create a list item along
    //  with a storage call
    else if (origin === "submit") {
      addLink(url, name);
    }

    // Link isn't banned ^_^
    return false;
  });
}

// Race condition boooooo
// This function does the checking of a link's ban-status. It exists to remove the undesired effects
//  from asynchronous behaviors that were affecting PorNo!'s functionality
// @param url The url to test
// @param bannedLinks The entire list of links, hardcoded and from storage
function isBannedURLRaceCondition(url, bannedLinks) {
  let lowerCase = url.toLowerCase();

  // Let's attempt to pull out the domain name
  // Trim URL in order to use our pornMap hashmap
  let trimmedURL = lowerCase;
  let start = trimmedURL.indexOf(".");

  if (trimmedURL.includes("www.")) {
    trimmedURL = trimmedURL.substring(start + 1);
  }
  // Some URls don't have a www., so we will instead look for the http header
  // start + 2 to remove both slashes without having to double-check
  else if (trimmedURL.includes("http")) {
    start = trimmedURL.indexOf("/");
    trimmedURL = trimmedURL.substring(start + 2);
  }

  // Remove everything after the domain (ie. domain.com/additional+parameters+blah)
  if (trimmedURL.includes("/")) {
    start = trimmedURL.indexOf("/");
    trimmedURL = trimmedURL.substring(0, start);
  }

  // Screen for domain in that good O(1)
  if (pornMap[trimmedURL]) {
    // GTFOOOO
    document.getElementById("ERROR_MSG").innerHTML =
      "Sorry, that link won't work. Please try another link.";

    // If the link is also saved in storage, remove it
    chrome.storage.sync.remove([url], function () {});
    return true;
  }

  // Else, screen for domain in that alright O(n)
  // Compare domain name (well, and the rest of the link) with porn domains
  // O(n) worst case feels bad but wh(O)lesome porn-checker feels good
  if (!bannedLinks) {
    console.log("bannedLinks is undefined, did I remember to add my api key??");
    return false;
  }
  for (let i = 0; i < bannedLinks.length; i++) {
    if (lowerCase.includes(bannedLinks[i].toLowerCase())) {
      // GTFOOOO
      document.getElementById("ERROR_MSG").innerHTML =
        "Sorry, that link won't work. Please try another link.";

      // If the link is also saved in storage, remove it
      chrome.storage.sync.remove([url], function () {});
      return true;
    }
  }
  // If need be, we could do Object.keys(pornMap) and do a full in-depth search
  // We will wait and see if users really try to redirect to porn URLs and then implement
  // Because I don't want to do that right now and spike the runtime up to ~25000 elements

  return false;
}

// Create a li item of a non-banned url and write the url to storage
function addLink(url, urlLabel) {
  // Set error message to blank
  document.getElementById("ERROR_MSG").innerHTML = "";

  // "Declare" a li object
  let li = document.createElement("li");
  let isFilepath = url.includes("file://");

  // Assert that the url begins with http:// or https:// (necessary for when we want to open new tabs)
  // If not, add the http (helps smoothen user experience)
  if (!(url.includes("http://") || url.includes("https://")) && !isFilepath) {
    url = "http://" + url;
  }

  // Empty name? use the url as the item label
  if (urlLabel === "") {
    urlLabel = url;
  }
  li.appendChild(document.createTextNode(urlLabel));

  try {
    chrome.storage.sync.set({ [url]: urlLabel }, function () {
      // Give the li the id of the url received as input to enable onClick
      // document.getElementById("websites").appendChild(li);
      li.id = url;
      document.getElementById("websites").appendChild(li);

      if (isFilepath) {
        document.getElementById("ERROR_MSG").innerHTML =
          "Reminder: Local files can't be accessed on other machines, unless you copy the file to that machine.".fontcolor(
            "DeepPink"
          );
      }
    });
  } catch (err) {
    // The Google storage documentation (https://developer.chrome.com/extensions/storage#property-sync):
    //  MAX_WRITE_OPERATIONS_PER_MINUTE, 120
    //  MAX_WRITE_OPERATIONS_PER_HOUR, 1800
    document.getElementById("ERROR_MSG").innerHTML =
      "Error...please try again later, sorry!";
  }

  // Empty the input field
  document.getElementById("INPUT_url").value = "";
  document.getElementById("INPUT_name").value = "";

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "delete";
  span.id = "delete";
  span.appendChild(txt);
  li.appendChild(span);
}

function openURLInSameWindow(URL) {
    chrome.tabs.create({ url: URL });
}

function openURLInNewWindow(URL) {
  chrome.windows.getCurrent(null, function (tab) {
    // Maintain incognito status for opened windows
    chrome.windows.create({ url: URL, incognito: tab.incognito });
  });
}

// If PorNo! is not allowed in icognito,
//  show the tip message because forcing users will only hurt our intentions
function ifIncognitoIsEnabledThenRemovePrompt() {
  try {
    chrome.extension.isAllowedIncognitoAccess(function (isAllowedAccess) {
      if (isAllowedAccess && document.getElementById("setIncognito")) {
        document.getElementById("setIncognito").remove();
      }
    });
  } catch (e) {
    console.log("Error with chrome.extension.isAllowedIncognitoAccess");
    console.log(e)
  }
}

// Clicking on the incognito tip opens PorNo!'s extension page to
//  help with the process of enabling "Allow in incognito"
function openExtensionSettingsPage() {
  chrome.tabs.create({
    url: "chrome://extensions/?id=" + chrome.runtime.id, // todo check out chrome.runtime.getURL
  });
}

// Open all redirects in separate windows
// Why so many windows? so many windows to maximize the amount of time user
//  spends looking at the stuff that motivates him/her
// More exposure may lead to more conversion of sexual energy into positive energy
function openAllRedirectLinks() {
  chrome.storage.sync.get(null, function (items) {
    urls = Object.keys(items);

    // Some "education"
    urls.push("https://fightthenewdrug.org/overview/");
    urls.push("http://virtual-addiction.com/online-pornography-test/");
    urls.push("user_manual/welcome.html");

    // https://stackoverflow.com/questions/43031988
    for (let i = 0, n = urls.length; i < n; i++) {
      if (
        urls[i] === "redirectionHistory" ||
        urls[i] === "lastTimestampSynced"
      ) {
        continue;
      }
      openURLInNewWindow(urls[i]);
    }
  });
}
