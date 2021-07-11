const buttons = document.querySelector(".buttons");

const character = document.querySelector(".container");
character.addEventListener("click", handleClick);
character.addEventListener("mouseup", handleMouseUp);

document.querySelector("button").addEventListener("click", exportBubbles);

document.querySelector("#upload-file").addEventListener("change", event => {
  Helper.toBase64(event.target.files[0]).then(data => {
    character.querySelector("img").src = data;
  });
});

document.querySelector("#upload-config").addEventListener("change", event => {
  Helper.readText(event.target.files[0]).then(data => {
    buttons.innerHTML = JSON.parse(data).bubbles.map(({x, y}) => createButton(x, 1 - y).outerHTML).join("");
  });
});

let isDragging = false;

const size = 975;

createButton(0.5, 0.5);
// createButton(0, 0);
// createButton(1, 1);

function getStyle(x, y) {
  return `--x: ${x * 100}%; --y: ${y * 100}%;`;
}

function exportBubbles() {
  const bubbles = Array.from(buttons.children).map(element => {
    const json = element.getAttribute("position");
    let {x, y} = JSON.parse(json);
    y = 1 - y;
    x = Helper.roundValue(x);
    y = Helper.roundValue(y);
    return {x, y};
  });

  const name = `${new Date().getTime()}.json`;
  const content = JSON.stringify({ bubbles }, null, 2);
  Helper.downloadTextAsFile(name, content);
}

function createButton(x, y) {
  const img = document.createElement("img");
  img.src = "assets/button.png";
  img.className = "button";
  img.style = getStyle(x, y);
  img.draggable = false;
  img.addEventListener("click", handleButtonClick);
  img.addEventListener("mousedown", handleMouseDown);
  img.addEventListener("mouseup", handleMouseUp);
  img.addEventListener("mousemove", handleMouseMove);
  img.setAttribute("position", JSON.stringify({x, y}));
  buttons.appendChild(img);
  return img;
}

function handleClick(event) {
  const size = 975;
  const { offsetX, offsetY } = event;
  let x = offsetX / size;
  let y = offsetY / size;
  x = Helper.roundValue(x);
  y = Helper.roundValue(y);
  createButton(x, y)
}

/**
 * 
 * @param {MouseEvent} event 
 */
function handleButtonClick(event) {
  event.stopPropagation();
  const { ctrlKey, target } = event;
  if (ctrlKey) {
    target.remove();
  }
}

function handleMouseDown(event) {
  isDragging = true;
}

function handleMouseUp(event) {
  isDragging = false;
}

/**
 * 
 * @param {MouseEvent} event 
 */
function handleMouseMove(event) {
  if (isDragging) {
    const { pageX, pageY, target } = event;
    let x = pageX / size;
    let y = pageY / size;
    x = Helper.clamp(x, 0, 1);
    y = Helper.clamp(y, 0, 1);
    x = Helper.roundValue(x);
    y = Helper.roundValue(y);
    target.style = getStyle(x, y);
    target.setAttribute("position", JSON.stringify({x, y}));
  }
}
