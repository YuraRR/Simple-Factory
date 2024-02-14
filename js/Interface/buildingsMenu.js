class BuildingMenu {
  constructor(tile, id) {
    this.tile = tile;
    this.id = id;
    this.buildingImage = tile.querySelector(`[data-main-building-img="true"]`);
    this.clickArea = tile.querySelector(".clickArea");
  }
  closeButton(menu) {
    let closeBtn = menu.querySelector(".close-button");
    closeBtn.addEventListener("click", () => this.closeMenu());

    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") this.closeMenu();
    });

    this.closeMenu = () => {
      if (this.buildingImage) {
        this.buildingImage.classList.remove("hidden");
      }
      menu.classList.add("hidden");
      this.clickArea.style.pointerEvents = "all";
      this.clickArea.classList.remove("hidden");
      this.menuOpened = false;
      switchUpgrades();
      // menu.classList.add("hidden");
      resetGhost();
      menuOpened = false;
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
}
class OreProccesingMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "OreProcessing";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("oreProcessingMenu", "hidden");
    let menuContent = `
     
    <div class="recipesBlock">
    <h2>${this.name} ${this.id} </h2>
      </div>
      <div class="proccessingBlock">
        <div class="itemsBlock">
          <div class="materialBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/resourcesIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>
      `;
    menu.innerHTML = menuContent;
    menu.dataset.oreProcessingId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);
    this.menuUpdate();
    this.closeButton(menu);
    this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-ore-processing-id="${this.id}"]`);
    let materialAmount = menu.children[1].querySelector(".materialAmount");
    let materialImage = menu.children[1].querySelector(".materialImage");

    let productAmount = menu.children[1].querySelector(".productAmount");
    let productImage = menu.children[1].querySelector(".productImage");
    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          materialImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          productImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          productImage.src = "/img/resourcesIcons/copperIngot.svg";
          break;
      }
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
    }, 100);
    this.allProcessibleOreItems(menu);
  }
  allProcessibleOreItems(menu) {
    const recipesBlock = menu.querySelector(".recipesBlock");
    allProcessingOreRecipes.forEach((recipe) => {
      let recipeBlock = document.createElement("div");
      recipeBlock.classList.add("oreProcessingRecipe");

      let materialItem = `
        <div class="materialBlock">
        <span class="recipeName">${recipe.materialName}</span>
          <img src=${recipe.materialImage} />
          <span>${recipe.materialAmount}</span>
        </div>
        <div class="arrowBlock">
          <img src="img/buttonIcons/arrow.png" />
        </div>
        <div class="productBlock">
        <span class="recipeName">${recipe.productName}</span>
        <img src=${recipe.productImage} />
        <span>${recipe.productAmount}</span>
      </div>`;
      recipeBlock.innerHTML = materialItem;
      recipesBlock.appendChild(recipeBlock);
    });
  }
}
class SmelterMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Smelter";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("smelterMenu", "hidden");
    let menuContent = `
     
    <div class="recipesBlock">
    <h2>${this.name} ${this.id} </h2>
      </div>
      <div class="proccessingBlock">
        <div class="itemsBlock">
          <div class="materialBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/resourcesIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>`;
    menu.innerHTML = menuContent;
    menu.dataset.smelterId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);

    this.menuUpdate();
    this.closeButton(menu);
    this.upgradeMenu(menu, smelterUpgrades);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-smelter-id="${this.id}"]`);
    let materialAmount = menu.children[1].querySelector(".materialAmount");
    let materialImage = menu.children[1].querySelector(".materialImage");

    let productAmount = menu.children[1].querySelector(".productAmount");
    let productImage = menu.children[1].querySelector(".productImage");
    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          materialImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          productImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          productImage.src = "/img/resourcesIcons/copperIngot.svg";
          break;
      }
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
    }, 100);
    this.allSmeltableItems(menu);
  }
  allSmeltableItems(menu) {
    const recipesBlock = menu.querySelector(".recipesBlock");
    allSmeltingRecipes.forEach((recipe) => {
      let recipeBlock = document.createElement("div");
      recipeBlock.classList.add("smeltingRecipe");

      let materialItem = `
        <div class="materialBlock">
        <span class="recipeName">${recipe.materialName}</span>
          <img src=${recipe.materialImage} />
          <span>${recipe.materialAmount}</span>
        </div>
        <div class="arrowBlock">
          <img src="img/buttonIcons/arrow.png" />
        </div>
        <div class="productBlock">
        <span class="recipeName">${recipe.productName}</span>
        <img src=${recipe.productImage} />
        <span>${recipe.productAmount}</span>
      </div>`;
      recipeBlock.innerHTML = materialItem;
      recipesBlock.appendChild(recipeBlock);
    });
  }
}
class AssemblerMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Assembly Line";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("assemblerMenu", "hidden");
    if (!menu.dataset.assemblerId) {
      menu.dataset.assemblerId = this.id;
      menu.dataset.parentTileId = this.tile.id;
    } else {
      this.id = menu.dataset.assemblerId;
    }

    let menuContent = `
     
    <div class="recipesBlock">
    <h2>${this.name} ${this.id} </h2>
      </div>
      <div class="proccessingBlock">
        <div class="itemsBlock">
          <div class="materialBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/resourcesIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>
      `;
    menu.innerHTML = menuContent;
    container.appendChild(menu);
    this.menuUpdate();
    this.closeButton(menu);
    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-assembler-id="${this.id}"]`);
    let materialAmount = menu.children[1].querySelector(".materialAmount");
    let materialImage = menu.children[1].querySelector(".materialImage");

    let productAmount = menu.children[1].querySelector(".productAmount");
    let productImage = menu.children[1].querySelector(".productImage");
    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          materialImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          productImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          productImage.src = "/img/resourcesIcons/copperIngot.svg";
          break;
      }
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
    }, 100);
    this.allAssemblyItems(menu);
  }
  allAssemblyItems(menu) {
    const recipesBlock = menu.querySelector(".recipesBlock");
    allAssemblyRecipes.forEach((recipe) => {
      let recipeBlock = document.createElement("div");
      recipeBlock.classList.add("assemblyRecipe");

      let materialItem = `
        <div class="materialBlock">
        <span class="recipeName">${recipe.materialName}</span>
          <img src=${recipe.materialImage} />
          <span>${recipe.materialAmount}</span>
        </div>
        <div class="arrowBlock">
          <img src="img/buttonIcons/arrow.png" />
        </div>
        <div class="productBlock">
        <span class="recipeName">${recipe.productName}</span>
        <img src=${recipe.productImage} />
        <span>${recipe.productAmount}</span>
      </div>`;
      recipeBlock.innerHTML = materialItem;
      recipesBlock.appendChild(recipeBlock);
    });
  }
}
class StorageMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Storage";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("storageMenu", "hidden");
    let menuContent = `
      <div class="storedItemsBlock">
        <h2>${this.name} ${this.id}</h2>
      </div>
      <div class="itemBlock">
        <div class="itemImage">
          <img src="img/resourcesIcons/noItem.svg" />
        </div>
        <span class="itemAmount">0</span>
      </div>
      <div class="statisticsBlock">
        <span class="increase">+10</span>
        <span class="decrease">-10</span>
      </div>
      <button class="close-button"></button>`;
    menu.innerHTML = menuContent;
    menu.dataset.storageId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);
    this.allStorableItems(menu);
    this.menuUpdate();
    this.closeButton(menu);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-storage-id="${this.id}"]`);
    let itemAmount = menu.children[1].querySelector(".itemAmount");
    let itemImage = menu.children[1].querySelector(".itemImage").children[0];

    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          itemImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          break;
        case "copperOre":
          itemImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          break;
        case "ironIngot":
          itemImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperIngot":
          itemImage.src = "/img/resourcesIcons/copperIngot.svg";
          break;
      }
      itemAmount.textContent = this.tile.dataset.itemAmount;
    }, 1000);
  }
  allStorableItems(menu) {
    const storedItemsBlock = menu.querySelector(".storedItemsBlock");
    allItems.forEach((item) => {
      let storedItemBlock = document.createElement("div");
      storedItemBlock.classList.add("storedItem");

      let storedItem = `
          <div class="itemImage">
            <img src=${item.src} />
          </div>
          <div class="itemTitle">
            <p>${item.name}</p>
          </div>`;
      storedItemBlock.innerHTML = storedItem;
      storedItemsBlock.appendChild(storedItemBlock);
    });
  }
}
class MineshaftMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Mineshaft";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("mineshaftMenu", "hidden");
    let menuContent = `
      <div class="storedItemsBlock">
        <h2>${this.name} ${this.id}</h2>
      </div>
      <div class="itemBlock">
        <div class="itemImage">
          <img src="img/resourcesIcons/noItem.svg" />
        </div>
        <span class="itemAmount">0</span>
      </div>
      <div class="statisticsBlock">
        <span class="increase">+10</span>
      </div>
      <button class="close-button"></button>`;
    menu.innerHTML = menuContent;
    menu.dataset.mineshaftId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);
    this.menuUpdate();
    this.closeButton(menu);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-mineshaft-id="${this.id}"]`);
    let itemAmount = menu.children[1].querySelector(".itemAmount");
    let itemImage = menu.children[1].querySelector(".itemImage").children[0];

    setInterval(() => {
      switch (this.tile.dataset.itemTypeOutput) {
        case "Raw Iron Ore":
          itemImage.src = "/img/resourcesIcons/Raw Iron Ore.png";
          break;
        case "Raw Copper Ore":
          itemImage.src = "/img/resourcesIcons/Raw Copper Ore.svg";
          break;
      }
      itemAmount.textContent = `${this.tile.dataset.itemTypeOutput} - ${this.tile.dataset.itemAmountOutput}`;
    }, 1000);
  }
}
