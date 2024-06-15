// KEYBINDS
let hoveredElement;
const infoMenu = document.querySelector(".info-menu");
const infoTitle = document.querySelector(".info-menu__title");
const infoList = document.querySelector(".info-menu__list");
function handleMouseOver(event) {
  hoveredElement = event.target;
  displayInfo();
}
gridContainer.addEventListener("mouseover", handleMouseOver);
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyR":
      buildingDirection = (buildingDirection + 1) % 4;
      updateCellStyle();
      currentTool == "cargoStation" ? factoryConnectionCheck(hoveredElement) : "";
      break;
    case "KeyU":
      const undergroundButton = document.getElementById("undergroundButton");
      showUnderground();
      undergroundButton.classList.toggle("buttonActive");

      break;
    case "KeyT":
      const transparentButton = document.getElementById("transparentButton");
      transparentButton.classList.toggle("buttonActive");
      transperentBuildingsShow();

      break;
    case "KeyM":
      showMoneyChange(5000, "plus");
      break;
    case "KeyF":
      if (currentTool == "demolition") {
        escapeButton();
      } else {
        escapeButton();
        const demolitionButton = document.getElementById("demolitionButton");
        demolitionButton.classList.toggle("buttonActive");
        currentTool = demolitionButton.classList.contains("buttonActive") ? "demolition" : "";
        demolitionEvent();
        ghostRotating();
      }
      break;
    case "KeyZ":
      !cheatMode ? (cheatMode = true) : (cheatMode = false);
      !cheatMode ? console.log("Cheats Off") : console.log("Cheats On");
      break;
    case "KeyP":
      !isPaused ? (isPaused = true) : (isPaused = false);
      console.log("pause");
      break;
    case "KeyL":
      // localStorage.setItem("toGenerate", "false");
      // location.reload();
      break;
    case "Escape":
      escapeButton();
      break;
  }
});

let shiftKeyPressed = false;
document.addEventListener("keydown", (event) => {
  if (
    (event.code === "ShiftLeft" || event.code === "ShiftRight") &&
    !shiftKeyPressed &&
    (currentTool == "gravelRoad" ||
      currentTool == "concreteRoad" ||
      currentTool == "pipe" ||
      currentTool == "conveyor")
  ) {
    shiftKeyPressed = true;
    document.addEventListener("click", findTileByMouse);
  } else {
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    shiftKeyPressed = false;
    document.removeEventListener("click", findTileByMouse);
    document.removeEventListener("mouseover", placeMultiplyGhost);
    const allGhostTiles = document.querySelectorAll(".multiply-hover, .cantBePlaced");
    allGhostTiles.forEach((tile) => {
      tile.classList.remove("multiply-hover");
      tile.classList.remove("cantBePlaced");
    });
  }
});

function escapeButton() {
  resetGhost();
  hideRoutes();
  fillingMode && backFilling();
  undergroundOpened && showUnderground();
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

  document.querySelectorAll(".clickArea").forEach((e) => (e.style.pointerEvents = "all"));

  const costsBlocks = document.querySelector(".buildingCostBlock");
  costsBlocks.style.display = "none";

  document.querySelectorAll(".unlockBld").forEach((btn) => btn.classList.add("hidden"));

  document.querySelector(".selectConnectorItemBlock").classList.add("hidden");

  const visTruckList = interfaceСont.querySelector(`.routesInfo-menu__trucksList.visible`);
  visTruckList && visTruckList.classList.remove("visible");

  clearInterval(costIntervalUpdate);
  blockCameraMove = false;
}
