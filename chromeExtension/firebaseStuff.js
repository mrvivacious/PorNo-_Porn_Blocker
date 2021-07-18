// remember, firebase connection only happens when the popup is opened
// so add <script> to popup as well

const API_KEY = "";
const AUTH_DOMAIN = "";
const DATABASE_URL = "";
const PROJECT_ID = "";
const STORAGE_BUCKET = "";
const MESSAGING_SENDER_ID = "";

function DBOperations(linkNames) {
  // FIREBASE STUFF
  if (!API_KEY) {
    console.warn(
      '"Please set the Firebase credentials at the top of this file...with love, Vivek"'
    );
    return;
  }

  let config = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
  };
  firebase.initializeApp(config);
  let db = firebase.firestore();

  // Silence warning and avoid app breaking
  let settings = { /* your settings... */ timestampsInSnapshots: true };
  db.settings(settings);

  let linksToAdd = [];

  // Add links for me to view
  for (
    let currentLink = 0;
    linkNames[currentLink] !== undefined;
    currentLink++
  ) {
    let val = linkNames[currentLink];

    if (val !== "realtimeBannedLinks" && val !== "notFirstTime") {
      db.collection("links").doc(val).set({
        // Adding this line will write another document ( links -> link -> link:currentLink )
        url: val,
      });
      // Debugging
      // .then(function(docRef) {
      //   console.log('Document written with id: ', docRef.id);
      // })
      // .catch(function(error) {
      //   console.error('Error adding document: ', error);
      // });

      linksToAdd.push(val);
    }
  }

  // Now, update the main array
  let allLinks = db.collection("links").doc("realtimeBannedLinks");
  allLinks
    .get()
    .then(function (doc) {
      if (doc.exists) {
        // Get the most up-to-date links
        let currentLinks = doc.data().url;

        // Add the links from local storage to the copy of the realtimeBannedLinks
        // console.log('length INIT: ' + currentLinks.length);

        for (let i = 0; linksToAdd[i] !== undefined; i++) {
          currentLinks.push(linksToAdd[i]);
          // Clear localStorage after save to free up space
          chrome.storage.local.remove([linksToAdd[i]], function () {});
        }

        // console.log('length FINAL: ' + currentLinks.length);

        // Then, update the array of links saved in local storage and update the
        //  realtimeBannedLinks in Firebase
        // Do this, and you will have successfully created a method of updating
        //  Firebase and everyone else's local storage copies of realtimeBannedLinks
        chrome.storage.local.set(
          { realtimeBannedLinks: currentLinks },
          function () {}
        );
        db.collection("links").doc("realtimeBannedLinks").set({
          url: currentLinks,
        });
      } else {
        // doc.data() will be undefined
        console.log("NO SUCH DOCUMENT");
      }
    })
    .catch(function (error) {
      console.log("ERROR UH OH:  " + error);
    });
}
