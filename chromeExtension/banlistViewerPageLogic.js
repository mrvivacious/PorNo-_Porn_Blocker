window.onload = () => {
  chrome.storage.sync.get('userBanlists', function(returnedObject) {
    let userBanData = returnedObject['userBanlists'];
    let sites = Object.keys(userBanData); // what if this data doesnt exist at this point ??

    for (item in sites) {
      if (sites[item] !== 'listOfEntireSites') {
        addUrlListItemToSpecificList(sites[item], 'listOfSpecificSites');
      }
    }

    let exactSites = userBanData['listOfEntireSites'];
    for (item in exactSites) {
      addUrlListItemToSpecificList(exactSites[item], 'listOfEntireSites');
    }
  });
};

function addUrlListItemToSpecificList(url, specificList) {
  let name = url;
  let specifiedList = document.getElementById(specificList);
  if (!specifiedList) {
    return;
  }

  let li = document.createElement("p");
  let t = document.createTextNode(name);
  li.appendChild(t);
  specifiedList.appendChild(li);

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "delete";
  span.title = `Delete ${url}`

  span.addEventListener('click', () => {
    let userConfirmedDelete = confirm(
      `Delete this link?\n${url}`
    );

    if (userConfirmedDelete) {
      if (specificList === 'listOfSpecificSites') {
        chrome.storage.sync.get('userBanlists', function(returnedObject) {
          let userBanData = returnedObject['userBanlists'];

          delete userBanData[url];

          try {
            chrome.storage.sync.set({ userBanlists: userBanData }, function() {
              alert(`Succesfully deleted URL:\n${url}`);
              li.remove()
            });
          } catch (e) {
            alert(`Error with deleting URL:\n${url}\n\nPlease try again after a minute.`);
          }
        });
      }
      else if (specificList === 'listOfEntireSites') {
        // addEntireSitesDeleteHandler();
        chrome.storage.sync.get('userBanlists', function(returnedObject) {
          let userBanData = returnedObject['userBanlists'];
          let exactSites = userBanData['listOfEntireSites'];
          let indexOfSite = exactSites.indexOf(url);

          // https://stackoverflow.com/questions/5767325
          if (indexOfSite > -1) { 
            exactSites.splice(indexOfSite, 1); 
          }

          userBanData['listOfEntireSites'] = exactSites;

          try {
            chrome.storage.sync.set({ userBanlists: userBanData }, function() {
              alert(`Succesfully deleted URL:\n${url}`);
              li.remove()
            });
          } catch (e) {
            alert(`Error with deleting URL:\n${url}\n\nPlease try again after a minute.`);
          }
        });
      }
      else {
        return;
      }
    }
  });

  span.appendChild(txt);
  li.appendChild(span);
}