class Storage extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "mediumStorage";
    this.tile = tile;
    this.capacity = 200;
    this.buildingId = tile.dataset.buildingId;
  }
  addItemToStorage(clickArea) {
    this.createMenu(StorageBuildingsMenu, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea);
    this.tileData = this.tile.dataset;
    this.tileData.itemAmountOutput1 = 0;
    this.tileData.storageCapacity = this.capacity;
    const storageObj = {
      id: this.tileData.buildingId,
      resName: this.tileData.itemTypeOutput1,
      resAmount: +this.tileData.itemAmountOutput1,
      storageType: "storage",
    };
    storageResources.push(storageObj);
    this.updateGlobalAmount();
  }
  updateGlobalAmount() {
    const storageObj = storageResources.find((storage) => storage.id == this.tile.dataset.buildingId);
    setInterval(() => {
      storageObj.resName = this.tile.dataset.itemTypeOutput1;
      storageObj.resAmount = +this.tile.dataset.itemAmountOutput1;
      updateStorageResources();
    }, 1000);
  }
}
class SmallStorage extends Storage {
  constructor(tile, id) {
    super(tile, id);
    this.name = "smallStorage";
    this.capacity = 50;
    this.tile = tile;
  }
}
class PowerPlant extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "powerPlant";
    this.tile = tile;
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.itemAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
    }
    this.tileData.energyInNetwork = "false";
    this.tileData.buildingState = "Idle";

    const menu = this.createMenu(
      OneMatProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );

    const recipeObj = allItems.find((recipe) => recipe.producedIn === this.name);
    this.itemProcessingOneMaterial(this.tile, menu, recipeObj);

    this.tileData.itemType = recipeObj.materials.res1Name;
    this.tileData.itemTypeOutput1 = recipeObj.name;
    this.tile.dataset.energyProduction = 4;
  }
}
class WindTurbine extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "windTurbine";
    this.tile = tile;
  }
  processing() {
    const energyAmountSpan = document.querySelector(".totalEnergyAmount");
    totalEnergy += 2.5;
    updateEnergy();
    energyAmountSpan.textContent = `${totalEnergy} mW`;
    totalEnergy = +totalEnergy;
    this.tile.dataset.energyProduction = 2.5;
  }
}
