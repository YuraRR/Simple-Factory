class OreProcessingPlant extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "oreProcessing";
    this.productionTime = 8000;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemAmountOutput = 0;
      this.tileData.fluidAmount = 0;
    }

    let processingStarted = false;
    this.tileData.productionTime = this.productionTime;

    let menu = this.createMenu(OreProccesingMenu, "ore-processing", oreProcessingMenuId, clickArea);

    setInterval(() => {
      if (
        this.tileData.itemAmount >= 2 &&
        !processingStarted
        // &&
        // this.tileData.fluidAmount >= 4 &&
        // this.tileData.fluidType == "water"
      ) {
        this.tileData.fluidAmount -= 4;

        let recipeObj = allProcessingOreRecipes.find(
          (recipe) => recipe.materialName === this.tileData.itemType
        );
        this.itemProcessingOneMaterial(this.findTargetTile(), menu, recipeObj);
        processingStarted = true;
      }
    }, 1000);
  }
}

class Smelter extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "smelter";
    this.productionTime = 4000;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }

  processing(clickArea) {
    console.log(clickArea);
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemAmountOutput = 0;
    }
    let processingStarted = false;
    this.tileData.productionTime = this.productionTime;
    //MENU CREATION

    let menu = this.createMenu(SmelterMenu, "smelter", smelterMenuId, clickArea);
    //PROCESSING INTERVAL
    setInterval(() => {
      let selectedProduct = this.tileData.selectedProduct;
      if (this.tileData.itemAmount != 0 && !processingStarted && selectedProduct) {
        let recipeObj = allSmeltingRecipes.find(
          (recipe) =>
            recipe.productSubtype === this.tileData.selectedProduct &&
            recipe.materialName === this.tileData.itemType
        );
        console.log(recipeObj);
        this.itemProcessingOneMaterial(this.findTargetTile(), menu, recipeObj);
        processingStarted = true;
      }
    }, 1000);
  }
}

class Assembler extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "assembler";
    this.productionTime = 16000;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    let processingStarted = false;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput = 0;
    }

    this.tileData.selectedProduct = "Iron frame";
    let menu = this.createMenu(AssemblerMenu, "assembler", assemblerMenuId, clickArea);

    setInterval(() => {
      let selectedProduct = this.tileData.selectedProduct;
      if (this.tileData.itemAmount != 0 && !processingStarted && selectedProduct) {
        let recipeObj = allAssemblyRecipes.find(
          (recipe) => recipe.productName == this.tileData.selectedProduct
        );
        this.itemProcessingTwoMaterial(this.tile, menu, recipeObj);
        processingStarted = true;
      }
    }, 1000);
  }
}
//UPGRADES

//ORE PROCESSING

//Crusher
function crusherCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    console.log(cell.dataset.buildingType);
    if (cell.dataset.buildingType == "oreProcessing") {
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
