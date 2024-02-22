class OreProcessingPlant extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "oreProcessing";
    this.productionTime = 8000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemAmountOutput = 0;
      this.tileData.fluidAmount = 0;
    }

    this.tileData.productionTime = this.productionTime;

    const menu = this.createMenu(OneMaterialsProcessingMenu, "oreProcessing", oreProcessingMenuId++, clickArea);
    if (this.tileData.itemType) {
      const recipeObj = allItems.find(
        (recipe) => recipe.producedIn === "oreProcessing" && recipe.materials.res1Name == this.tileData.itemType
      );
      this.itemProcessingOneMaterial(this.findTargetTile(), menu, recipeObj);
    }
  }
}

class Smelter extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "smelter";
    this.productionTime = 4000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }

  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemAmountOutput = 0;
      this.tileData.fluidAmount = 0;
    }
    this.tileData.productionTime = this.productionTime;
    //MENU CREATION

    let menu = this.createMenu(SmelterMenu, "smelter", smelterMenuId++, clickArea);
    //PROCESSING INTERVAL

    let selectedProduct = this.tileData.selectedProduct;
    let recipeObj = allSmeltingRecipes.find(
      (recipe) =>
        recipe.productSubtype === this.tileData.selectedProduct && recipe.materialName === this.tileData.itemType
    );
    this.itemProcessingOneMaterial(this.findTargetTile(), menu, recipeObj);
  }
}

class Assembler extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "assembler";
    this.productionTime = 16000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput = 0;
    }

    this.tileData.selectedProduct = "Iron frame";
    const menu = this.createMenu(TwoMaterialsProcessingMenu, "assembler", assemblerMenuId++, clickArea);

    const selectedProduct = this.tileData.selectedProduct;
    const recipeObj = allAssemblyRecipes.find((recipe) => recipe.productName == this.tileData.selectedProduct);
    this.itemProcessingTwoMaterial(this.tile, menu, recipeObj);
  }
}

class CementPlant extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "cementPlant";
    this.productionTime = 16000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput = 0;
    }

    const menu = this.createMenu(TwoMaterialsProcessingMenu, "cementPlant", cementPlantMenuId++, clickArea);
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "cementPlant");
    this.itemProcessingTwoMaterial(this.tile, menu, recipeObj);
  }
}
class ConcretePlant extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "concretePlant";
    this.productionTime = 16000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput = 0;
      this.tileData.thirdMatAmount = 0;
    }

    const menu = this.createMenu(ThreeMaterialsProcessingMenu, "concretePlant", concretePlantMenuId++, clickArea);
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "concretePlant");
    this.itemProcessingThreeMaterial(this.tile, menu, recipeObj);
  }
}
class BrickFactory extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "brickFactory";
    this.productionTime = 16000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemAmountOutput = 0;
      this.tileData.fluidAmount = 0;
    }

    const menu = this.createMenu(OneMaterialsProcessingMenu, "brickFactory", brickFactoryMenuId++, clickArea);
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "brickFactory");
    this.itemProcessingTwoMaterial(this.tile, menu, recipeObj);
  }
}
class GlassFactory extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "glassFactory";
    this.productionTime = 16000;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput = 0;
    }

    const menu = this.createMenu(TwoMaterialsProcessingMenu, "glassFactory", glassFactoryMenuId++, clickArea);
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "glassFactory");
    this.itemProcessingTwoMaterial(this.tile, menu, recipeObj);
  }
}
//UPGRADES

//ORE PROCESSING

//Crusher
function crusherCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    console.log(cell.dataset.buildingType);
    if (cell.dataset.buildingType == "oreProcessing" || cell.classList.contains("activeTileOutline")) {
      console.log(cell);
      cell.classList.add("upgrade");
      let newBuilding = new Crusher(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuildingImage(true);
      newBuilding.createUpgrade();
      newBuilding.addEfficiency();
    }
  }
}
function washerCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    console.log(cell);
    console.log(cell.dataset.buildingType);
    if (cell.dataset.buildingType == "oreProcessing") {
      console.log(cell);
      cell.classList.add("upgrade");
      let newBuilding = new Washer(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuildingImage(true);
      newBuilding.createUpgrade();
      newBuilding.addWaterToRecipe();
    }
  }
}
//SMELTER

//Foundry
function foundryCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.buildingType == "smelter") {
      cell.classList.add("upgrade");
      let newBuilding = new Foundry(cell, foundryType);
      let mainTile = findMainTile(cell);
      if (!mainTile.dataset.selectedProduct) {
        newBuilding.getId(cell.id);
        newBuilding.createBuildingImage(true);
        newBuilding.createUpgrade();
        newBuilding.chooseRecipe();
      } else {
        alert(`Foundry for ${mainTile.dataset.selectedProduct} already exist`);
        delete newBuilding;
      }
    }
  }
}
