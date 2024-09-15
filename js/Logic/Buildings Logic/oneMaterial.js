class in1Out1Bld extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.itemAmountOutput1 = 0;
    }
    const menu = this.createMenu(1, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);
    const storageObj = {
      id: this.tileData.buildingId,
      resName: this.tileData.itemTypeOutput1,
      resAmount: +this.tileData.itemAmountOutput1,
      storageType: "factory",
    };
    storageResources.push(storageObj);
    this.updateGlobalAmount();
    const checkInterval = setInterval(() => {
      if (this.tileData.materialName1) {
        const recipeObj = allItems.find(
          (recipe) => recipe.producedIn == this.name && recipe.materials.res1Name == this.tileData.materialName1
        );
        this.itemProcessingMaterial(this.findTargetTile(), menu, recipeObj);
        clearInterval(checkInterval);
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
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.itemAmountOutput1 = 0;
    }

    const menu = this.createMenu(1, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "sawmill");
    this.itemProcessingMaterial(this.tile, menu, recipeObj);

    this.tileData.materialName1 = recipeObj.materials.res1Name;
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
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.itemAmountOutput1 = 0;
      this.tileData.itemAmountOutput2 = 0;
      this.tileData.itemAmountOutput3 = 0;
      this.tileData.semiFinishedAmount = 0;
    }
    const menu = this.createMenu(1, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "steelMill");
    this.itemProcessingOneMaterial(this.tile, menu, recipeObj);

    this.tileData.materialName1 = recipeObj.materials.res1Name;
    this.tileData.semiFinishedType = recipeObj.name;

    this.tileData.itemTypeOutput1 = recipeObj.consumptionFor[0];
    this.tileData.itemTypeOutput2 = recipeObj.consumptionFor[1];
    this.tileData.itemTypeOutput3 = recipeObj.consumptionFor[2];
  }
}
