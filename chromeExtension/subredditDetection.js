// PorNo!
// @author Vivek Bhookya
// NSFW subreddit detection (via the 'nsfw' post tags)
// + We can add other post-load stuff in here too ie. keyword check, ibm api, etc

function saveSubredditToBannedLinksList(domain) {
  let splitPathname = window.location.pathname.split('/');
  let URLFormattedWithSubreddit = domain + '/r/' + splitPathname[2];
  URLFormattedWithSubreddit = URLFormattedWithSubreddit.toLowerCase();

  // Today I learned there is r/undefined
  if (URLFormattedWithSubreddit === 'reddit.com/r/undefined') {
    return;
  }

  // URL should look like "reddit.com/r/cscareerquestions[/]?"
  // alert(URLFormattedWithSubreddit);

  // Add this website to our database for faster subsequent redirections
  // User can enter either of these formats so save both for now
  store(URLFormattedWithSubreddit);
  store(URLFormattedWithSubreddit + '/');
}

window.onload = () => {
  let host = window.location.hostname; // e621.net smh
  let domain = host.split('www.')[1];

  if (domain === 'reddit.com') {
    if (document.getElementsByClassName('_1x9diBHPBP-hL1JiwUwJ5J').length) {
      document.firstElementChild.remove(); // window.stop() wont work (.onload LOL)
      saveSubredditToBannedLinksList(domain);
      PorNo();
    }
  }
}
