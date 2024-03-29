import Preview from "./preview.js";
import * as htmlparser2 from "./node_modules/htmlparser2/lib/esm/index.js";

const SERVER_URL = "https://cogpe6lgr5gmzkdra5le43mvva0iqpyk.lambda-url.eu-north-1.on.aws/";

const form = document.querySelector("form");
const feedInput = document.getElementById("feed");
const checkFeedButton = document.getElementById("checkFeed");
const titleInput = document.getElementById("title");
const submitButton = document.getElementById("submit");
const colorInput = document.getElementById("color");

const dataPre = document.getElementById("data")

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
  let response = null;
  try {
    const response = await fetch(SERVER_URL + feedInput.value);
    console.log(response);
    if (!response.ok) {
      throw response
    }
    const feed = htmlparser2.parseFeed(await response.text());
    if (feed == null) throw new Error("Not an RSS feed");
    if (feed.items.length == 0) throw new Error("Feed has no entries");
    const lastEntry = feed.items[0];
    Preview.lastEntryTitle = lastEntry.title
    Preview.lastEntryUrl = lastEntry.link
    console.log(feed.title, Preview.title)
    if (feed.title && !titleInput.value) {
      titleInput.value = feed.title;
      Preview.title = feed.title;
    }
    checkFeedButton.classList.replace("loading", "success");
    console.log("valid feed");
  } catch (e) {
    console.log("in error handling")
    console.log(e)
    checkFeedButton.classList.replace("loading", "failure");
    console.log("invalid rss feed");
    feedInput.setCustomValidity(getErrorMessage(e));
    feedInput.reportValidity();
  } finally {
    checkFeedButton.removeAttribute("disabled");
    setTimeout(() => checkFeedButton.classList.remove("failure"), 5000)
  }
}

function getErrorMessage(e) {
  switch (true) {
    case e instanceof Response:
      return `HTTP ${e.status}: ${e.statusText}`;
    default:
      return e.toString()
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
  if (!/^$|(#|0x)?[\da-fA-F]{6}/.test(colorInput.value)) {
    if (!/(#|0x)?.{6}/.test(colorInput.value)) {
      message += "Must be 6 digits. ";
    }
    if (!/^(#|0x)?[\da-fA-F]*$/.test(colorInput.value)) {
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
    submitButton.classList.add("loading");
    const data = JSON.stringify(Preview.submit(), null, 2);
    confirm(
      `Copy and paste \n\`\`\`json\n${data}\`\`\`\n into the server`
    )
    event.preventDefault();
    submitButton.disabled = undefined;
    submitButton.setCustomValidity("")
    submitButton.classList.remove("loading");
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
    dataPre.innerHTML = JSON.stringify(Preview.submit(), null, 2)
  }
}

console.log("hi");
