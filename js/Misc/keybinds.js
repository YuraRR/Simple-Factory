// KEYBINDS
document.addEventListener("keydown", function (event) {
  if (event.code === "KeyR") {
    buildingDirection = (buildingDirection + 1) % 4;
    ghostRotating();
  }
});
let isAlternateState = false; // Флаг для отслеживания текущего состояния

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyU") {
    showUnderground();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyS") {
    saveGame();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyD") {
    demolitionFunc();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyL") {
    localStorage.setItem("toGenerate", "false");
    location.reload();
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
    let allGhostTiles = document.querySelectorAll(".road-hover");
    [...allGhostTiles].map((tile) => tile.classList.remove("road-hover"));
  }
});
document.addEventListener("keydown", (event) => {
  if (event.code == "Escape") {
    resetGhost();
    removeRoutes();
    if (undergroundOpened) showUnderground();
    if (!undergroundOpened) transperentBuildingsRemove();
  }
});