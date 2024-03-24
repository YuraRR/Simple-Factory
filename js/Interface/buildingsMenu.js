class BuildingMenu {
  constructor(tile, id) {
    this.tile = tile;
    this.id = id;
    this.clickArea = tile.querySelector(".clickArea");
  }
  closeButton(menu) {
    const closeBtn = menu.querySelector(".close-button");
    closeBtn.addEventListener("click", () => this.closeMenu());

    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") this.closeMenu();
    });
    this.closeMenu = () => {
      click3.play();
      menu.classList.add("hidden");
      this.menuOpened = false;
      resetGhost();
      hideRoutes();
    };
  }

  upgradeMenu(menu, upgradesList) {
    let upgradesBlock = menu.querySelector(".upgradesBlock");

    upgradesList.forEach((upgrade) => {
      let upgradeItem = document.createElement("div");
      upgradeItem.classList.add("upgrade-menu__block");
      upgradeItem.innerHTML = `
          <button class="upgrade-menu__btn" id="${upgrade.name}">
            <img src="${upgrade.img}" draggable="false" />
          </button>
          <span>${upgrade.name}</span>
        `;
      upgradesBlock.appendChild(upgradeItem);
      upgradeItem.querySelector("button").onclick = () => {
        switch (upgrade.name) {
          case "Crusher Machine":
            createEventListener(crusherCreating);
            break;
          case "Washing Machine":
            createEventListener(washerCreating);
            break;
          case "Blast Furnace":
            createEventListener(smelterCreating);
            break;
          case "Foundry (plates)":
            createEventListener(foundryCreating);
            foundryType = "Plates";
            break;
          case "Foundry (ingots)":
            createEventListener(foundryCreating);
            foundryType = "Ingots";
            break;
          case "Foundry (rods)":
            createEventListener(foundryCreating);
            foundryType = "Rods";
            break;
          case "Slag Recycler":
            createEventListener(storageCreating);
            break;
        }
      };
    });
  }
  factoryStructureBlock(menu) {
    const structureBlock = menu.querySelector(".factoryStructures");
    const structureInfo = structuresList.find((elem) => elem.factoryName == menu.dataset.menuType);
    const currentStructures = structureInfo.structures;
    if (structureInfo[this.tile.dataset.itemTypeOutput]) {
      currentStructures.forEach((elem) => {
        const structureItem = document.createElement("div");
        structureItem.classList.add("structureBlock");
        const itemName = structureInfo[this.tileData.resType];
        const materialImageSrc = allItems.find((item) => item.name == this.tileData.resType).imageSrc;
        const productImageSrc = allItems.find((item) => item.name == itemName).imageSrc;
        structureItem.innerHTML = `
        <div class="structureBlock__materials">
        <div class="structureBlock__item">
          <img src="${materialImageSrc}" class="productImage" />
          <span class="productName">${this.tileData.resType}</span>
        </div>
      </div>
      <div class="structureBlock__arrow">
        <img src="img/buttonIcons/arrow.png" />
      </div>
      <div class="structureBlock__product">
        <div class="structureBlock__item">
          <img src="${productImageSrc}" class="productImage" />
          <span class="productName">${itemName}</span>
        </div>
      </div>
      <div class="structureBlock__button">
      <h3>${elem}</h3>
      <button class="structureBtn"></button>
      </div>`;

        itemName && structureBlock.appendChild(structureItem);

        structureItem.querySelector(".structureBtn").addEventListener("click", () => {
          gridContainer.addEventListener("click", structureCreating[elem]);
          const structurePossibleTiles = document.querySelectorAll(
            `[data-structure-possible-for="${this.tileData.buildingId}"]`
          );
          structurePossibleTiles.forEach((tile) => {
            tile.classList.add("activeTileOutline");
          });
        });
      });
    }
  }
}
class SourceBuildingsMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.tileData = tile.dataset;
    this.id = id;
    this.name = tile.dataset.buildingType;
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;

    this.title = this.name.replace(/([A-Z])/g, " $1");

    menu.classList.add("sourceBldMenu", "hidden");
    menu.innerHTML = `
    <h3>${this.title} ${this.id}</h3>
    <div class="sourceBldMenu__items">
      <div class="sourceBldMenu__product">
        <div class="sourceBldMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class="productImage" />
          <span class="productName">Empty</span>
          <span class="productAmount">0</span>
        </div>
      </div>
    </div>

    <div class="progressBarBlock">
      <div class="progressBar"></div>
      <span></span>
    </div>

    <h3>Add Structures</h3>
    <div class="factoryStructures"></div>
    <button class="close-button"></button>`;

    container.appendChild(menu);

    this.menuUpdate(menu);
    this.closeButton(menu);
    this.factoryStructureBlock(menu);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);
    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate(menu) {
    let itemAmount = menu.querySelector(".productAmount");
    let itemImage = menu.querySelector(".productImage");
    const intervalId = setInterval(() => {
      itemImage.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput).imageSrc;
      itemAmount.textContent = this.tile.dataset.itemAmountOutput;

      menu.dataset.updateInterval = intervalId;
    }, 1000);
  }
}
class StorageBuildingsMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.tileData = tile.dataset;
    this.id = id;
    this.name = tile.dataset.buildingType;
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;

    this.title = this.name.replace(/([A-Z])/g, " $1");

    menu.classList.add("storageBldMenu", "hidden");
    menu.innerHTML = `
    <h3>${this.title} ${this.id}</h3>
    <div class="storageBldMenu__items">
      <div class="storageBldMenu__product">
        <div class="storageBldMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class="productImage" />
          <span class="productAmount">0</span>
          <span class="productName">Empty</span>
        </div>
      </div>
    </div>
    <button class="close-button"></button>`;

    container.appendChild(menu);

    this.menuUpdate(menu);
    this.closeButton(menu);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);
  }
  menuUpdate(menu) {
    const itemAmount = menu.querySelector(".productAmount");
    const itemImage = menu.querySelector(".productImage");
    const itemName = menu.querySelector(".productName");
    setInterval(() => {
      if (this.tile.dataset.itemType) {
        itemImage.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput).imageSrc;
      }
      itemAmount.textContent = this.tile.dataset.itemAmountOutput;
      itemName.textContent = this.tile.dataset.itemTypeOutput;
    }, 1000);
  }
}
class OneMatProcessingMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = tile.dataset.buildingType;
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;

    this.title = this.name.replace(/([A-Z])/g, " $1");
    menu.classList.add("oneMaterialsMenu", "hidden");

    menu.innerHTML = `
    <h3>${this.title} ${this.id}</h3>
    <div class="oneMaterialsMenu__items">
      <div class="oneMaterialsMenu__materials">
        <div class="oneMaterialsMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class = "materialImage" data-material-img="first"/>
          <span class = "materialAmount" data-material="first">0</span>
        </div>
      </div>
      <div class="oneMaterialsMenu__timeBlock">
         <span class="resAmountPerMin">0 / </span>
          <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
          <span class="resTime">60</span>

          <div class="oneMaterialsMenu__arrow">
            <img src="img/buttonIcons/arrow.png" />
          </div>
      </div>
      <div class="oneMaterialsMenu__product">
        <div class="oneMaterialsMenu__item">
        <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
        <span class = "productAmount">0</span>
      </div>
      </div>
      <div class="waterBlock hidden">
        <img src="img/resourcesIcons/water.png" class = "waterImage"/>
      </div>
    </div>

    <div class="progressBarBlock">
      <div class="progressBar"></div>
      <span></span>
    </div>
    <div class="factoryStructures"></div>
    <button class="close-button"></button>`;

    container.appendChild(menu);
    this.menuUpdate(menu);
    this.closeButton(menu);
    // this.factoryStructureBlock(menu);
  }
  menuUpdate(menu) {
    const materialAmount = menu.querySelector(`[data-material="first"]`);
    const productAmount = menu.querySelector(".productAmount");
    const waterBlock = menu.querySelector(".waterBlock");
    const resAmountPerMin = menu.querySelector(".resAmountPerMin");

    const intervalId = setInterval(() => {
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
      if (this.tile.dataset.waterRequired == "true") waterBlock.classList.remove("hidden");
      if (this.tile.dataset.fluidType == "water") {
        waterBlock.style.setProperty("background-color", "var(--transGreen)");
      }
      if (this.tile.dataset.itemType) {
        const resTime = allItems.find(
          (item) => item.materials && item.materials.res1Name === this.tile.dataset.itemType
        );
        resAmountPerMin.textContent = 60 * (1000 / resTime.materials.time) + " /";
      }
    }, 500);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);

    menu.dataset.updateInterval = intervalId;
  }
}

class TwoMatsProcessingMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = tile.dataset.buildingType;
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;
    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;

    this.title = this.name.replace(/([A-Z])/g, " $1");
    menu.classList.add("twoMaterialsMenu", "hidden");

    menu.innerHTML = `
    <h3>${this.title} ${this.id}</h3>
    <div class="twoMaterialsMenu__items">
      <div class="twoMaterialsMenu__materials">
        <div class="twoMaterialsMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class = "materialImage" data-material-img="first"/>
          <span class = "materialAmount" data-material="first">4</span>
        </div>
        <div class="twoMaterialsMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class = "materialImage" data-material-img="second"/>
          <span class = "materialAmount"data-material="second">2</span>
        </div>
      </div>
      <div class="twoMaterialsMenu__arrow">
        <img src="img/buttonIcons/arrow.png" />
      </div>
      <div class="twoMaterialsMenu__product">
        <div class="twoMaterialsMenu__item">
        <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
        <span class = "productAmount">0</span>
      </div>
      </div>
      <div class="waterBlock hidden">
        <img src="img/resourcesIcons/water.png" class = "waterImage"/>
      </div>
    </div>

    <div class="progressBarBlock">
      <div class="progressBar"></div>
      <span></span>
    </div>
    <button class="close-button"></button>`;

    container.appendChild(menu);
    this.menuUpdate(menu);
    this.closeButton(menu);
  }
  menuUpdate(menu) {
    const firstMaterialAmount = menu.querySelector(`[data-material="first"]`);
    const firstMaterialImg = menu.querySelector(`[data-material-img="first"]`);

    const secondMaterialAmount = menu.querySelector(`[data-material="second"]`);
    const secondMaterialImg = menu.querySelector(`[data-material-img="second"]`);

    const productAmount = menu.querySelector(".productAmount");
    const productImg = menu.querySelector(".productImage");

    const waterBlock = menu.querySelector(".waterBlock");
    const intervalId = setInterval(() => {
      firstMaterialImg.src = allItems.find((item) => item.name == this.tile.dataset.firstMatName).imageSrc;
      secondMaterialImg.src = allItems.find((item) => item.name == this.tile.dataset.secondMatName).imageSrc;

      productImg.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput).imageSrc;

      firstMaterialAmount.textContent = this.tile.dataset.firstMatAmount;
      secondMaterialAmount.textContent = this.tile.dataset.secondMatAmount;

      productAmount.textContent = this.tile.dataset.itemAmountOutput;

      if (this.tile.dataset.waterRequired == "true") waterBlock.classList.remove("hidden");
      if (this.tile.dataset.fluidType == "water") {
        waterBlock.style.setProperty("background-color", "var(--transGreen)");
      }
    }, 500);
    // this.allAssemblyItems(menu);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);

    menu.dataset.updateInterval = intervalId;
  }
}
class ThreeMatsProcessingMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = tile.dataset.buildingType;
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;

    this.title = this.name.replace(/([A-Z])/g, " $1");
    menu.classList.add("threeMaterialsMenu", "hidden");

    menu.innerHTML = `
    <h3>${this.title} ${this.id}</h3>
    <div class="threeMaterialsMenu__items">
      <div class="threeMaterialsMenu__materials">
        <div class="threeMaterialsMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class = "materialImage" data-material-img="first"/>
          <span class = "materialAmount" data-material="first">0</span>
        </div>
        <div class="threeMaterialsMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class = "materialImage" data-material-img="second"/>
          <span class = "materialAmount"data-material="second">0</span>
        </div>
        <div class="threeMaterialsMenu__item">
          <img src="img/resourcesIcons/noItem.svg" class = "materialImage" data-material-img="third"/>
          <span class = "materialAmount"data-material="third">0</span>
        </div>
      </div>
      <div class="threeMaterialsMenu__arrow">
        <img src="img/buttonIcons/arrow.png" />
      </div>
      <div class="threeMaterialsMenu__product">
        <div class="threeMaterialsMenu__item">
        <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
        <span class = "productAmount">0</span>
      </div>
      </div>
      <div class="waterBlock hidden">
        <img src="img/resourcesIcons/water.png" class = "waterImage"/>
      </div>
    </div>

    <div class="progressBarBlock">
      <div class="progressBar"></div>
      <span></span>
    </div>
    <button class="close-button"></button>`;

    container.appendChild(menu);
    this.menuUpdate(menu);
    this.closeButton(menu);

    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate(menu) {
    const firstMaterialAmount = menu.querySelector(`[data-material="first"]`);
    const firstMaterialImg = menu.querySelector(`[data-material-img="first"]`);

    const secondMaterialAmount = menu.querySelector(`[data-material="second"]`);
    const secondMaterialImg = menu.querySelector(`[data-material-img="second"]`);

    const thirdMaterialAmount = menu.querySelector(`[data-material="third"]`);
    const thirdMaterialImg = menu.querySelector(`[data-material-img="third"]`);

    const productAmount = menu.querySelector(".productAmount");
    const productImg = menu.querySelector(".productImage");

    const waterBlock = menu.querySelector(".waterBlock");
    const intervalId = setInterval(() => {
      firstMaterialImg.src = allItems.find((item) => item.name == this.tile.dataset.firstMatName).imageSrc;
      secondMaterialImg.src = allItems.find((item) => item.name == this.tile.dataset.secondMatName).imageSrc;
      thirdMaterialImg.src = allItems.find((item) => item.name == this.tile.dataset.thirdMatName).imageSrc;
      productImg.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput).imageSrc;

      firstMaterialAmount.textContent = this.tile.dataset.firstMatAmount;
      secondMaterialAmount.textContent = this.tile.dataset.secondMatAmount;
      thirdMaterialAmount.textContent = this.tile.dataset.thirdMatAmount;

      productAmount.textContent = this.tile.dataset.itemAmountOutput;

      if (this.tile.dataset.waterRequired == "true") waterBlock.classList.remove("hidden");
      if (this.tile.dataset.fluidType == "water") {
        waterBlock.style.setProperty("background-color", "var(--transGreen)");
      }
    }, 500);
    // this.allAssemblyItems(menu);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);

    menu.dataset.updateInterval = intervalId;
  }
}
