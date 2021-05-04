// PorNo!
// @author Vivek Bhookya
// NSFW subreddit detection (via the 'nsfw' post tags)
// + We can add other post-load stuff in here too ie. keyword check, ibm api, etc

window.onload = () => {
  let host = window.location.hostname; // e621.net smh
  let domain = host.split('www.')[1];

  if (domain === 'reddit.com') {
    if (document.getElementsByClassName('_1wzhGvvafQFOWAyA157okr').length) {
      document.firstElementChild.remove();

      // todo add this website to our database for faster future-redirection

      PorNo(); // window.stop() wont work as the page has finished downloading LOL
    }
  }
}
