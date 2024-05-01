class ThreeMatsProcessingMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = tile.dataset.buildingType;
    this.tileData - tile.dataset;
  }
  menuCreation(buildingObj) {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;
    this.buildingObj = buildingObj;

    this.title = this.name.replace(/([A-Z])/g, " $1");
    menu.classList.add("buildingMenu", "hidden");

    menu.innerHTML = `
      <h3>${this.title} ${this.id}</h3>
      <div class="mainProcess">
        <div class="buildingMenu__items">
          <div class="buildingMenu__materials">
            <div class="buildingMenu__item">
              <img src="img/resourcesIcons/noItem.webp" class = "materialImage" data-material-img="first"/>
              <div class="buildingMenu__amounts">
                <span class = "materialAmount" data-material="first">0</span>
                <span class = "materialAmountPerMin">(0/0)</span>
              </div>
            </div>
            <div class="buildingMenu__item">
              <img src="img/resourcesIcons/noItem.webp" class = "materialImage" data-material-img="second"/>
              <div class="buildingMenu__amounts">
                <span class = "materialAmount"data-material="second">0</span>
                <span class = "materialAmountPerMin">(0/0)</span>
              </div>
            </div>
            <div class="buildingMenu__item">
              <img src="img/resourcesIcons/noItem.webp" class = "materialImage" data-material-img="third"/>
              <div class="buildingMenu__amounts">
                <span class = "materialAmount"data-material="third">0</span>
                <span class = "materialAmountPerMin">(0/0)</span>
             </div>
            </div>
          </div>
          <div class="buildingMenu__timeBlock">
            <div class="buildingMenu__clock">
              <img src="/img/buttonIcons/whiteClock.png" class="timeImage" draggable="false" />
              <span class="resTime">0s / 60s</span>
            </div>
           <div class="buildingMenu__arrow">
             <img src="img/buttonIcons/arrow.png" />
           </div>
       </div>
          <div class="buildingMenu__product">
            <div class="buildingMenu__item">
              <img src="img/resourcesIcons/noItem.webp" class = "productImage"/>
              <div class="buildingMenu__amounts">
                <span class = "productAmount">0</span>
                <span class = "productAmountPerMin">(0/0)</span>
              </div>
            </div>
          </div>
          <div class="recipeSelect hidden"></div>
          <div class="indicatorsBlock hidden">
            <img src="img/resourcesIcons/water.png" class = "waterImage"/>
            <img src="img/resourcesIcons/energy.png" class = "energyImage"/>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
      </div>
      <div class="factoryStructures"></div>
      <button class="close-button"></button>`;

    container.appendChild(menu);
    this.menuUpdate(menu);
    this.closeButton(menu);
    this.recipeSelect(menu);
    menu.dataset.menuType == "foundry" ? this.extraRecipiesBlock(menu, buildingObj) : "";
    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
}
