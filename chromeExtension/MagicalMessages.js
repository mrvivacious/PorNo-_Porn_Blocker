// PorNo!
// @author Vivek Bhookya
// Displays Magical Messages for the happiness and joy of the user
// Rotates the messages in the input box for more inspiration

$(document).ready(function () {
  // GenerateMagicalMessage();
  GenerateInputMessage();
});

// Function GenerateInputMessage
// Rotates the input box messages for extra inspiration when adding links
function GenerateInputMessage() {
  // The messages meant to provoke new ideas for links
  let messages = [
    "Your favorite websites!",
    "What's your favorite song?",
    "What picture inspires you?",
    "Is there an article that motivates you?",
    "What makes you feel your best?",
    "What defines you?",
    "What's a link to something you want?",
    "Link a picture to a role model of yours!",
    "A link to your greatest aspirations?"
  ];

  // Selecting a Magical Message
  let messageIndex = Math.floor(Math.random() * messages.length);
  let randomMessage = messages[messageIndex];

  if (document.getElementById("INPUT_url")) {
    document.getElementById("INPUT_url").placeholder = randomMessage;
  }
}
