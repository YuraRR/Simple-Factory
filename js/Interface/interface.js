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
    const buildingInfo = findBldObjInList(bld.name);
    const buildingType = buildingInfo.type;
    const toolContainer = document.querySelector(`[data-group-type="${buildingType}"]`);
    const buttonBlock = document.createElement("div");

    const buildingImage =
      typeof buildingInfo.imageSrc == "string" ? buildingInfo.imageSrc : `/img/buildings/${bld.name}.webp`;
    buttonBlock.classList.add("tool-menu__block");
    buttonBlock.innerHTML = `
    <button class="tool-menu__btn" id="${bld.name}" data-locked>
      <img src=${buildingImage} draggable="false" />
    </button>
    <img class="lockImage" src="/img/buttonIcons/lock.png" draggable="false" />
    <div class="unlockBld hidden">
      <button class="tool-menu__unlockBtn">Unlock <span class="green">${buildingInfo.unlockPrice} $</span></button>
      <button class="tool-menu__cancelBtn">Cancel</button>
    </div>
    <span>${formatString(bld.name)}</span>
    <div id="${bld.name}Tip" role="tooltip">
      <h3>${formatString(bld.name)}</h3>
      <p>${buildingInfo.description}</p>
      <div class="waterAndEnergyBlock">
     </div>
    </div>
  `;
    toolContainer.appendChild(buttonBlock);
    const unlockBtn = buttonBlock.querySelector(".tool-menu__unlockBtn");
    const cancelBtn = buttonBlock.querySelector(".tool-menu__cancelBtn");
    const toolBtn = buttonBlock.querySelector(".tool-menu__btn");
    const lockImage = buttonBlock.querySelector(".lockImage");

    buildingInfo.unlockPrice == 0 && removeLocked();

    unlockBtn.onclick = () => {
      if (money >= buildingInfo.unlockPrice) {
        removeLocked();
        money -= +buildingInfo.unlockPrice;
        updateMoney();
        moneySound();
      } else {
        unlockBtn.classList.add("shake");
        setTimeout(() => unlockBtn.classList.remove("shake"), 500);
        errorSound();
        notyf.error("Not enough money! Go find a job");
      }
    };
    function removeLocked() {
      toolBtn.removeAttribute("data-locked");
      unlockBtn.parentElement.remove();
      lockImage.remove();
    }
    cancelBtn.onclick = () => unlockBtn.parentElement.classList.add("hidden");

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

  addEnergyAndWaterIcons(tip, buildingInfo);
  buildingInfo.resources.forEach((resName) => {
    const tipResource = document.createElement("div");
    const resInfo = findItemObjInList(resName);
    const itemMaterials = bld.name == resInfo.producedIn ? resInfo.materials : resInfo.materials2;
    const resTime = itemMaterials.time === 0 ? "∞" : 60 * (1000 / itemMaterials.time);
    let materialList = [];
    for (let i = 1; i <= 3; i++) {
      const itemName = itemMaterials[`res${i}Name`];
      itemName && materialList.push(findItemObjInList(itemName));
    }
    product = findItemObjInList(resInfo.name);

    tipResource.classList.add("recipe__items");
    tipResource.innerHTML = `

      <div class="recipe__materials">
      </div>
 
      <div class="recipe__timeBlock">
          <span class="resAmountPerMin">${resTime} / </span>
          <span class="resTime">60</span>
          <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
          <img class="recipe__arrow" src="img/buttonIcons/arrow.png" />
      </div>
      <div class="recipe__product">
    
      </div>`;
    const allMaterials = tipResource.querySelector(".recipe__materials");
    for (let i = 0; i < materialList.length; i++) {
      const materialHTML = `
      <div class="recipe__item">
        <img src="${materialList[i].imageSrc}" class="recipe__itemImage" title="${materialList[i].name}"/>
        <span class="recipe__itemAmount">${itemMaterials[`res${i + 1}Amount`]}</span>
      </div>
    `;

      allMaterials.insertAdjacentHTML("beforeend", materialHTML);
    }
    const allProducts = tipResource.querySelector(".recipe__product");
    if (resInfo.type == "semiFinished") {
      const productsList = Object.values(allItems).filter((item) => item.materials.res1Name == resInfo.name);
      productsList.forEach((item) => {
        const productHTML = `
        <div class="recipe__item">
          <img src="${item.imageSrc}" class="recipe__itemImage" title="${item.name}"/>
          <span class="recipe__itemAmount">${item.materials.prodAmount}</span>
        </div>`;

        allProducts.insertAdjacentHTML("beforeend", productHTML);
      });
    } else {
      const productHTML = `
      <div class="recipe__item">
        <img src="${resInfo.imageSrc}" class = "recipe__itemImage"/>
        <span class = "recipe__itemAmount">${itemMaterials.prodAmount}</span>
      </div>`;

      allProducts.insertAdjacentHTML("beforeend", productHTML);
    }

    recipesBlock.appendChild(tipResource);
    tip.appendChild(recipesBlock);
  });
}
function resourcesTipBlock(bld, buildingInfo) {
  const tip = document.getElementById(bld.name + "Tip");
  const resourcesBlock = document.createElement("div");
  resourcesBlock.classList.add("resourcesBlock");
  buildingInfo.resources.forEach((res) => {
    const resInfo = findItemObjInList(res);
    const resImage = resInfo.imageSrc;
    const resTime = resInfo.materials.time === 0 ? "∞" : 60 * (1000 / resInfo.materials.time);
    const tipResourceHtml = `
    <div class="resourseBlock">
      <img src="${resImage}" class="resImage" draggable="false" />
      <span class="resName">${res}</span>
      <div class = "timeBlock"> 
        <span class="resAmountPerMin">${resTime} / </span>
        <span class="resTime">60</span>
        <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
      </div>
    <div>`;
    resourcesBlock.insertAdjacentHTML("beforeend", tipResourceHtml);
    tip.appendChild(resourcesBlock);
  });
}
function addEnergyAndWaterIcons(tip, buildingInfo) {
  const waterAndEnergyBlock = tip.querySelector(".waterAndEnergyBlock");
  if (buildingInfo.isWaterNeeded) {
    const waterHTML = `<img src="img/resourcesIcons/water.png" data-water-icon/>`;
    waterAndEnergyBlock.insertAdjacentHTML("beforeend", waterHTML);
  }
  if (buildingInfo.energyConsumption) {
    const energyHTML = `
    <img src="img/resourcesIcons/energy.png" data-energy-icon/>
    <span class="energyAmount">${buildingInfo.energyConsumption} kW</span>`;
    waterAndEnergyBlock.insertAdjacentHTML("beforeend", energyHTML);
  }
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
      document.querySelectorAll(".unlockBld").forEach((btn) => btn.classList.add("hidden"));
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
      if (btn.dataset.locked == "") {
        document.querySelectorAll(".unlockBld").forEach((btn) => btn.classList.add("hidden"));
        btn.parentElement.querySelector(".unlockBld").classList.remove("hidden");
        return;
      }
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
  showBuildingCost();
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
const backFillButton = document.getElementById("backfillingButton");
const modeButtons = document.querySelectorAll(".tool-menu__mode-btn");
modeButtons.forEach((btn) => {
  setTipes(btn.id);
  btn.addEventListener("click", () => btn.classList.toggle("buttonActive"));
});
demolitionButton.addEventListener("click", () => {
  currentTool = demolitionButton.classList.contains("buttonActive") ? "demolition" : "";
  demolitionEvent();
  ghostRotating();
});

undergroundButton.addEventListener("click", () => showUnderground());
transparentButton.addEventListener("click", () => transperentBuildingsShow());
backFillButton.addEventListener("click", () => backFilling());

function dragElement(id) {
  console.log(id);
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
function handleClickOutside(event, clickTarget) {
  if (!clickTarget.contains(event.target) && !event.target.closest("." + clickTarget.classList.value)) {
    clickTarget.classList.add("hidden");
    document.removeEventListener("click", (e) => handleClickOutside(e, clickTarget));
  }
}

const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "bottom",
  },
  types: [
    {
      type: "warning",
      background: "#ec942c",
      icon: {
        className: "material-icons",
        tagName: "i",
        text: "warning",
      },
    },
    {
      type: "error",
      background: "indianred",
      duration: 2000,
      dismissible: true,
    },
  ],
});

let progressBarInterval; // Глобальная переменная для хранения интервала прогресс-бара
function demolitionEvent() {
  const progressBar = document.querySelector("#demolProgressBar");

  gridContainer.addEventListener("mousedown", function (event) {
    if (event.button === 2 && currentTool == "demolition") {
      if (!progressBarInterval) {
        // Проверяем, запущен ли уже интервал
        const progressBarWidth = 100; // Ширина прогресс-бара (в пикселях)
        const progressBarHeight = 10; // Высота прогресс-бара (в пикселях)
        const progressBarLeft = event.clientX - progressBarWidth / 2; // Левая координата
        const progressBarTop = event.clientY - progressBarHeight / 2 + 70; // Верхняя координата с учетом смещения

        progressBar.style.left = progressBarLeft + "px";
        progressBar.style.top = progressBarTop + "px";
        progressBar.style.display = "block";

        let progress = 0;
        const totalSteps = 10; // Количество шагов анимации
        const progressIncrement = progressBarWidth / totalSteps;

        let destructionTime;
        if (
          event.target.dataset.buildingCategory == "conveyor" ||
          event.target.dataset.buildingType == "gravelRoad" ||
          event.target.dataset.buildingType == "concreteRoad"
        ) {
          destructionTime = 30;
        } else {
          destructionTime = 60;
        }
        console.log(destructionTime);
        progressBarInterval = setInterval(() => {
          progress += progressIncrement;
          progressBar.style.width = progress + "px";

          if (progress >= progressBarWidth) {
            clearInterval(progressBarInterval);
            demolitionFunc(event);
            progressBar.style.display = "none";
            progressBar.style.width = 0;
            progressBarInterval = null; // Сбрасываем флаг интервала
          }
        }, destructionTime); // Интервал обновления
      }
    }
  });

  gridContainer.addEventListener("mouseup", function (event) {
    if (event.button === 2) {
      if (progressBarInterval) {
        clearInterval(progressBarInterval);
        progressBar.style.display = "none";
        progressBar.style.width = 0;
        progressBarInterval = null; // Сбрасываем флаг интервала
      }
    }
  });
}
document.addEventListener("contextmenu", function (event) {
  event.preventDefault(); // Отменяем стандартное контекстное меню
  event.stopPropagation(); // Останавливаем всплытие события
});

function showBuildingCost() {
  const costsBlocks = document.querySelector(".buildingCostBlock");
  const costObj = findBldObjInList(currentTool).cost;
  costsBlocks.innerHTML = "";
  for (const key in costObj) {
    if (Object.hasOwnProperty.call(costObj, key)) {
      const itemAmount = costObj[key];
      const itemImageSrc = findItemObjInList(key).imageSrc;
      const storageItemAmount = buildingResources[key] || 0;
      const materialHTML = `
      <div class="buildingCostBlock__item">
        <img src="${itemImageSrc}" class="buildingCostBlock__itemImage">
        <span class="buildingCostBlock__itemInStorage${
          storageItemAmount < itemAmount ? " red" : ""
        }">${storageItemAmount}</span>
        <span class="buildingCostBlock__itemAmount">/${itemAmount}</span>
      </div>`;

      costsBlocks.insertAdjacentHTML("beforeend", materialHTML);
    }
  }
  currentTool == "" ? (costsBlocks.style.display = "none") : (costsBlocks.style.display = "flex"); // Показать элемент
}
