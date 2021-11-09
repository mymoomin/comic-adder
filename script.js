import Preview from "preview.js";

const form = document.querySelector("form");
const feedInput = document.getElementById("feed");
const checkFeedButton = document.getElementById("checkFeed");
const titleInput = document.getElementById("title");
const submitButton = document.getElementById("submit");
const colorInput = document.getElementById("color");

checkFeedButton.addEventListener("click", checkFeed);

async function checkFeed() {
  if (!feedInput.checkValidity()) {
    feedInput.reportValidity()
    //invalid url stuff here
    return;
  }
  console.log("loading");
  const response = await getDummyData(feedInput.value);
  switch (response.validity) {
    case true:
      if (!titleInput.value) titleInput.value = response.title;
      Preview.update({...response, title: titleInput.value})

      //TODO: true stuff
      console.log("valid feed");
      break;
    case false:
      //TODO: false stuff
      console.log("invalid rss feed");
    case "exists":
      //TODO: false stuff
      console.log("already exists");
  }
}

async function getDummyData() {
  alert(
    "Haven't added the backend yet, so this just gets the data for Sleepless Domain for now"
  );
  await fetch("/");
  return {
    validity: true,
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

function handleFormSubmit(event) {
  event.preventDefault();
  console.log("submit");
  if (form.checkValidity() === false) {
    console.log("not valid");
    event.preventDefault();
  } else {
    // On a production site do form submission.
    submitButton.disabled = "true";
    alert("If the backend worked, this would add the comic!");
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
