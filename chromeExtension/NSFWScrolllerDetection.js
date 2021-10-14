if (window.location.hostname === "scrolller.com") {
  // Always disable the NSFW flags
  // User has confirmed they want to see NSFW content?
  localStorage.setItem("SCROLLLER_BETA_1:CONFIRMED_NSFW", "false");

  // User has enabled NSFW content via the 18+ button in the bottom corner?
  localStorage.setItem("SCROLLLER_BETA_1:NSFW_FILTER", "false");

  window.onload = () => {
    // The 18+ button
    document
      .getElementsByClassName(
        "flex p-3 bg-gray-800 rounded-full cursor-pointer bg-opacity-70 transition-colors duration-200 false"
      )[1]
      .addEventListener("click", () => {
        document.firstElementChild.remove();
        PorNo();
      });

    // The "Yes, I want to see NSFW content" button
    document
      .getElementsByClassName("nsfw-warning__accept-button")[0]
      .addEventListener("click", () => {
        document.firstElementChild.remove();
        PorNo();
      });
  };
}
