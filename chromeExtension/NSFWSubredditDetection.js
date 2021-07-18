// PorNo!
// @author Vivek Bhookya
// NSFW subreddit detection (via the 'nsfw' post tags)
// + We can add other post-load stuff in here too ie. keyword check, ibm api, etc

function subredditHasNSFWTag() {
  return document.getElementsByClassName("_1x9diBHPBP-hL1JiwUwJ5J").length;
}

function getSubredditFromDomain(domain) {
  let splitPathname = window.location.pathname.split("/");
  let URLFormattedWithSubreddit = domain + "/r/" + splitPathname[2];
  return URLFormattedWithSubreddit.toLowerCase();
}

function saveSubredditToBannedLinksList(subredditURL) {
  // Today I learned there is r/undefined
  if (subredditURL === "reddit.com/r/undefined") {
    return;
  }

  // alert(subredditURL);  // Should resemble "reddit.com/r/cscareerquestions[/]"

  // Add this website to our database for faster subsequent redirections
  // User can enter either of these formats so save both for now
  store(subredditURL);
  store(subredditURL + "/");
}

window.onload = () => {
  let host = window.location.hostname; // e621.net smh
  let domain = host.split("www.")[1];

  if (domain === "reddit.com") {
    if (subredditHasNSFWTag()) {
      document.firstElementChild.remove(); // window.stop() wont work (.onload LOL)
      let subreddit = getSubredditFromDomain(domain);
      saveSubredditToBannedLinksList(subreddit);
      PorNo();
    }
  }
};
