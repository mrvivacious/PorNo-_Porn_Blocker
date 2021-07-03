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
chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/e/1FAIpQLSd1f_0gTaqpFPAznFzcsF_Wsb0xLv9Y0Nli-0_CG6-jG3r54Q/viewform?usp=sf_link",
  function () {}
);

// Open welcome and how to use pages on initial download
chrome.storage.local.get("notFirstTime", function (returnValue) {
  if (returnValue.notFirstTime === undefined) {
    openLink("user_manual/welcome.html");
    openLink("user_manual/help.html"); // Replace with youtube video
    chrome.storage.local.set({ notFirstTime: true }, function () {});
  }
});

// MAIN
//  with help from https://stackoverflow.com/questions/13591983/onclick-within-chrome-extension-not-working
$(document).ready(function () {
  // updateDB() gets the latest URLs from Firebase (is called whenever the popup is opened)
  // initialize() fills the popup with the links saved in storage
  // setIncognito() informs users to enable the extension in incognito
  updateDB();
  setIncognito();
  initialize();

  // Popup-internal behavior for the add button and the incognito tip message
  $("#submit").click(submit);
  $("#setIncognito").click(helpIncognito);
  $("#emergency").click(emergency);
});

// Allow enter key press to add links
$(document).on("keyup", function (event) {
  if (event.keyCode === 13) {
    submit();
  }
});

// Gets the title attribute (the url) of the clicked li and sends that to openLink, which opens the url
// Thank you https://stackoverflow.com/questions/34964039/dynamically-created-li-click-event-not-working-jquery
$(document).on("click", "li", function () {
  openLink(this.id);
});

// Deletes the selected list item and removes it from storage
$(document).on("click", "#delete", function (event) {
  let keyValueToRemove = this.parentElement.id;

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

//
//    iiii                     iiii          tttt            iiii                    lllllll   iiii
//   i::::i                   i::::i      ttt:::t           i::::i                   l:::::l  i::::i
//    iiii                     iiii       t:::::t            iiii                    l:::::l   iiii
//                                        t:::::t                                    l:::::l
//  iiiiiiinnnn  nnnnnnnn    iiiiiiittttttt:::::ttttttt    iiiiiii   aaaaaaaaaaaaa    l::::l iiiiiii zzzzzzzzzzzzzzzzz    eeeeeeeeeeee
//  i:::::in:::nn::::::::nn  i:::::it:::::::::::::::::t    i:::::i   a::::::::::::a   l::::l i:::::i z:::::::::::::::z  ee::::::::::::ee
//   i::::in::::::::::::::nn  i::::it:::::::::::::::::t     i::::i   aaaaaaaaa:::::a  l::::l  i::::i z::::::::::::::z  e::::::eeeee:::::ee
//   i::::inn:::::::::::::::n i::::itttttt:::::::tttttt     i::::i            a::::a  l::::l  i::::i zzzzzzzz::::::z  e::::::e     e:::::e
//   i::::i  n:::::nnnn:::::n i::::i      t:::::t           i::::i     aaaaaaa:::::a  l::::l  i::::i       z::::::z   e:::::::eeeee::::::e
//   i::::i  n::::n    n::::n i::::i      t:::::t           i::::i   aa::::::::::::a  l::::l  i::::i      z::::::z    e:::::::::::::::::e
//   i::::i  n::::n    n::::n i::::i      t:::::t           i::::i  a::::aaaa::::::a  l::::l  i::::i     z::::::z     e::::::eeeeeeeeeee
//   i::::i  n::::n    n::::n i::::i      t:::::t    tttttt i::::i a::::a    a:::::a  l::::l  i::::i    z::::::z      e:::::::e
//  i::::::i n::::n    n::::ni::::::i     t::::::tttt:::::ti::::::ia::::a    a:::::a l::::::li::::::i  z::::::zzzzzzzze::::::::e
//  i::::::i n::::n    n::::ni::::::i     tt::::::::::::::ti::::::ia:::::aaaa::::::a l::::::li::::::i z::::::::::::::z e::::::::eeeeeeee
//  i::::::i n::::n    n::::ni::::::i       tt:::::::::::tti::::::i a::::::::::aa:::al::::::li::::::iz:::::::::::::::z  ee:::::::::::::e
//  iiiiiiii nnnnnn    nnnnnniiiiiiii         ttttttttttt  iiiiiiii  aaaaaaaaaa  aaaalllllllliiiiiiiizzzzzzzzzzzzzzzzz    eeeeeeeeeeeeee
//
// Function initialize()
// Initializes the websites list with the links saved in storage
// Using Google.sync.storage allows the links to persist through devices as the
//  data is saved to the Google account currently signed in
function initialize() {
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
      for (let i = 0; urls[i] !== undefined; i++) {
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

//
//    iiii                     iiii          tttt          LLLLLLLLLLL               iiii                            tttt
//   i::::i                   i::::i      ttt:::t          L:::::::::L              i::::i                        ttt:::t
//    iiii                     iiii       t:::::t          L:::::::::L               iiii                         t:::::t
//                                        t:::::t          LL:::::::LL                                            t:::::t
//  iiiiiiinnnn  nnnnnnnn    iiiiiiittttttt:::::ttttttt      L:::::L               iiiiiii     ssssssssss   ttttttt:::::ttttttt
//  i:::::in:::nn::::::::nn  i:::::it:::::::::::::::::t      L:::::L               i:::::i   ss::::::::::s  t:::::::::::::::::t
//   i::::in::::::::::::::nn  i::::it:::::::::::::::::t      L:::::L                i::::i ss:::::::::::::s t:::::::::::::::::t
//   i::::inn:::::::::::::::n i::::itttttt:::::::tttttt      L:::::L                i::::i s::::::ssss:::::stttttt:::::::tttttt
//   i::::i  n:::::nnnn:::::n i::::i      t:::::t            L:::::L                i::::i  s:::::s  ssssss       t:::::t
//   i::::i  n::::n    n::::n i::::i      t:::::t            L:::::L                i::::i    s::::::s            t:::::t
//   i::::i  n::::n    n::::n i::::i      t:::::t            L:::::L                i::::i       s::::::s         t:::::t
//   i::::i  n::::n    n::::n i::::i      t:::::t    tttttt  L:::::L         LLLLLL i::::i ssssss   s:::::s       t:::::t    tttttt
//  i::::::i n::::n    n::::ni::::::i     t::::::tttt:::::tLL:::::::LLLLLLLLL:::::Li::::::is:::::ssss::::::s      t::::::tttt:::::t
//  i::::::i n::::n    n::::ni::::::i     tt::::::::::::::tL::::::::::::::::::::::Li::::::is::::::::::::::s       tt::::::::::::::t
//  i::::::i n::::n    n::::ni::::::i       tt:::::::::::ttL::::::::::::::::::::::Li::::::i s:::::::::::ss          tt:::::::::::tt
//  iiiiiiii nnnnnn    nnnnnniiiiiiii         ttttttttttt  LLLLLLLLLLLLLLLLLLLLLLLLiiiiiiii  sssssssssss              ttttttttttt
//
// Function initList()
// Creates the li objects with the values passed in from initialize()
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
        let li = document.createElement("li");

        let t = document.createTextNode(name);

        li.appendChild(t);
        document.getElementById("websites").appendChild(li);

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
// function updateDB
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

  // Boolean flag to avoid modifiying filepath submissions
  let isURL = !url.includes("file://");

  // URL checks
  if (isURL) {
    // Input blank, do nothing
    if (url === "") {
      // Set error message to blank
      document.getElementById("ERROR_MSG").innerHTML = "";

      return;
    }

    // Any spaces, display error
    else if (url.includes(" ")) {
      document.getElementById("ERROR_MSG").innerHTML =
        "Invalid format, sorry. Do not include spaces in the link.";
      return;
    }
  }

  isBanned(url, name, "submit");
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

// Function isBannedURLRaceCondition()
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

// Function addLink()
// Creates a li item of a non-banned url and saves the url in storage
// @param url The url to save
// @param name The name to assign the url item in the popup
function addLink(url, name) {
  // Set error message to blank
  document.getElementById("ERROR_MSG").innerHTML = "";

  // "Declare" a li object
  let li = document.createElement("li");
  let isURL = !url.includes("file://");

  // Yay! Input seems to be valid
  // Assert that the url begins with http:// or https:// (necessary for when we want to open new tabs)
  // If not, add the http (helps smoothen user experience)
  if (!(url.includes("http://") || url.includes("https://")) && isURL) {
    url = "http://" + url;
  }

  // If name field was left blank, use the url as the text to display
  let t = "";
  if (name === "") {
    t = document.createTextNode(url);
    name = url;
  } else {
    t = document.createTextNode(name);
  }
  li.appendChild(t);

  // Add new key-value of the new url to storage
  // Why try-catch?
  // The Google storage documentation (https://developer.chrome.com/extensions/storage#property-sync):
  //  MAX_WRITE_OPERATIONS_PER_MINUTE, 120
  //  MAX_WRITE_OPERATIONS_PER_HOUR, 1800
  // When the limits are exceeded, we receive an error message. We handle that
  //  in the catch block
  try {
    chrome.storage.sync.set({ [url]: name }, function () {
      // Add new li object if storage.sync was a success and
      //  give the element the id of the url received as input to enable onClick
      // document.getElementById("websites").appendChild(li);
      // li.id = input;
      li.id = url;
      document.getElementById("websites").appendChild(li);
      if (!isURL) {
        document.getElementById("ERROR_MSG").innerHTML =
          "Reminder: Local files can't be accessed on other machines, unless you copy the file to that machine.".fontcolor(
            "DeepPink"
          );
      }
    });
  } catch (err) {
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

// Function openLink()
// Clicking on a list item should open the url it
//  corresponds to in a new tab within the same window
// The url is gathered from the clicked li object's id
// @param URL The url to open in the new tab
function openLink(URL) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.create({ url: URL });
  });
}

// Function openWindow
// helper function that open URL in a new window
function openWindow(URL) {
  chrome.windows.getCurrent(null, function (tab) {
    // Maintain incognito status for opened windows
    if (tab.incognito) {
      chrome.windows.create({ url: URL, incognito: true });
    } else {
      chrome.windows.create({ url: URL });
    }
  });
}

// Function setIncognito()
// This function checks whether or not PorNo! is enabled in incognito browsing
// If not, we show the tip message because forcing users will only hurt our intentions
function setIncognito() {
  chrome.extension.isAllowedIncognitoAccess(function (isAllowedAccess) {
    // If we are enabled in incognito, remove the tip
    if (isAllowedAccess && document.getElementById("setIncognito")) {
      document.getElementById("setIncognito").remove();
    }
  });
}

// Function helpIncognito()
// Should users click on the incognito tip, they are directed to PorNo!'s
//  extension page to help with the process of enabling "Allow in incognito"
function helpIncognito() {
  chrome.tabs.create({
    url: "chrome://extensions/?id=" + chrome.runtime.id,
  });
}

// Function emergency()
// emergency button functionality
// open all redirects in separate windows
// Why so many windows? so many windows to maximize the amount of time user
//  spends looking at the stuff that motivates him/her
// More exposure may lead to more conversion of sexual energy into positive energy
function emergency() {
  chrome.storage.sync.get(null, function (items) {
    urls = Object.keys(items);

    // Add quality education to the opened links
    urls.push("https://fightthenewdrug.org/overview/");
    urls.push("http://virtual-addiction.com/online-pornography-test/");
    urls.push("user_manual/welcome.html");
    // Iterate through the urls array
    //  and mass-open all the links
    for (let i = 0; urls[i] !== undefined; i++) {
      openWindow(urls[i]);
    }
  });
}
