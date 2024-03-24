//////TOOLBAR//////ge

//Format name
function formatString(inputString) {
  return inputString
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function addBuildingsToMenu() {
  const buildingsNames = Object.values(buildingCreating);
  buildingsNames.forEach((bld) => {
    const buildingInfo = allBuildings.find((item) => item.name === bld.name);
    const buildingType = buildingInfo.type;
    const toolContainer = document.querySelector(`[data-group-type="${buildingType}"]`);
    const buttonBlock = document.createElement("div");
    buttonBlock.classList.add("tool-menu__block");

    buttonBlock.innerHTML = `
    <button class="tool-menu__btn" id="${bld.name}">
      <img src="/img/buildings/${bld.name}.webp" draggable="false" />
    </button>
    <span>${formatString(bld.name)}</span>
    <div id="${bld.name}Tip" role="tooltip">
      <h3>${formatString(bld.name)}</h3>
      <p>${buildingInfo.description}</p>
    </div>
  `;

    toolContainer.appendChild(buttonBlock);

    let dynamicKey = `${bld.name}MenuId`;
    buildingsMenuId[dynamicKey] = 1;

    buildingInfo.type == "source"
      ? resourcesTipBlock(bld, buildingInfo)
      : ["storage", "conveyors", "transport", "energy"].includes(buildingInfo.type)
      ? ""
      : recipeTipBlock(bld, buildingInfo);
    pricesTipBlock(bld, buildingInfo);
    setTipes(bld.name);
  });
}
function recipeTipBlock(bld, buildingInfo) {
  const tip = document.getElementById(bld.name + "Tip");
  const recipesBlock = document.createElement("div");
  recipesBlock.classList.add("recipesTipBlock");

  buildingInfo.resources.forEach((resName) => {
    const tipResource = document.createElement("div");
    const resInfo = allItems.find((item) => item.name == resName);
    const resTime = resInfo.materials.time === 0 ? "∞" : 60 * (1000 / resInfo.materials.time);
    let materialList = [];
    for (let i = 1; i <= 3; i++) {
      const itemName = resInfo.materials[`res${i}Name`];
      itemName && materialList.push(allItems.find((mat) => mat.name == itemName));
    }
    product = allItems.find((mat) => mat.name == resInfo.name);

    tipResource.classList.add("recipe__items");
    tipResource.innerHTML = `
      <div class="recipe__waterAndEnergyBlock">
        <img src="img/resourcesIcons/water.png" data-water-icon/>
        <img src="img/resourcesIcons/energy.png" data-energy-icon/>
      </div>
      <div class="recipe__materials">
      </div>
 
      <div class="recipe__timeBlock">
         <span class="resAmountPerMin">${resTime} / </span>
          <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
          <span class="resTime">60</span>

          <div class="recipe__arrow">
            <img src="img/buttonIcons/arrow.png" />
          </div>
      </div>
      <div class="recipe__product">
        <div class="recipe__item">
          <img src="${resInfo.imageSrc}" class = "recipe__itemImage"/>
          <span class = "recipe__itemAmount">${resInfo.materials.prodAmount}</span>
        </div>
      </div>`;

    const allMaterials = tipResource.querySelector(".recipe__materials");
    for (let i = 0; i < materialList.length; i++) {
      const materialHTML = `
      <div class="recipe__item">
        <img src="${materialList[i].imageSrc}" class="recipe__itemImage" title="${materialList[i].name}"/>
        <span class="recipe__itemAmount">${resInfo.materials[`res${i + 1}Amount`]}</span>
      </div>
    `;

      allMaterials.insertAdjacentHTML("beforeend", materialHTML);
    }

    recipesBlock.appendChild(tipResource);
    tip.appendChild(recipesBlock);

    if (!resInfo.materials.isWaterNeeded) {
      tip.querySelector("[data-water-icon]").remove();
    }
  });
}
function resourcesTipBlock(bld, buildingInfo) {
  const tip = document.getElementById(bld.name + "Tip");
  const resourcesBlock = document.createElement("div");
  resourcesBlock.classList.add("resourcesBlock");
  buildingInfo.resources.forEach((res) => {
    const tipResource = document.createElement("div");
    const resInfo = allItems.find((item) => item.name == res);
    const resImage = resInfo.imageSrc;
    const resTime = resInfo.materials.time === 0 ? "∞" : 60 * (1000 / resInfo.materials.time);
    tipResource.innerHTML = `
  <span class="resName">${res}</span>

  <div class = "timeBlock"> 
    <span class="resAmountPerMin">${resTime} / </span>
    <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
    <span class="resTime">60</span>
  </div>
  <img src="${resImage}" class="resImage" draggable="false" />
`;
    resourcesBlock.appendChild(tipResource);
    tip.appendChild(resourcesBlock);
  });
}
function pricesTipBlock(bld, buildingInfo) {
  const tip = document.getElementById(bld.name + "Tip");
  const costsBlock = document.createElement("div");
  const costText = document.createElement("p");
  costText.innerText = "Construction cost";
  tip.appendChild(costText);
  costsBlock.classList.add("costsBlock");
  for (const key in buildingInfo.cost) {
    if (Object.hasOwnProperty.call(buildingInfo.cost, key)) {
      const resAmount = buildingInfo.cost[key];
      const resName = [key];
      const tipCost = document.createElement("div");
      const resImage = allItems.find((item) => item.name == resName).imageSrc;
      tipCost.innerHTML = `
      <img src="${resImage}" class="resImage" draggable="false" title="${resName}"/>
      <span class="resAmount">${resAmount}</span>
  `;
      costsBlock.appendChild(tipCost);
    }
  }
  tip.appendChild(costsBlock);
}
function activeToolCategory() {
  const categoryButtons = document.querySelectorAll(".tool-menu__category");
  const toolGroups = document.querySelectorAll(".tool-menu__group");
  const toolButtons = document.querySelectorAll(".tool-menu__btn");
  const menuModal = document.querySelector(".tool-menu__modal");
  const closeBtn = menuModal.querySelector(".close-button");

  categoryButtons.forEach((btn) => {
    setTipes(btn.id);
    btn.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("buttonActive"));
      btn.classList.add("buttonActive");
      menuModal.classList.remove("hidden");
      const currentMenu = document.querySelector(`[data-group-type="${btn.id}"]`);
      toolGroups.forEach((btn) => btn.classList.add("hidden"));
      currentMenu.classList.remove("hidden");
      const modeButtons = document.querySelectorAll(".tool-menu__mode-btn");
      modeButtons.forEach((btn) => btn.classList.remove("buttonActive"));
    });
  });

  toolButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("buttonActive"));
      currentTool = btn.id;
      removeButtonActive(toolButtons, btn);
      createEventListener(currentTool);
      currentTool == "pipe" && !undergroundOpened ? showUnderground() : null;
      currentTool != "pipe" && undergroundOpened ? showUnderground() : null;
      currentTool == "conveyor" || currentTool == "connector" || currentTool == "splitter"
        ? transperentBuildingsShow()
        : transperentBuildingsRemove();
      if (currentTool == "undergroundConveyor") {
        const possibleTiles = document.querySelectorAll(`[data-possible-connect-with`);
        possibleTiles.forEach((tile) => tile.classList.add("possibleTile"));
      } else {
        clearPossibleTiles();
      }
    });
  });
  closeBtn.addEventListener("click", () => {
    menuModal.classList.add("hidden");
    categoryButtons.forEach((btn) => btn.classList.remove("buttonActive"));
    toolButtons.forEach((btn) => btn.classList.remove("buttonActive"));
    currentTool = "";
    escapeButton();
  });
}

function createEventListener(currentTool) {
  resetTool();
  gridContainer.removeEventListener("click", demolitionFunc);
  gridContainer.addEventListener("click", buildingCreating[currentTool]);
  ghostRotating();
}

function removeButtonActive(buttons, btn) {
  buttons.forEach((btn) => btn.classList.remove("buttonActive"));
  btn.classList.add("buttonActive");
}
function resetTool() {
  const creatingMethods = Object.values(buildingCreating);
  creatingMethods.forEach((method) => {
    gridContainer.removeEventListener("click", method);
  });
  const structuresMethods = Object.values(structureCreating);
  structuresMethods.forEach((method) => {
    gridContainer.removeEventListener("click", method);
  });
}
addBuildingsToMenu();
activeToolCategory();

// PROGRESS BAR
function moveProgressBar(menu, time, callback) {
  let progressBar = menu.querySelector(".progressBar");
  let width = 0;
  let animationId;

  function frame(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;

    const elapsed = timestamp - startTimestamp;

    if (elapsed < time && !isPaused) {
      width = (elapsed / time) * 100;
      progressBar.style.width = width + "%";
      animationId = requestAnimationFrame(frame);
    } else {
      progressBar.style.width = "0%";
      callback(); // Вызываем обратную функцию после завершения анимации
    }
  }

  let startTimestamp;
  animationId = requestAnimationFrame(frame);

  // Возвращаем объект с функцией для остановки анимации
  return {
    stop: function () {
      cancelAnimationFrame(animationId);
      progressBar.style.width = "0%";
    },
    width: width,
  };
}

// MODES MENU

const demolitionButton = document.getElementById("demolitionButton");
const undergroundButton = document.getElementById("undergroundButton");
const transparentButton = document.getElementById("transparentButton");
const modeButtons = document.querySelectorAll(".tool-menu__mode-btn");
modeButtons.forEach((btn) => {
  setTipes(btn.id);
  btn.addEventListener("click", () => btn.classList.toggle("buttonActive"));
});
demolitionButton.addEventListener("click", () => {
  currentTool = demolitionButton.classList.contains("buttonActive") ? "demolition" : "";
  gridContainer.addEventListener("click", demolitionFunc);
  ghostRotating();
});

undergroundButton.addEventListener("click", () => {
  escapeButton();
  showUnderground();
});
transparentButton.addEventListener("click", () => {
  transperentBuildingsShow();
});

function dragElement(id) {
  const position = { x: 0, y: 0 };
  const container = document.querySelector("#limit-container");
  interact(`#${id}`).draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: container,
      }),
    ],

    listeners: {
      start(event) {
        blockCameraMove = true;
      },
      move(event) {
        position.x += event.dx;
        position.y += event.dy;

        event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
      },
      end(event) {
        blockCameraMove = false;
      },
    },
  });
}

function setTipes(buttonId) {
  const button = document.getElementById(buttonId);
  const buttonBlock = button.parentElement;
  const tooltip = document.getElementById(`${buttonId}Tip`);
  let tipParent;
  !buttonBlock.classList.contains("tool-menu__group") ? (tipParent = button) : (tipParent = buttonBlock);
  tipParent == buttonBlock ? tooltip.classList.add("darkTip") : "";
  const popperInstance = Popper.createPopper(tipParent, tooltip, {
    placement: "top",
  });

  function show() {
    tooltip.setAttribute("data-show", "");
    popperInstance.update();
  }

  function hide() {
    tooltip.removeAttribute("data-show");
  }

  const showEvents = ["mouseenter", "focus"];
  const hideEvents = ["mouseleave", "blur"];

  showEvents.forEach((event) => {
    button.addEventListener(event, show);
  });

  hideEvents.forEach((event) => {
    button.addEventListener(event, hide);
  });
}
