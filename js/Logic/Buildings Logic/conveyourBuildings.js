class Connector extends Conveyor {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "connector";
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
  exportItem() {
    const directionMapping = {
      up: this.findBottomTile(),
      right: this.findLeftTile(),
      down: this.findTopTile(),
      left: this.findRightTile(),
    };
    const previousTile = directionMapping[this.tileData.direction];
    const previousMainTile = findMainTile(previousTile);
    const nextTile = findTargetTileByDirection(this.tile, false);
    const nextMainTile = findTargetTileByDirection(this.tile, true);
    const buildingsCatList = [
      "in1Out1",
      "in1Out2",
      "in2Out1",
      "in2Out2",
      "in3Out1",
      "in3Out3",
      "Out",
      "In",
      "storage",
    ];
    const connectorImage = this.tile.querySelector(`[data-image-type="connector"]`);

    function setOutputItem(tile) {
      const previousMainTile = findMainTile(previousTile);
      console.log(previousMainTile);
      if (!previousMainTile) return;

      const tileData = previousMainTile.dataset;
      const outputItems = [tileData.itemTypeOutput1, tileData.itemTypeOutput2, tileData.itemTypeOutput3];
      const selectBlock = document.querySelector(".selectConnectorItemBlock");
      selectBlock.innerHTML = "";
      outputItems[0] ? selectBlock.classList.remove("hidden") : "";
      outputItems.forEach((item) => {
        if (!item) return;

        const itemObj = findItemObjInList(item);
        const itemBlock = document.createElement("div");
        itemBlock.classList.add("selectItem");
        console.log(itemObj);
        itemBlock.innerHTML = `
        <button class="connectorItem-button">
          <img src="${itemObj.imageSrc}"/>
        </button>
        <span>${itemObj.name}</span>`;

        selectBlock.appendChild(itemBlock);
        itemBlock.querySelector(".connectorItem-button").onclick = () => {
          tile.dataset.connectorFilter = item;
          const oldResImage = tile.querySelector(".connectorRes");
          oldResImage && oldResImage.remove();
          const resImage = document.createElement("img");
          resImage.classList.add("connectorRes");
          resImage.src = findItemObjInList(item).imageSrc;
          tile.appendChild(resImage);
          selectBlock.classList.add("hidden");
        };
      });
    }
    this.tile.onclick = () => setOutputItem(this.tile);
    this.tile.dataset.connectorType =
      "export" && previousMainTile && previousMainTile.dataset.semiFinishedType ? setOutputItem(this.tile) : "";
    this.tile.dataset.intervalId = setInterval(() => {
      if (
        buildingsCatList.includes(previousTile.dataset.buildingCategory) &&
        buildingsCatList.includes(nextTile.dataset.buildingCategory)
      ) {
        this.tile.dataset.connectorType = "mixed";
        changeConnImage("mix", this.tileData.direction);
      } else if (buildingsCatList.includes(previousTile.dataset.buildingCategory)) {
        this.tile.dataset.connectorType = "export";
        changeConnImage("exp", this.tileData.direction);
      } else if (buildingsCatList.includes(nextTile.dataset.buildingCategory)) {
        this.tile.dataset.connectorType = "import";
        changeConnImage("imp", this.tileData.direction);
      }
      function changeConnImage(type, dir) {
        const imageSrc = {
          up: `/img/conveyors/connectorTop-${type}.png`,
          right: `/img/conveyors/connectorRight-${type}.png`,
          down: `/img/conveyors/connectorDown-${type}.png`,
          left: `/img/conveyors/connectorLeft-${type}.png`,
        };
        connectorImage.src = imageSrc[dir];
      }

      function checkOutput(factoryData, connectorData) {
        switch (connectorData.connectorFilter) {
          case factoryData.itemTypeOutput1:
            return "itemAmountOutput1";
          case factoryData.itemTypeOutput2:
            return "itemAmountOutput2";
          case factoryData.itemTypeOutput3:
            return "itemAmountOutput3";
        }
      }
      const mainFactoryTile = findMainTile(previousTile);
      const currentOutputAmount =
        mainFactoryTile &&
        (mainFactoryTile.dataset.buildingType == "foundry" ||
          mainFactoryTile.dataset.buildingType == "smallFoundry" ||
          mainFactoryTile.dataset.buildingType == "oilRefinery")
          ? checkOutput(mainFactoryTile.dataset, this.tileData)
          : "itemAmountOutput1";

      if (mainFactoryTile && mainFactoryTile.dataset[currentOutputAmount] > 0 && this.tileData.itemType == "") {
        if (mainFactoryTile.dataset.buildingCategory != "storage") {
          this.moveItem(mainFactoryTile, this.tile, this.tileData.connectorFilter);
          mainFactoryTile.dataset[currentOutputAmount]--;
        } else {
          this.moveItem(mainFactoryTile, this.tile);
          mainFactoryTile.dataset[currentOutputAmount]--;
        }

        // if (
        //   nextMainTile &&
        //   nextMainTile.dataset.buildingCategory == "storage" &&
        //   nextMainTile.dataset.itemAmountOutput1 < nextMainTile.dataset.storageCapacity
        // ) {
        //   this.moveItem(mainFactoryTile, this.tile);
        //   mainFactoryTile.dataset.itemAmountOutput1--;
        // }
      }
    }, 500);
  }
}

class Splitter extends Connector {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "splitter";
    Object.assign(this, findTarget);
  }
  splitItems() {
    const topTile = this.findTopTile();
    const rightTile = this.findRightTile();
    const bottomTile = this.findBottomTile();
    const leftTile = this.findLeftTile();

    switch (this.tileData.direction) {
      case "up":
        return this.toSplit(this.tile, topTile, rightTile, leftTile);
      case "right":
        return this.toSplit(this.tile, topTile, rightTile, bottomTile);
      case "down":
        return this.toSplit(this.tile, rightTile, bottomTile, leftTile);
      case "left":
        return this.toSplit(this.tile, topTile, bottomTile, leftTile);
    }
  }
  toSplit(firstDir, secondDir, thirdDir) {
    let splitterCounter = 0;
    if (this.tileData.itemType != "") {
      switch (splitterCounter) {
        case 0:
          return firstDir;
        case 1:
          return secondDir;
        case 2:
          return thirdDir;
      }
      splitterCounter = (splitterCounter + 1) % 3;
    }
  }
}
class UndergroundConveyor extends Conveyor {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "undergroundConveyor";
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
  createUGDEntrance() {
    if (!this.tileData.possibleConnectWith) {
      this.tileData.undergroundType = "import";
      this.createUGDTiles();
    } else {
      this.tileData.undergroundType = "export";
      this.tileData.linkedWith = this.tileData.possibleConnectWith;
      const entranceTile = document.querySelector(`[data-building-id="${this.tileData.possibleConnectWith}"]`);
      entranceTile.dataset.linkedWith = this.tileData.buildingId;
      clearPossibleTiles(true);

      const bldImage = this.tile.querySelector(`[data-image-type="undergroundConveyor"]`);
      switch (entranceTile.dataset.direction) {
        case "up":
          bldImage.src = "/img/conveyors/ugdConveyorExportTop.png";
          break;
        case "right":
          bldImage.src = "/img/conveyors/ugdConveyorExportRight.png";
          break;
        case "down":
          bldImage.src = "/img/conveyors/ugdConveyorExportDown.png";
          break;
        case "left":
          bldImage.src = "/img/conveyors/ugdConveyorExportLeft.png";
          break;
      }
      this.tileData.direction = entranceTile.dataset.direction;
    }
  }
  createUGDTiles() {
    clearPossibleTiles();

    const directionOffsets = {
      up: { x: -1, z: 0 },
      right: { x: 0, z: 1 },
      down: { x: 1, z: 0 },
      left: { x: 0, z: -1 },
    };
    console.log(this.tileData.direction);
    for (let i = 0; i < 5; i++) {
      const { x: xOffset, z: zOffset } = directionOffsets[this.tileData.direction];
      const x = this.x + xOffset * i;
      const z = this.z + zOffset * i;

      const currentTile = document.getElementById(`${x}.${z}`);
      currentTile.dataset.possibleConnectWith = this.tileData.buildingId;
      currentTile.dataset.directionForExit = this.tileData.direction;
      currentTile.classList.add("possibleTile");
    }
  }
}
class Pipe extends DynamicBuildings {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "pipe";
    Object.assign(this, findTarget);
    Object.assign(this, ocupieTiles);
  }

  addPipeDirection() {
    const img = this.tile.querySelector(`[data-image-type="pipe"]:not([data-ghost-img="true"]`);

    this.tileData.undergroundType = "pipe";
    this.tileData.fluidType = "";

    switch (this.direction) {
      case 0:
      case 2:
        img.dataset.pipeType = "vertical";
        img.src = `/img/pipes/pipe-vertical.png`;
        break;
      case 1:
      case 3:
        img.dataset.pipeType = "horizontal";
        img.src = `/img/pipes/pipe-horizontal.png`;

        break;
    }
    this.moveFluid(this.tile);
  }

  moveFluid(currentTile) {
    const neighborsTiles = findNeighbors(currentTile);
    neighborsTiles.forEach((neighborTile) => {
      neighborTile.dataset.fluidType == "water" ? (currentTile.dataset.fluidType = "water") : null;
    });
    if (currentTile.dataset.fluidType == "water") {
      neighborsTiles.forEach((neighborTile) => {
        neighborTile.dataset.fluidType == "" ? spreadWater(neighborTile) : null;
      });
    }
    function spreadWater(currentPipe) {
      currentPipe.dataset.fluidType = "water";
      currentPipe.classList.add("activeTileOutline");
      const neighborsTiles = findNeighbors(currentPipe);
      neighborsTiles.forEach((tile) => {
        tile.dataset.fluidType == "" ? spreadWater(tile) : null;
      });
    }
  }
}
