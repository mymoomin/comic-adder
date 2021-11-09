const preview = document.querySelector("div.preview");
const avatarImg = document.querySelector("img.avatar");
const usernameSpan = document.querySelector("span.username");
const roleSpan = document.querySelector("span.roleMention");
const embedWrapper = document.querySelector("div.embedWrapper");
const embedLink = document.querySelector("a.embedTitleLink");
const embedDescription = document.querySelector("div.embedDescription");

const toggleButton = document.getElementById("toggleTheme");

toggleButton.addEventListener("click", toggleTheme);
let isDark = true;

function toggleTheme() {
  if (isDark) {
    preview.classList.replace("theme-dark", "theme-light");
    toggleButton.innerHTML = "Switch to dark theme"
  } else {
    preview.classList.replace("theme-light", "theme-dark");
    toggleButton.innerHTML = "Switch to light theme"
  }
  isDark = !isDark;
  console.log("hello");
}

const defaultValues = {
  avatarURL: "webhook_icon.png",
  username: "RSS to Webhook",
  title: "Default Comic",
  color: "",
  lastEntryTitle: "Default Comic: Page 2",
  lastEntryUrl: "#",
};

const Preview = {
  _avatarUrl: undefined,
  _username: undefined,
  _title: undefined,
  _color: undefined,
  _lastEntryTitle: undefined,
  _lastEntryUrl: undefined,

  feedUrl: undefined,

  get avatarUrl() {
    return _avatarURL;
  },
  set avatarUrl(url) {
    if (url !== undefined) {
      this._avatarUrl = url;
      avatarImg.src = url;
    }
  },

  get username() {
    return _username;
  },
  set username(username) {
    if (username !== undefined) {
      this._username = username;
      usernameSpan.innerHTML = username;
    }
  },

  get title() {
    return _title;
  },
  set title(title) {
    if (title !== undefined) {
      this._title = title;
      roleSpan.innerHTML = `@${title}`;
      embedDescription.innerHTML = `New ${title}!`;
    }
  },

  get color() {
    return _color;
  },
  set color(hexcode) {
    if (hexcode !== undefined) {
      if (hexcode) {
        hexcode = hexcode.replace("#", "");
        this._color = hexcode;
        embedWrapper.style.borderLeftColor = "#" + hexcode;
        console.log(hexcode);
      } else {
        this._color = hexcode;
        embedWrapper.style.borderLeftColor = hexcode;
        console.log(hexcode);
      }
    }
  },

  get lastEntryTitle() {
    return _lastEntryTitle;
  },
  set lastEntryTitle(title) {
    if (title !== undefined) {
      this._lastEntryTitle = title;
      embedLink.innerHTML = title;
    }
  },

  get lastEntryUrl() {
    return _lastEntryUrl;
  },
  set lastEntryUrl(url) {
    if (url !== undefined) {
      this._lastEntryUrl = url;
      embedLink.href = url;
    }
  },

  submit() {
    return {
      feedUrl: this.feedUrl,
      avatarUrl: this._avatarURL,
      username: this._username,
      title: this._title,
      color: this._color,
    };
  },

  update({feedUrl, avatarUrl, username, title, color, lastEntryTitle, lastEntryUrl}) {
      this.feedUrl = feedUrl
      this.avatarUrl = avatarUrl
      this.username = username
      this.title = title
      this.color = color
      this.lastEntryTitle = lastEntryTitle
      this.lastEntryUrl = lastEntryUrl
  }
};

export default Preview;

const updatePreview = ({
  avatarURL,
  username,
  title,
  color,
  lastEntryTitle,
  lastEntryUrl,
}) => {
  preview.avatarUrl = avatarURL;
  preview.username = username;
  preview.title = title;
  preview.color = color;
  preview.lastEntryTitle = lastEntryTitle;
  preview.lastEntryUrl = lastEntryUrl;
};

// updatePreview(defaultValues)
