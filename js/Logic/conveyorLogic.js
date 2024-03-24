class DynamicBuildings extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }

  curvedObjCreating() {
    const neighborsTiles = findNeighbors(this.tile);
    const [topTile, rightTile, bottomTile, leftTile] = neighborsTiles;

    const neighborsObjects = {
      currentObj: this.tile,
      topObj: topTile,
      rightObj: rightTile,
      bottomObj: bottomTile,
      leftObj: leftTile,
    };

    function placementConditions(currentObj) {
      const [topObj, rightObj, bottomObj, leftObj] = findNeighbors(currentObj).map((tile) => {
        if (currentTool == "pipe") {
          return tile.dataset.undergroundType === "pipe" ? tile : null;
        } else if (currentTool == "conveyor") {
          return tile.dataset.bildingType === "conveyor" ? tile : null;
        }
      });

      return {
        cross: currentObj && topObj && rightObj && bottomObj && leftObj,
        tShapeTop: currentObj && topObj && leftObj && rightObj,
        tShapeRight: currentObj && rightObj && topObj && bottomObj,
        tShapeBottom: currentObj && bottomObj && leftObj && rightObj,
        tShapeLeft: currentObj && leftObj && topObj && bottomObj,
        topRightCorner: currentObj && topObj && rightObj,
        rightBottomCorner: currentObj && rightObj && bottomObj,
        bottomLeftCorner: currentObj && bottomObj && leftObj,
        leftTopCorner: currentObj && leftObj && topObj,
        vertical: (currentObj && topObj) || (currentObj && bottomObj),
        horizontal: (currentObj && leftObj) || (currentObj && rightObj),
      };
    }

    setObjType(neighborsObjects.currentObj);

    neighborsTiles.forEach((tile) => tile.dataset.undergroundType === "pipe" && setObjType(tile));

    function setObjType(obj) {
      for (const [type, condition] of Object.entries(placementConditions(obj))) {
        if (condition) {
          const objImg = obj.querySelector('[data-image-type="pipe"]:not([data-ghost-img="true"]');
          if (objImg.dataset.pipeType != "connector") {
            objImg.dataset.pipeType = type;
            objImg.src = `/img/pipes/${type}.png`;
          }

          break;
        }
      }
    }
  }
}

class Conveyor extends DynamicBuildings {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "conveyor";
    this.tile = tile;
    this.tileData = tile.dataset;
    this.splitterCounter = 0;
    Object.assign(this, findTarget);
  }
  addDirection() {
    !this.tileData.itemAmount ? (this.tileData.itemType = "") : null;

    const directionMapping = { 0: "up", 1: "right", 2: "down", 3: "left" };
    const directionInfo = directionMapping[this.direction];
    this.tileData.direction = directionInfo;
  }
  moveItem(factoryTile, nextTile) {
    const possibleTypes = ["conveyor", "splitter", "undergroundConveyor"];
    function createResImage(tile) {
      const img = document.createElement("img");
      img.src = findItemObjInList(resName).imageSrc;
      img.dataset.itemType = resName;
      img.dataset.imageType = "conveyorImg";
      img.dataset.imageItemId = conveyorItemId++;

      tile.appendChild(img);
      return img;
    }

    const resName = factoryTile.dataset.itemTypeOutput;
    const resImage = createResImage(nextTile);
    //Moving loop
    const moveStep = (currentTile, resImage) => {
      const currentTileData = currentTile.dataset;
      //Import condition
      if (["import", "mixed"].includes(currentTileData.connectorType)) {
        resImage.remove();
        const mainFactoryTile = findTargetTileByDirection(currentTile, true);
        const factoryData = mainFactoryTile.dataset;
        if (factoryData.buildingCategory == "inOut3" || factoryData.buildingCategory == "inOut2") {
          if (!factoryData.firstMatName || factoryData.firstMatName == resName) {
            factoryData.firstMatAmount++;
            factoryData.firstMatName = resName;
          } else if (!factoryData.secondMatName || factoryData.secondMatName == resName) {
            factoryData.secondMatAmount++;
            factoryData.secondMatName = resName;
          } else if (!factoryData.thirdMatName || factoryData.thirdMatName == resName) {
            factoryData.thirdMatAmount++;
            factoryData.thirdMatName = resName;
          }
        } else if (
          (factoryData.buildingCategory == "storage" && !factoryData.itemTypeOutput) ||
          factoryData.itemTypeOutput == resName
        ) {
          factoryData.itemAmountOutput++;
          factoryData.itemTypeOutput = resName;
        } else {
          factoryData.itemAmount++;
          factoryData.itemType = resName;
        }

        if (currentTileData.connectorType == "mixed") {
          currentTileData.itemType = "";
          currentTileData.itemId = "";
        }
      } //Conveyor move condition
      else if (currentTileData.connectorType == "export" || possibleTypes.includes(currentTileData.buildingType)) {
        let nextTile = findTargetTileByDirection(currentTile, false);
        if (currentTileData.buildingType == "splitter" && currentTileData.itemType == "") {
          resImage.remove();
          resImage = createResImage(currentTile);
          nextTile = this.splitItems(currentTile);
        }
        if (currentTileData.buildingType == "undergroundConveyor") {
          const exitTile = document.querySelector(`[data-linked-with="${currentTileData.buildingId}"]`);
          if (exitTile) {
            resImage.remove();
            resImage = createResImage(exitTile);
            currentTile = exitTile;
            nextTile = findTargetTileByDirection(exitTile, false);

            currentTile.dataset.itemId = resImage.dataset.imageItemId;
            currentTile.dataset.itemType = resName;
          }
        }
        const nextTileData = nextTile.dataset;
        const [currentX, currentZ] = findXZpos(nextTile);
        const [previousX, previousZ] = findXZpos(currentTile);
        const xDifference = currentX - previousX;
        const zDifference = currentZ - previousZ;

        let conveyorDirection;
        if (currentTileData.direction == "down" || currentTileData.direction == "up") {
          if (xDifference == 1) conveyorDirection = "down";
          if (xDifference == -1) conveyorDirection = "up";
          if (zDifference == 1) conveyorDirection = "right";
          if (zDifference == -1) conveyorDirection = "left";
        } else {
          if (xDifference == 1) conveyorDirection = "down";
          else if (xDifference == -1) conveyorDirection = "up";
          else if (zDifference == 1) conveyorDirection = "right";
          else if (zDifference == -1) conveyorDirection = "left";
        }

        const splitterOffsets = {
          up: { property: "top", offset: -40 },
          right: { property: "left", offset: 40 },
          down: { property: "top", offset: 40 },
          left: { property: "left", offset: -40 },
        };

        const directionInfo = splitterOffsets[conveyorDirection];
        const { property, offset } = directionInfo;
        const currentStyle = parseInt(getComputedStyle(resImage)[property]) || 0;
        let isTilesFree;
        //Splitter condition
        if (nextTileData.buildingType == "splitter") {
          isTilesFree = this.splitItems(nextTile);
        }
        // Main condition
        (nextTileData.itemType == "" &&
          (nextTileData.buildingType != "splitter" || nextTileData.buildingType == "undergroundConveyor")) ||
        isTilesFree
          ? continueMove()
          : waitingSpace.bind(this)();
        // Waiting condition
        function waitingSpace() {
          const waitInterval = setInterval(() => {
            if (nextTileData.buildingType == "splitter") isTilesFree = this.splitItems(nextTile);
            if (
              (nextTileData.itemType == "" && nextTileData.buildingType != "splitter") ||
              isTilesFree ||
              (nextTileData.buildingType == "undergroundConveyor" &&
                nextTileData.linkedWith &&
                nextTileData.itemType == "")
            ) {
              continueMove();
              clearInterval(waitInterval);
            }
          }, 100);
        }

        function continueMove() {
          const isImageExist = document.querySelector(`[data-image-item-id="${currentTileData.itemId}"]`);
          let importConnectorAvailable;
          if (nextTileData.connectorType == "import") {
            const mainFactoryTile = findTargetTileByDirection(nextTile, true);
            const factoryData = mainFactoryTile.dataset;
            switch (factoryData.buildingCategory) {
              case "inOut1":
                importConnectorAvailable = !factoryData.itemType || factoryData.itemType === resName;
                break;
              case "inOut2":
                importConnectorAvailable =
                  !factoryData.firstMatName ||
                  !factoryData.secondMatName ||
                  factoryData.firstMatName === resName ||
                  factoryData.secondMatName === resName;
                break;
              case "inOut3":
                importConnectorAvailable =
                  !factoryData.firstMatName ||
                  !factoryData.secondMatName ||
                  !factoryData.thirdMatName ||
                  factoryData.firstMatName === resName ||
                  factoryData.secondMatName === resName ||
                  factoryData.thirdMatName === resName;
                break;
              case "storage":
                importConnectorAvailable = !factoryData.itemTypeOutput || factoryData.itemTypeOutput === resName;
                break;
            }
          }
          if (
            isImageExist ||
            currentTileData.buildingType == "splitter" ||
            currentTileData.buildingType == "undergroundConveyor"
          ) {
            const canMakeNextMove =
              nextTileData.buildingType == "conveyor" ||
              importConnectorAvailable ||
              isTilesFree ||
              nextTileData.linkedWith;

            canMakeNextMove ? makeNextMove() : waitingSpace();

            function makeNextMove() {
              resImage.classList.add("fade-in");
              resImage.style[property] = currentStyle + offset + "px";
              if (nextTileData.buildingType == "connector" || nextTileData.buildingType == "splitter") {
                resImage.classList.add("fade-out");
              }

              setTimeout(() => {
                moveStep(nextTile, resImage);
              }, 750);

              setTimeout(() => {
                currentTileData.itemType = "";
                currentTileData.itemId = "";
              }, 100);

              if (nextTileData.buildingType == "conveyor" || nextTileData.buildingType == "undergroundConveyor") {
                nextTile.dataset.itemId = resImage.dataset.imageItemId;
                nextTile.dataset.itemType = resName;
              }
            }
          }
        }
      }
    };
    //Start first move
    if (nextTile.dataset.itemType == "") {
      nextTile.dataset.itemId = resImage.dataset.imageItemId;
      nextTile.dataset.itemType = resName;
      moveStep(nextTile, resImage);
    }
  }
  splitItems(tile) {
    const neighborsTiles = findNeighbors(tile);

    const topTile = neighborsTiles[0];
    const rightTile = neighborsTiles[1];
    const bottomTile = neighborsTiles[2];
    const leftTile = neighborsTiles[3];

    switch (tile.dataset.direction) {
      case "up":
        return this.toSplit(topTile, rightTile, leftTile);
      case "right":
        return this.toSplit(topTile, rightTile, bottomTile);
      case "down":
        return this.toSplit(rightTile, bottomTile, leftTile);
      case "left":
        return this.toSplit(topTile, bottomTile, leftTile);
    }
  }
  toSplit(firstDir, secondDir, thirdDir) {
    switch (this.splitterCounter) {
      case 0:
        this.splitterCounter = (this.splitterCounter + 1) % 3;
        if (firstDir.dataset.itemType == "") return firstDir;
      case 1:
        this.splitterCounter = (this.splitterCounter + 1) % 3;
        if (secondDir.dataset.itemType == "") return secondDir;
      case 2:
        this.splitterCounter = (this.splitterCounter + 1) % 3;
        if (thirdDir.dataset.itemType == "") return thirdDir;
      default:
        if (firstDir.dataset.itemType == "") return firstDir;
        else if (secondDir.dataset.itemType == "") return secondDir;
        else if (thirdDir.dataset.itemType == "") return thirdDir;
    }
  }
}
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
    const nextTile = findTargetTileByDirection(this.tile, false);
    const buildingsCatList = ["inOut1", "inOut2", "inOut3", "Out", "In", "storage"];
    const connectorImage = this.tile.querySelector(`[data-image-type="connector"]`);
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

      const mainFactoryTile = findMainTile(previousTile);
      if (mainFactoryTile && mainFactoryTile.dataset.itemAmountOutput > 0 && this.tileData.itemType == "") {
        this.moveItem(mainFactoryTile, this.tile);
        mainFactoryTile.dataset.itemAmountOutput--;
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
        img.src = `/img/pipes/vertical.png`;
        console.log(this.direction);
        break;
      case 1:
      case 3:
        img.dataset.pipeType = "horizontal";
        img.src = `/img/pipes/horizontal.png`;

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
