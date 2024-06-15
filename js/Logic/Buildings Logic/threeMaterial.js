class in3Out1Bld extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.materialAmount2 = 0;
      this.tileData.materialAmount3 = 0;
      this.tileData.itemAmountOutput1 = 0;
    }

    const menu = this.createMenu(3, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);

    const checkInterval = setInterval(() => {
      if (this.tileData.materialName1) {
        const recipeObj = allItems.find(
          (recipe) =>
            recipe.producedIn == this.name &&
            (recipe.materials.res1Name == this.tileData.materialName1 ||
              recipe.materials.res2Name == this.tileData.materialName1 ||
              recipe.materials.res3Name == this.tileData.materialName1)
        );
        if (!recipeObj) return;

        this.itemProcessingMaterial(this.tile, menu, recipeObj);
        this.tileData.materialName1 = recipeObj.materials.res1Name;
        this.tileData.materialName2 = recipeObj.materials.res2Name;
        this.tileData.materialName3 = recipeObj.materials.res3Name;

        this.tileData.itemTypeOutput1 = recipeObj.name;
        clearInterval(checkInterval);

        const storageObj = {
          id: this.tileData.buildingId,
          resName: this.tileData.itemTypeOutput1,
          resAmount: +this.tileData.itemAmountOutput1,
          storageType: "factory",
        };

        storageResources.push(storageObj);
      }
    }, 1000);
  }
}
class ConcretePlant extends in3Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "concretePlant";
  }
}
class Foundry extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "foundry";
    this.tile = tile;
    Object.assign(this, findTarget);
  }

  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.materialAmount2 = 0;
      this.tileData.materialAmount3 = 0;
      this.tileData.itemAmountOutput1 = 0;
      this.tileData.itemAmountOutput2 = 0;
      this.tileData.itemAmountOutput3 = 0;
      this.tileData.semiFinishedAmount = 0;
    }
    const menu = this.createMenu(3, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);
    const waitInterval = setInterval(() => {
      if (this.tileData.materialName1) {
        const recipeObj = allItems.find((recipe) => recipe.producedIn === this.name);
        this.itemProcessingMaterial(this.tile, menu, recipeObj);

        this.tileData.materialName1 = recipeObj.materials.res1Name;
        this.tileData.materialName2 = recipeObj.materials.res2Name;
        this.tileData.materialName3 = recipeObj.materials.res3Name;
        this.tileData.semiFinishedType = recipeObj.name;

        this.tileData.itemTypeOutput1 = recipeObj.consumptionFor[0];
        this.tileData.itemTypeOutput2 = recipeObj.consumptionFor[1];
        this.tileData.itemTypeOutput3 = recipeObj.consumptionFor[2];
        clearInterval(waitInterval);
      }
    }, 1000);
  }
}
class Assembly extends in3Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "assembly";
  }
}

class CarFactory extends in3Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "carFactory";
  }
}
