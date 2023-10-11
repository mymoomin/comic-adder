import Preview from "./preview.js";
import * as htmlparser2 from "./node_modules/htmlparser2/lib/esm/index.js";

const SERVER_URL = "https://cogpe6lgr5gmzkdra5le43mvva0iqpyk.lambda-url.eu-north-1.on.aws/";

const form = document.querySelector("form");
const feedInput = document.getElementById("feed");
const checkFeedButton = document.getElementById("checkFeed");
const titleInput = document.getElementById("title");
const submitButton = document.getElementById("submit");
const colorInput = document.getElementById("color");

checkFeedButton.addEventListener("click", checkFeed);

document.querySelectorAll(".notransition").forEach(node => node.classList.remove("notransition"))

async function checkFeed() {
  if (!feedInput.checkValidity()) {
    feedInput.reportValidity();
    //invalid url stuff here
    return;
  }
  checkFeedButton.disabled = "true";
  checkFeedButton.classList.remove("success", "failure")
  checkFeedButton.classList.add("loading");
  console.log("loading");
  try {
    const response = await fetch(SERVER_URL + feedInput.value);
    console.log(response);
    const feed = htmlparser2.parseFeed(await response.text());
    if (feed == null) throw new Error("Missing feed");
    if (feed.items.length == 0) throw new Error("Feed has no entries");
    const lastEntry = feed.items[0];
    Preview.lastEntryTitle = lastEntry.title
    Preview.lastEntryUrl = lastEntry.link
    checkFeedButton.classList.replace("loading", "success");
    console.log("valid feed");
  } catch (e) {
    console.log(e)
    checkFeedButton.classList.replace("loading", "failure");
    console.log("invalid rss feed");
    feedInput.setCustomValidity(getErrorMessage(response.reason));
    feedInput.reportValidity();
  } finally {
    checkFeedButton.removeAttribute("disabled");
  }
}

function getErrorMessage(e) {
  switch (e) {
    case "http":
      return "Something went wrong fetching the URL. Check for typos";

    case "feed":
      return "Something went wrong parsing the feed. Are you sure the URL is correct and RSS feed is working?";
  }
}

async function getFeed(feed) {
  try {
    return fetch(SERVER_URL + "check-feed?" + feed).then((res) => res.json());
  } catch (e) {
    console.error(e);
    return { valid: false, reason: "Internal error" };
  }
}

async function getDummyData() {
  alert(
    "Haven't added the backend yet, so this just gets the data for Sleepless Domain for now"
  );
  await fetch("");
  return {
    valid: true,
    title: "Sleepless Domain",
    lastEntryTitle: "Sleepless Domain - Chapter ??? - Page 8",
    lastEntryUrl: "https://www.sleeplessdomain.com/comic/chapter-page-8",
  };
}

feedInput.addEventListener("input", validateUrl);

function validateUrl() {
  if (!/https?:\/\/.+\..+/.test(feedInput.value)) {
    feedInput.setCustomValidity("Please enter a valid URL");
  } else {
    feedInput.setCustomValidity("");
  }
}

colorInput.addEventListener("input", validateColor);

function validateColor() {
  let message = "";
  if (!/^$|#?[\da-fA-F]{6}/.test(colorInput.value)) {
    if (!/#?.{6}/.test(colorInput.value)) {
      message += "Must be 6 digits. ";
    }
    if (!/^#?[\da-fA-F]*$/.test(colorInput.value)) {
      message += "\nDigits must be either numbers 0-9 or letters A-F";
    }
  }
  colorInput.setCustomValidity(message);
}

form.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  console.log("submit");
  if (form.checkValidity() === false) {
    console.log("not valid");
    event.preventDefault();
  } else {
    // On a production site do form submission.
    submitButton.disabled = "true";
    const data = JSON.stringify(Preview.submit(), null, 2);
    if (
      confirm(
        `Are you sure you want to add the comic ${Preview.title}, with the data\n${data}\n?`
      )
    ) {
      submitButton.classList.add("loading");

      const response = await fetch(SERVER_URL + "add-feed", {
        method: "post",
        body: data,
      }).then((res) => res.json());

      if (response.success) {
        submitButton.classList.replace("loading", "success");
        console.log("added feed");
      } else {
        submitButton.classList.replace("loading", "failure");
        console.log("issue adding feed", response);
        submitButton.setCustomValidity("Sorry, something went wrong");
        submitButton.reportValidity();
      }
      setTimeout(() => {
        submitButton.setAttribute("class", "");
        submitButton.removeAttribute("disabled");
        submitButton.setCustomValidity("")
      }, 1000);
    }
    event.preventDefault();
    submitButton.disabled = undefined;
  }
}

for (const elem of form.elements) {
  if (elem.nodeName === "INPUT") {
    elem.addEventListener("input", updatePreview);
  }
}

function updatePreview(event) {
  if (event.target.checkValidity()) {
    Preview[event.target.name] = event.target.value;
  }
}

console.log("hi");
