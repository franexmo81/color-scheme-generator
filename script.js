const colorPicker = document.querySelector(".color-picker");
const modeSelector = document.querySelector(".mode-selector");
const form = document.querySelector(".color-form");
const copyBtns = document.querySelectorAll(".copy-btn");

colorPicker.addEventListener("input", colorHasChanged);
modeSelector.addEventListener("change", colorSchemeHasChanged);

async function colorHasChanged() {
  let colorChosen = colorPicker.value.toUpperCase();
  updateText(colorChosen);

  if ((await getContrastColor(colorChosen)) == "#ffffff") {
    colorForBg = "#dddddd";
  } else {
    colorForBg = "#222222";
  }

  updateBgForm(colorForBg);
  colorSchemeHasChanged();
}

async function colorSchemeHasChanged() {
  let schemeColors = ["", "", "", "", ""]; // Default scheme if no color scheme has been selected

  if (modeSelector.value !== "none") {
    let colorSchemeData = await getColorScheme();
    schemeColors = colorSchemeData.map((color) => color.hex.value);

    document
      .querySelector(".colors-container")
      .classList.remove("colors-container--empty");
  } else {
    document
      .querySelector(".colors-container")
      .classList.add("colors-container--empty");
  }

  updateColorScheme(schemeColors);
}

function getColorScheme() {
  const apiUrl = "https://www.thecolorapi.com/scheme?";
  const endpointChosenColor = `hex=${colorPicker.value.slice(1)}`;
  const endpointChosenMode = `mode=${modeSelector.value}`;
  const endpointColorCount = `count=5`;

  return fetch(
    apiUrl +
      endpointChosenColor +
      "&" +
      endpointChosenMode +
      "&" +
      endpointColorCount,
    { method: "GET" }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => data.colors)
    .catch((error) => alert("Something went wrong. Error: ", error));
}

function getContrastColor(color) {
  const cleanColor = color.slice(1);
  const apiUrl = `https://www.thecolorapi.com/id?`;
  const endpointClearColor = `hex=${cleanColor}`;

  return fetch(apiUrl + endpointClearColor, { method: "GET" })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => data.contrast.value)
    .catch((error) => alert("Something went wrong. Error: ", error));
}

function updateBgForm(bgColor) {
  document.querySelector(".main-container").style.backgroundColor = bgColor;
  document.querySelector(".mode-selector").style.backgroundColor = bgColor;
  document.querySelector(".color-chosen").style.backgroundColor = bgColor;
}

function updateText(textColor) {
  document.querySelector(".title").style.color = textColor;
  document.querySelector(".color-chosen-value").innerText = textColor;
  document.querySelector(".color-chosen").style.color = textColor;
  document.querySelector(".mode-selector").style.color = textColor;
}

function updateColorScheme(colors) {
  for (let i = 0; i <= 4; i++) {
    let colorUpdating = document.getElementById(`color--${i}`);
    let colorValueUpdating = colorUpdating.querySelector(".color-value");
    colorUpdating.style.backgroundColor = colors[i];
    colorValueUpdating.innerText = colors[i];
    updateCopyCapability(colorUpdating, colors[i]);
  }
}

function copyColorToClipboard(e) {
  const colorToCopy = e.currentTarget.innerText;
  copyTextToClipboard(colorToCopy);
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert(text + " copied to the clipboard");
  } catch (error) {
    alert("Clipboard was unable to copy. ", error.message);
  }
}

function updateCopyCapability(element, condition) {
  if ("clipboard" in navigator && condition) {
    element
      .querySelector(".color-value")
      .addEventListener("click", copyColorToClipboard);
    element.classList.add("color--clickable");
  } else {
    element
      .querySelector(".color-value")
      .removeEventListener("click", copyColorToClipboard);
    element.classList.remove("color--clickable");
  }
}
