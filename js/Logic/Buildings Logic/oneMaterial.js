class in1Out1Bld extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
    }

    this.tileData.productionTime = this.productionTime;
    const menu = this.createMenu(
      OneMatProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );

    const waitingInterval = setInterval(() => {
      if (this.tileData.firstMatName) {
        const recipeObj = allItems.find(
          (recipe) => recipe.producedIn == this.name && recipe.materials.res1Name == this.tileData.firstMatName
        );
        this.itemProcessingMaterial(this.findTargetTile(), menu, recipeObj);
        clearInterval(waitingInterval);
      }
    }, 1000);
  }
}
class OreProcessingPlant extends in1Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "oreProcessing";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
}
class CrushingPlant extends in1Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "crushingPlant";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
}
class Sawmill extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "sawmill";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
    }

    const menu = this.createMenu(
      OneMatProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "sawmill");
    this.itemProcessingMaterial(this.tile, menu, recipeObj);

    console.log(recipeObj.materials.res1Name);
    this.tileData.firstMatName = recipeObj.materials.res1Name;
    this.tileData.itemTypeOutput1 = recipeObj.name;
  }
}

class SteelMill extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "steelMill";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
      this.tileData.itemAmountOutput2 = 0;
      this.tileData.itemAmountOutput3 = 0;
      this.tileData.semiFinishedAmount = 0;
    }
    const menu = this.createMenu(
      OneMatProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea,
      this
    );
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "steelMill");
    this.itemProcessingOneMaterial(this.tile, menu, recipeObj);

    this.tileData.firstMatName = recipeObj.materials.res1Name;
    this.tileData.semiFinishedType = recipeObj.name;

    this.tileData.itemTypeOutput1 = recipeObj.consumptionFor[0];
    this.tileData.itemTypeOutput2 = recipeObj.consumptionFor[1];
    this.tileData.itemTypeOutput3 = recipeObj.consumptionFor[2];
  }
}
