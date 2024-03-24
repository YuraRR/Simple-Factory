// KEYBINDS
let hoveredElement;

function handleMouseOver(event) {
  hoveredElement = event.target;
}
gridContainer.addEventListener("mouseover", handleMouseOver);
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyR":
      buildingDirection = (buildingDirection + 1) % 4;
      updateCellStyle();
      factoryConnectionCheck(hoveredElement);
      break;
    case "KeyU":
      const undergroundButton = document.getElementById("undergroundButton");
      undergroundButton.classList.toggle("buttonActive");
      showUnderground();
      break;
    case "KeyT":
      const transparentButton = document.getElementById("transparentButton");
      transparentButton.classList.toggle("buttonActive");
      transperentBuildingsShow();
      break;
    case "KeyS":
      saveGame();
      break;
    case "KeyD":
      if (currentTool == "demolition") {
        escapeButton();
      } else {
        const demolitionButton = document.getElementById("demolitionButton");
        demolitionButton.classList.toggle("buttonActive");
        currentTool = demolitionButton.classList.contains("buttonActive") ? "demolition" : "";
        gridContainer.addEventListener("click", demolitionFunc);
        ghostRotating();
      }
      break;
    case "KeyZ":
      !cheatMode ? (cheatMode = true) : (cheatMode = false);
      break;
    case "KeyP":
      !isPaused ? (isPaused = true) : (isPaused = false);
      break;
    case "KeyL":
      localStorage.setItem("toGenerate", "false");
      location.reload();
      break;
    case "Escape":
      escapeButton();
      break;
  }
});

let shiftKeyPressed = false;
document.addEventListener("keydown", (event) => {
  if (!shiftKeyPressed && currentTool == "road") {
    shiftKeyPressed = true;
    document.addEventListener("click", findTileByMouse);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    shiftKeyPressed = false;
    document.removeEventListener("click", findTileByMouse);
    document.removeEventListener("mouseover", placeMultiplyGhost);
    const allGhostTiles = document.querySelectorAll(".road-hover");
    [...allGhostTiles].map((tile) => tile.classList.remove("road-hover"));
  }
});

function escapeButton() {
  resetGhost();
  hideRoutes();
  if (undergroundOpened) showUnderground();
  if (!undergroundOpened) transperentBuildingsRemove();
  if (allOpenedMenu.length > 0) {
    const lastMenu = allOpenedMenu.pop();
    lastMenu.classList.add("hidden");
  }
  const menuModal = document.querySelector(".tool-menu__modal");
  menuModal.classList.add("hidden");

  const activeTiles = document.querySelectorAll(".activeTileOutline");
  activeTiles.forEach((tile) => tile.classList.remove("activeTileOutline"));

  const demoTiles = document.querySelectorAll(".demolition-hover");
  demoTiles.forEach((tile) => tile.classList.remove("demolition-hover"));

  clearPossibleTiles();

  const categoryButtons = document.querySelectorAll(".tool-menu__category");
  const toolButtons = document.querySelectorAll(".tool-menu__btn");
  const modeButtons = document.querySelectorAll(".tool-menu__mode-btn");

  categoryButtons.forEach((btn) => btn.classList.remove("buttonActive"));
  toolButtons.forEach((btn) => btn.classList.remove("buttonActive"));
  modeButtons.forEach((btn) => btn.classList.remove("buttonActive"));
}
