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
            <img src="img/resourcesIcons/noItem.webp" class="productImage" />
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

    setTimeout(() => (menu.querySelector(".productName").textContent = this.tileData.itemTypeOutput1), 100);

    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);
    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate(menu) {
    let itemAmount = menu.querySelector(".productAmount");
    let itemImage = menu.querySelector(".productImage");
    const intervalId = setInterval(() => {
      itemImage.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput1).imageSrc;
      itemAmount.textContent = this.tile.dataset.itemAmountOutput1;

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
            <img src="img/resourcesIcons/noItem.webp" class="productImage" />
            <span class="productAmount">(0)</span>
            <span class="productName">Empty</span>
          </div>
        </div>
      </div>
      <div class="storageBldMenu__upgrade">
        <button class="upgradeButton">Upgrade storage</button>
      </div>
      <button class="close-button"></button>`;

    container.appendChild(menu);

    this.menuUpdate(menu);
    this.closeButton(menu);
    this.storageUpgrade(menu);
    menu.id = `${this.name}${this.id}`;
    dragElement(menu.id);
  }
  menuUpdate(menu) {
    const itemAmount = menu.querySelector(".productAmount");
    const itemImage = menu.querySelector(".productImage");
    const itemName = menu.querySelector(".productName");
    setInterval(() => {
      if (this.tile.dataset.itemTypeOutput1) {
        itemImage.src = allItems.find((item) => item.name == this.tile.dataset.itemTypeOutput1).imageSrc;
      }
      itemAmount.textContent = this.tile.dataset.itemAmountOutput1;
      itemName.textContent = this.tile.dataset.itemTypeOutput1;
    }, 1000);
  }
  storageUpgrade(menu) {
    const button = menu.querySelector(".upgradeButton");
    const storageImg = this.tile.querySelector(`[data-main-building-img]`);
    button.addEventListener("click", () => {
      this.tileData.storageCapacity = 200;
      this.tileData.buildingType = "mediumStorage";
      storageImg.src = "/img/buildings/mediumStorage.webp";
      storageImg.dataset.imageType = "mediumStorage";
      menu.querySelector("h3").textContent = `medium Storage ${this.id}`;
    });
  }
}
