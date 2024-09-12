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
            <img src=".img/resourcesIcons/noItem.webp" class="productImage" />
            <span class="productName">Empty</span>
            <span class="productAmount">0</span>
          </div>
        </div>
        <div class="indicatorsBlock">
          <img src=".img/resourcesIcons/energy.png" class = "energyImage hidden"/>
        </div>
        <span class="sourceBldMenu__productivity"></span>
      </div>
     
      
     
      <div class="progressBarBlock">
        <div class="progressBar"></div>
        <span></span>
      </div>
  
      <h3>Upgrades</h3>
      <div class="factoryStructures"></div>
      <button class="close-button"></button>`;

    container.appendChild(menu);

    this.menuUpdate(menu);
    this.closeButton(menu);
    this.addUpgrade(menu);
    deltaTimeout(() => (menu.querySelector(".productName").textContent = this.tileData.itemTypeOutput1), 100);

    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);
    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate(menu) {
    const productivitySpan = menu.querySelector(".sourceBldMenu__productivity");
    const itemAmount = menu.querySelector(".productAmount");
    const itemImage = menu.querySelector(".productImage");
    const intervalId = setInterval(() => {
      const itemInfo = findItemObjInList(this.tile.dataset.itemTypeOutput1);
      itemInfo.imageSrc && (itemImage.src = itemInfo.imageSrc);

      itemAmount.textContent = this.tile.dataset.itemAmountOutput1;

      const energyImage = menu.querySelector(".energyImage");
      const energyImageBld = this.tile.querySelector(".energyImage");

      this.tileData.energyConsumption && energyImage.classList.remove("hidden");
      if (totalEnergy >= String(parseFloat(this.tileData.energyConsumption))) {
        energyImage.style.setProperty("background-color", "var(--transGreen)");
        energyImage.style.animation = "none";
        energyImageBld.classList.add("hidden");
      } else {
        energyImage.style.setProperty("background-color", "var(--transRed)");
        energyImage.style.animation = "flash 1s infinite";
        energyImageBld && energyImageBld.classList.remove("hidden");
      }
      productivitySpan.textContent = `${
        (60000 / itemInfo.materials.time) * this.tile.dataset.itemsMultiplier
      } / min`;
      menu.dataset.updateInterval = intervalId;
    }, 500);
  }
  addUpgrade(menu) {
    const structureBlock = menu.querySelector(".factoryStructures");
    const upgradeType = menu.dataset.menuType == "quarry" ? "Quarry deepening" : "Tunnel expansion";
    const htmlContent = `
    <div class="upgradeBlock">
      <p class="upgradeBlock__title">${upgradeType}</p>
      <div class="upgradeBlock__costBlock">
        <p class="upgradeBlock__costText">15</p>
        <img class="upgradeBlock__costImage" src="./img/resourcesIcons/explosives.png" />
      </div>
      <button class="upgradeBlock__btn">Upgrade 0/3</button>
    </div>`;
    structureBlock.insertAdjacentHTML("beforeend", htmlContent);
    const upgradeButton = structureBlock.querySelector(".upgradeBlock__btn");
    upgradeButton.onclick = () => {
      if (buildingResources.Explosives == 15) {
        if (this.tileData.itemsMultiplier < 4) {
          upgradeButton.textContent = `Upgrade ${this.tileData.itemsMultiplier}/3`;
          this.tileData.itemsMultiplier++;
        } else {
          notyf.error("Building is already maximum upgraded!");
        }
      } else {
        notyf.error("Not enough Explosives!");
      }
    };
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
            <img src=".img/resourcesIcons/noItem.webp" class="productImage" />
            <span class="productAmount">0</span>
            <span class="productName">Empty</span>
          </div>
        </div>
        <div class="itemSelect hidden"></div>
      </div>
      <div class="storageBldMenu__upgrade">
        <button class="upgradeButton">Upgrade storage</button>
      </div>
      <button class="close-button"></button>`;

    container.appendChild(menu);

    this.menuUpdate(menu);
    this.closeButton(menu);
    this.storageUpgrade(menu);
    this.selectItem(menu);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);
  }
  menuUpdate(menu) {
    const itemAmount = menu.querySelector(".productAmount");
    const itemImage = menu.querySelector(".productImage");
    const itemName = menu.querySelector(".productName");
    observeDatasetChange(this.tile, "item-type-output1", () => {
      if (this.tile.dataset.itemTypeOutput1) {
        itemImage.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput1).imageSrc;
        itemAmount.textContent = this.tile.dataset.itemAmountOutput1;
        itemName.textContent = this.tile.dataset.itemTypeOutput1;
      }
    });
  }
  storageUpgrade(menu) {
    const button = menu.querySelector(".upgradeButton");
    const storageImg = this.tile.querySelector(`[data-main-building-img]`);
    button.addEventListener("click", () => {
      this.tileData.storageCapacity = 200;
      this.tileData.buildingType = "mediumStorage";
      storageImg.src = "./img/buildings/mediumStorage.webp";
      storageImg.dataset.imageType = "mediumStorage";
      menu.querySelector("h3").textContent = `medium Storage ${this.id}`;
    });
  }
  selectItem(menu) {
    const selButton = menu.querySelector(".storageBldMenu__product");
    const itemsSelect = menu.querySelector(".itemSelect");

    allItems.forEach((item) => {
      if (item.isMovable != false) {
        const itemBlock = document.createElement("div");
        itemBlock.classList.add("storageItem");

        itemBlock.innerHTML = `
          <button class="importItem-button">
          <img src="${item.imageSrc}"/>
          </button>
          <span>${item.name}</span>`;
        itemsSelect.appendChild(itemBlock);
        itemBlock.querySelector(".importItem-button").onclick = () => {
          if (this.tile.dataset.itemAmountOutput1 == 0) {
            this.tileData.itemTypeOutput1 = item.name;
            itemsSelect.classList.add("hidden");
          } else {
            notyf.error("Storage is not empty");
          }
        };
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".itemSelect") && !event.target.closest(".storageBldMenu__product")) {
        itemsSelect.classList.add("hidden");
      }
    });
    selButton.onclick = () => itemsSelect.classList.toggle("hidden");
  }
}
