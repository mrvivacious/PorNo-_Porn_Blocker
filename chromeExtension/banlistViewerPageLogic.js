window.onload = () => {
  let sites = [
    'reddit.com/r/nsfwexample1',
    'reddit.com/r/nsfwexample2',
    'site3.net/video13',
    'gamingsite.com/adultsection'
  ];

  for (item in sites) {
    addListItemToSpecificSitesList(sites[item]);
  }

  let exactSites = [
    'blahblahnsfw.org',
    'randomadultsite.abc',
    'pornwhatever.ok'
  ];

  for (item in exactSites) {
    addListItemToEntireSitesList(exactSites[item]);
  }
};

function addListItemToSpecificSitesList(url) {
  let name = url;
  let listOfSpecificSites = document.getElementById("listOfSpecificSites");
  let li = document.createElement("p");
  let t = document.createTextNode(name);

  li.appendChild(t);

  if (!listOfSpecificSites) {
    return;
  }
  listOfSpecificSites.appendChild(li);

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");

  span.className = "delete";
  span.title = `Delete ${url}`

  span.addEventListener('click', () => {
    let userConfirmedDelete = confirm(
      `Delete this link?\n${url}`
    );

    if (userConfirmedDelete) {
      // try {
      //   chrome.storage.sync.remove([keyValueToRemove], function () {});
      // } catch (e) {
      //   document.getElementById("ERROR_MSG").innerHTML =
      //     "Too many operations...please try again later, sorry!";
      // }
  
      // // Only update list when we confirm that the desired deletion has succeeded
      // if (
      //   chrome.storage.sync.get([keyValueToRemove], function () {}) === undefined
      // ) {
        li.remove()
      // }
    }
  });

  span.appendChild(txt);
  li.appendChild(span);
}

function addListItemToEntireSitesList(url) {
  let name = url;
  let listOfEntireSites = document.getElementById("listOfEntireSites");
  let li = document.createElement("p");
  let t = document.createTextNode(name);

  li.appendChild(t);

  if (!listOfEntireSites) {
    return;
  }
  listOfEntireSites.appendChild(li);

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");

  span.className = "delete";
  span.title = `Delete ${url}`

  span.addEventListener('click', () => {
    let userConfirmedDelete = confirm(
      `Delete this link?\n${url}`
    );

    if (userConfirmedDelete) {
      // try {
      //   chrome.storage.sync.remove([keyValueToRemove], function () {});
      // } catch (e) {
      //   document.getElementById("ERROR_MSG").innerHTML =
      //     "Too many operations...please try again later, sorry!";
      // }
  
      // // Only update list when we confirm that the desired deletion has succeeded
      // if (
      //   chrome.storage.sync.get([keyValueToRemove], function () {}) === undefined
      // ) {
        li.remove()
      // }
    }
  });

  span.appendChild(txt);
  li.appendChild(span);
}
