class Conveyor extends Building {
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
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemType = "";
    }

    const directionMapping = { 0: "up", 1: "right", 2: "down", 3: "left" };
    const directionInfo = directionMapping[this.direction];
    this.tileData.direction = directionInfo;
  }
  // restoreMovement(tile) {
  //   this.tile = tile;
  //   switch (this.tileData.direction) {
  //     case "up":
  //       this.moveItem(this.tile, this.findTopTile(), "conveyor");
  //       break;
  //     case "right":
  //       this.moveItem(this.tile, this.findRightTile(), "conveyor");
  //       break;
  //     case "down":
  //       this.moveItem(this.tile, this.findBottomTile(), "conveyor");
  //       break;
  //     case "left":
  //       this.moveItem(this.tile, this.findLeftTile(), "conveyor");
  //       break;
  //   }
  // }
  // moveItem(exporter, importer, wayOfMoving) {
  //   let currentItem;
  //   const importData = importer.dataset;
  //   const exportData = exporter.dataset;
  //   switch (wayOfMoving) {
  //     case "conveyor":
  //       const conveyorIntervalId = setInterval(() => {
  //         switch (exportData.buildingType) {
  //           case "conveyor":
  //           case "connector":
  //           case "storage":
  //           case "splitter":
  //             currentItem = exportData.itemType;
  //             break;
  //           case "mineshaft":
  //           case "smelter":
  //           case "oreProcessing":
  //           case "cementPlant":
  //             currentItem = exportData.itemTypeOutput;
  //             break;
  //         }

  //         //CONVEYOR TO CONVEYOR
  //         if (
  //           importData.buildingType == "conveyor" &&
  //           exportData.buildingType != "splitter" &&
  //           (exportData.buildingCategory != "inOut1" || exportData.buildingCategory != "inOut2") &&
  //           exportData.itemAmount > 0 &&
  //           importData.itemAmount == 0
  //         ) {
  //           this.move(importer, exporter, currentItem);
  //           if (exportData.itemAmount == 0) {
  //             exportData.itemType = "none";
  //           }

  //           //CONVEYOR TO CONNECTOR
  //         } else if (
  //           (importData.buildingType == "connector" || importData.buildingType == "splitter") &&
  //           exportData.buildingType == "conveyor" &&
  //           exportData.itemAmount > 0
  //         ) {
  //           importData.itemAmount++;
  //           importData.itemType = currentItem;
  //           if (
  //             (exportData.buildingCategory == "inOut1" || exportData.buildingCategory == "inOut2") &&
  //             exportData.itemAmountOutput > 0
  //           ) {
  //             exportData.itemAmountOutput--;
  //           } else if (exportData.buildingCategory == "inOut1" || exportData.buildingCategory == "inOut2") {
  //             exportData.itemAmount--;
  //           }
  //           if (exportData.itemAmount == 0) {
  //             exportData.itemType = "none";
  //           }
  //           //BUILDING TO CONNECTOR
  //         } else if (
  //           importData.buildingType == "connector" &&
  //           (exportData.buildingCategory == "Out" ||
  //             exportData.buildingCategory == "inOut1" ||
  //             exportData.buildingCategory == "inOut2")
  //         ) {
  //           const newExporter = findMainTile(exporter);
  //           if (newExporter.dataset.itemAmountOutput > 0) {
  //             importData.itemAmount++;
  //             importData.itemType = newExporter.dataset.itemTypeOutput;
  //             newExporter.dataset.itemAmountOutput--;
  //           }

  //           //CONNECTOR TO BUILDING
  //         } else if (
  //           exportData.buildingType == "connector" &&
  //           exportData.itemAmount > 0 &&
  //           (importData.buildingCategory == "inOut1" || importData.buildingType == "storage")
  //         ) {
  //           const newImporter = findMainTile(importer);
  //           this.move(newImporter, exporter, currentItem);
  //           //STORAGE TO CONNECTOR
  //         } else if (importData.buildingType == "connector" && exportData.buildingType == "storage") {
  //           const newExporter = findMainTile(exporter);

  //           if (newExporter.dataset.itemAmount > 0) {
  //             importer.dataset.itemAmount++;
  //             importer.dataset.itemType = newExporter.dataset.itemType;
  //             newExporter.dataset.itemAmount--;
  //           }

  //           //CONNECTOR TO ASSEMBLER
  //         } else if (
  //           importData.buildingCategory == "inOut2" &&
  //           exportData.buildingType == "connector" &&
  //           exportData.itemAmount > 0
  //         ) {
  //           let newImporter = findMainTile(importer);
  //           if (!newImporter.dataset.firstMatName || newImporter.dataset.firstMatName == currentItem) {
  //             newImporter.dataset.firstMatAmount++;
  //             newImporter.dataset.firstMatName = currentItem;
  //             exportData.itemAmount--;
  //           } else if (!newImporter.dataset.secondMatName || newImporter.dataset.secondMatName == currentItem) {
  //             newImporter.dataset.secondMatAmount++;
  //             newImporter.dataset.secondMatName = currentItem;
  //             exportData.itemAmount--;
  //           }
  //         } else if (
  //           importData.buildingCategory == "inOut3" &&
  //           exportData.buildingType == "connector" &&
  //           currentItem
  //         ) {
  //           const newImporter = findMainTile(importer);
  //           if (!newImporter.dataset.firstMatName || newImporter.dataset.firstMatName == currentItem) {
  //             newImporter.dataset.firstMatAmount++;
  //             newImporter.dataset.firstMatName = currentItem;
  //             exportData.itemAmount--;
  //           } else if (!newImporter.dataset.secondMatName || newImporter.dataset.secondMatName == currentItem) {
  //             newImporter.dataset.secondMatAmount++;
  //             newImporter.dataset.secondMatName = currentItem;
  //             exportData.itemAmount--;
  //           } else if (!newImporter.dataset.thirdMatName || newImporter.dataset.thirdMatName == currentItem) {
  //             newImporter.dataset.thirdMatAmount++;
  //             newImporter.dataset.thirdMatName = currentItem;
  //             exportData.itemAmount--;
  //           }
  //         }
  //       }, 1000);
  //       exportData.intervalId = conveyorIntervalId;
  //       break;
  //     //PIPE
  //     case "pipe":
  //       setInterval(() => {
  //         if (exportData.fluidAmount > 0 && importData.fluidAmount < 10 && importData.undergroundType == "pipe") {
  //           importData.fluidType = exportData.fluidType;
  //           importData.fluidAmount++;
  //           exportData.fluidAmount--;
  //         } else if (
  //           exportData.fluidAmount > 0 &&
  //           importData.fluidAmount < 10 &&
  //           importData.upgradeType == "Washer"
  //         ) {
  //           let newImporter = findMainTile(importer);
  //           newImporter.dataset.fluidType = exportData.fluidType;
  //           newImporter.dataset.fluidAmount++;
  //           exportData.fluidAmount--;
  //         }
  //       }, 500);
  //       break;
  //   }
  // }
  moveItem(factoryTile, nextTile) {
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
      if (currentTileData.connectorType == "import") {
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
        } else {
          factoryData.itemAmount++;
          factoryData.itemType = resName;
        }
      } //Conveyor move condition
      else if (
        currentTile.dataset.connectorType == "export" ||
        currentTile.dataset.buildingType == "conveyor" ||
        currentTile.dataset.buildingType == "splitter"
      ) {
        let nextTile = findTargetTileByDirection(currentTile, false);
        if (currentTile.dataset.buildingType == "splitter" && currentTile.dataset.itemType == "") {
          resImage.remove();
          resImage = createResImage(currentTile);
          nextTile = this.splitItems(currentTile);
        }
        const nextTileData = nextTile.dataset;
        const [currentX, currentZ] = findXZpos(nextTile);
        const [previousX, previousZ] = findXZpos(currentTile);
        const xDifference = currentX - previousX;
        const zDifference = currentZ - previousZ;

        let conveyorDirection;
        if (xDifference == 1) conveyorDirection = "down";
        else if (xDifference == -1) conveyorDirection = "top";
        if (zDifference == 1) conveyorDirection = "right";
        else if (zDifference == -1) conveyorDirection = "left";

        const directionsInfo = {
          top: { property: "top", offset: -40 },
          right: { property: "left", offset: 40 },
          down: { property: "top", offset: 40 },
          left: { property: "left", offset: -40 },
        };
        const directionInfo = directionsInfo[conveyorDirection];
        const { property, offset } = directionInfo;
        const currentStyle = parseInt(getComputedStyle(resImage)[property]) || 0;
        let isTilesFree;
        if (nextTileData.buildingType == "splitter") isTilesFree = this.splitItems(nextTile);

        if ((nextTileData.itemType == "" && nextTileData.buildingType != "splitter") || isTilesFree) {
          continueMove();
        } else {
          const waitInterval = setInterval(() => {
            if (nextTileData.buildingType == "splitter") isTilesFree = this.splitItems(nextTile);
            if ((nextTileData.itemType == "" && nextTileData.buildingType != "splitter") || isTilesFree) {
              continueMove();
              clearInterval(waitInterval);
            }
          }, 100);
        }

        function continueMove() {
          console.log(currentTileData);
          const isImageExist = document.querySelector(`[data-image-item-id="${currentTileData.itemId}"]`);
          console.log(isImageExist);
          if (
            (nextTileData.buildingType == "conveyor" || nextTileData.connectorType == "import" || isTilesFree) &&
            isImageExist
          ) {
            resImage.style[property] = currentStyle + offset + "px";
            setTimeout(() => {
              moveStep(nextTile, resImage);
              currentTileData.itemType = "";
              currentTileData.itemId = "";
            }, 750);
            if (nextTileData.buildingType == "conveyor") {
              nextTile.dataset.itemId = resImage.dataset.imageItemId;
              nextTile.dataset.itemType = resName;
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
    const neighborsTilesFunc = findNeighbors.bind(this, tile);
    const neighborsTiles = neighborsTilesFunc();

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
    console.log(this.splitterCounter);
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

    this.tile.dataset.intervalId = setInterval(() => {
      previousTile.dataset.buildingType == "conveyor"
        ? (this.tile.dataset.connectorType = "import")
        : (this.tile.dataset.connectorType = "export");

      const mainFactoryTile = findMainTile(previousTile);
      if (mainFactoryTile && mainFactoryTile.dataset.itemAmountOutput > 0 && this.tileData.itemType == "") {
        this.moveItem(mainFactoryTile, this.tile);
        mainFactoryTile.dataset.itemAmountOutput--;
      }
    }, 750);
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
  // splitDirectionCheck(tile, nextTile) {
  //   this.tileData = tile.dataset;
  //   if (this.tileData.buildingType == "splitter") {
  //     if (nextTileData.itemAmount == 0) {
  //       this.tileData.itemAmount--;
  //       nextTileData.itemAmount++;
  //       nextTileData.itemType = this.tileData.itemType;
  //     }
  //   } else {
  //     if (nextTileData.fluidAmount == 0) {
  //       this.tileData.fluidAmount--;
  //       nextTileData.fluidAmount++;
  //       nextTileData.fluidType = this.tileData.fluidType;
  //     }
  //   }
  // }
}

class Pipe extends Conveyor {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "pipe";
    Object.assign(this, findTarget);
    Object.assign(this, ocupieTiles);
  }
  moveFluid(currentTile) {
    const neighborsTilesFunc = findNeighbors.bind(this, currentTile);
    const neighborsTiles = neighborsTilesFunc();
    neighborsTiles.forEach((tile) => {
      if (tile.dataset.fluidType == "water") {
        currentTile.dataset.fluidType = "water";
      }
    });
    neighborsTiles.forEach((tile) => {
      if (currentTile.dataset.fluidType == "water") {
        tile.dataset.fluidType = "water";
      }
    });
  }
  addPipeDirection() {
    const img = this.tile.querySelector(`[data-image-type="pipe"]`);
    this.tileData.undergroundType = "pipe";
    this.tileData.fluidType = "";
    switch (this.direction) {
      case 0:
      case 2:
        img.dataset.pipeType = "vertical";
        img.src = `/img/pipes/vertical.png`;
        break;
      case 1:
      case 3:
        img.dataset.pipeType = "horizontal";
        img.src = `/img/pipes/horizontal.png`;
        break;
    }
    this.moveFluid(this.tile);
  }
  curvedPipeCreating() {
    const neighborsTiles = findNeighbors(this.tile);
    const [topTile, rightTile, bottomTile, leftTile] = neighborsTiles;

    const neighborsPipes = {
      currentPipe: this.tile,
      topPipe: topTile,
      rightPipe: rightTile,
      bottomPipe: bottomTile,
      leftPipe: leftTile,
    };

    function pipesConditions(currentPipe) {
      const [topPipe, rightPipe, bottomPipe, leftPipe] = findNeighbors(currentPipe).map((tile) =>
        tile.dataset.undergroundType === "pipe" ? tile : null
      );

      return {
        cross: currentPipe && topPipe && rightPipe && bottomPipe && leftPipe,
        tShapeTop: currentPipe && topPipe && leftPipe && rightPipe,
        tShapeRight: currentPipe && rightPipe && topPipe && bottomPipe,
        tShapeBottom: currentPipe && bottomPipe && leftPipe && rightPipe,
        tShapeLeft: currentPipe && leftPipe && topPipe && bottomPipe,
        topRightCorner: currentPipe && topPipe && rightPipe,
        rightBottomCorner: currentPipe && rightPipe && bottomPipe,
        bottomLeftCorner: currentPipe && bottomPipe && leftPipe,
        leftTopCorner: currentPipe && leftPipe && topPipe,
        vertical: (currentPipe && topPipe) || (currentPipe && bottomPipe),
        horizontal: (currentPipe && leftPipe) || (currentPipe && rightPipe),
      };
    }

    setPipeType(neighborsPipes.currentPipe);

    neighborsTiles.forEach((pipe) => {
      if (pipe.dataset.undergroundType === "pipe") {
        setPipeType(pipe);
      }
    });

    function setPipeType(pipe) {
      for (const [type, condition] of Object.entries(pipesConditions(pipe))) {
        if (condition) {
          const pipeImg = pipe.querySelector('[data-image-type="pipe"]');
          pipeImg.dataset.pipeType = type;
          pipeImg.src = `/img/pipes/${type}.png`;
          break;
        }
      }
    }
  }

  placeCurvedPipe(tile, firstTile, secondTile, pipeName, firstDir, secondDir) {
    // if (firstTile.dataset.undergroundType == "pipe" && secondTile.dataset.undergroundType == "pipe") {
    //   this.tile = tile;
    //   const pipeImg = this.tile.querySelector[`data-image-type="pipe"`];
    //   pipeImg.classList.add(pipeName);
    //   pipeImg.src = `/img/conveyors/${pipeName}.png`;
    //   if (firstTile.dataset.pipeDirection == firstDir) {
    //     this.tileData.pipeDirection = firstDir;
    //   } else {
    //     this.tileData.pipeDirection = secondDir;
    //   }
    // }
  }
}
class Road extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "road";
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
}
class CargoStation extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "cargoStation";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  updateData(mainFactoryTile, type, selectedExportItem) {
    if (mainFactoryTile) {
      const data = mainFactoryTile.dataset;
      let itemName, itemAmount;
      if (type == "export" && data.buildingType != "tradingTerminal") {
        itemName = data.itemTypeOutput;
        itemAmount = data.itemAmountOutput;
      } else if (type == "export" && data.buildingType == "tradingTerminal") {
        itemName = selectedExportItem;
        itemAmount = 99;
      } else if (type == "import") {
        itemName = selectedExportItem;
        if (itemName == data.itemType) itemAmount = data.itemAmount;
        else if (itemName == data.firstMatName) itemAmount = data.firstMatAmount;
        else if (itemName == data.secondMatName) itemAmount = data.secondMatAmount;
        else if (itemName == data.thirdMatName) itemAmount = data.thirdMatAmount;
        else itemAmount = 0;
      } else {
        itemName = data.itemType;
        itemAmount = mainFactoryTile.dataset.itemAmount;
      }
      let itemInfo = allItems.find((item) => item.name == itemName);
      if (!itemInfo) {
        itemInfo = {};
        itemInfo.price = 0;
        itemInfo.src = "";
      }
      const itemDataObj = {
        name: itemName,
        amount: parseInt(itemAmount, 10),
        multiplyMaterials: 0,
        buyPrice: itemInfo.price,
        sellPrice: itemInfo.price * 0.75,
        amountPerMin: 60 || 0,
        imgSrc: itemInfo.imageSrc,
        mainFactoryTile: mainFactoryTile,
        stationTile: this.tile,
        stationObj: this,
      };

      return itemDataObj;
    }
  }

  calculateRoute([currentTile, closedTilesList, alternativeWaysList, forkTile]) {
    let pointA = this.findTargetTile();
    let pointB = document.querySelector(`[data-station-id="${pointA.dataset.routeTo}"]`);
    if (alternativeWaysList && !currentTile) {
      currentTile = Array.from(alternativeWaysList).reduce((closest, tile) =>
        findcost(pointB, tile) < findcost(pointB, closest) ? tile : closest
      );
      let currentTileIndex = alternativeWaysList.indexOf(currentTile);
      let startIndex = closedTilesList.indexOf(forkTile);
      closedTilesList.splice(startIndex + 1, closedTilesList.length - startIndex - 1);
      alternativeWaysList.splice(currentTileIndex, 1);
    }

    if (currentTile.id != pointB.id) {
      let neighborsTilesFunc = findNeighbors.bind(this, currentTile);
      const neighborsTiles = neighborsTilesFunc();
      let openTilesList = [];
      neighborsTiles.forEach((tile) => {
        if (tile.dataset.buildingType == "road" || tile.dataset.routeFrom) {
          openTilesList.push(tile);
        }
      });
      let fCostsList = [];
      openTilesList.forEach((tile) => {
        let hCost = findcost(pointB, tile);
        let gCost = findcost(pointA, tile);
        let fCost = hCost + gCost;
        fCostsList.push(fCost);
      });

      const commonElements = closedTilesList.filter((element) => openTilesList.includes(element));
      commonElements.forEach((closedTile) => {
        let indexOfClosedTile = openTilesList.indexOf(closedTile);
        openTilesList.splice(indexOfClosedTile, 1);
        fCostsList.splice(indexOfClosedTile, 1);
      });
      let minFcost = Math.min.apply(null, fCostsList);
      let index = fCostsList.indexOf(minFcost);
      let closestTile = openTilesList[index];
      if (!alternativeWaysList) alternativeWaysList = [];
      if (openTilesList.length > 1) {
        openTilesList.forEach((openTile) => {
          if (openTile != closestTile) alternativeWaysList.push(openTile);
        });
        forkTile = currentTile;
      }

      closedTilesList.push(currentTile);
      return this.calculateRoute([closestTile, closedTilesList, alternativeWaysList, forkTile]);
    } else {
      closedTilesList.push(pointB);
      return closedTilesList;
    }
  }
  createRouteDirections(routePointsList) {
    let previousTile;
    let directionsList = [];
    routePointsList.forEach((currentTile) => {
      if (previousTile) {
        const [currentX, currentZ] = findXZpos(currentTile);
        const [previousX, previousZ] = findXZpos(previousTile);
        const xDifference = currentX - previousX;
        const zDifference = currentZ - previousZ;
        let currentDirection;

        if (xDifference == 1) currentDirection = "down";
        else if (xDifference == -1) currentDirection = "top";
        if (zDifference == 1) currentDirection = "right";
        else if (zDifference == -1) currentDirection = "left";

        directionsList.push(currentDirection);
      }

      previousTile = currentTile;
    });
    if (routePointsList[0].dataset.cargoStationType == "Import") {
      this.startBackwardsRoute(routePointsList, directionsList);
      this.createRoute(routePointsList, this.reverseRouteDirections(directionsList).reverse());
    } else {
      this.moveTransportImage(routePointsList, directionsList);
      this.createRoute(routePointsList, directionsList);
    }
  }
  moveTransportImage(routePointsList, directionsList, truckId) {
    //Stations
    const exportStation = routePointsList[0];
    const exportBuilding = findTargetTileByDirection(exportStation, true);
    const exportBldData = exportBuilding.dataset;
    const exportStData = exportStation.dataset;
    const importStation = routePointsList[routePointsList.length - 1];
    const importBuilding = findTargetTileByDirection(importStation, true);
    const importBldData = importBuilding.dataset;

    //Truck creation
    const truckBlock = document.createElement("div");
    const truckImg = document.createElement("img");

    //Truck menu creation
    const existMenu = document.querySelector(`#Truck${truckId}`);
    let truckMenuObj, menu;
    if (!truckId) truckId = truckIdCounter++;
    truckBlock.dataset.truckId = truckId;

    if (existMenu) menu = existMenu;
    else {
      truckMenuObj = new TruckMenu(truckId, "itemName", exportStation, importStation);
      menu = truckMenuObj.menuCreation();
      truckMenuObj.removeTruck(truckBlock);
      truckBlock.onclick = () => {
        menu.classList.remove("hidden");
        if (!allOpenedMenu.includes(menu)) allOpenedMenu.push(menu);
      };
    }

    const menuTruckState = menu.querySelector(".truckMenu__truckState");
    //Resource marker
    const resourceMarkerBlock = document.createElement("div");
    const resourceMarkerImg = document.createElement("img");
    const resourceMarkerQuantify = document.createElement("span");

    resourceMarkerBlock.classList.add("resource-marker", "hidden");
    resourceMarkerBlock.appendChild(resourceMarkerImg);
    resourceMarkerBlock.appendChild(resourceMarkerQuantify);

    truckBlock.classList.add("truck");
    truckBlock.appendChild(resourceMarkerBlock);
    truckBlock.appendChild(truckImg);
    exportStation.appendChild(truckBlock);

    let transportHasStarted;
    // const routeIndex = allRoutesList.findIndex((route) => route.id == exportStData.routeId);
    // if (routeIndex != -1) {
    //   const trucksList = allRoutesList[routeIndex].trucks;
    //   const truckObj = {
    //     id: 1,
    //     img: truckBlock,
    //   };
    //   if (!trucksList.some((truck) => truck.id == truckObj.id)) {
    //     trucksList.push(truckObj);
    //   }
    //   console.log(allRoutesList);
    // }

    //Starting position
    switch (directionsList[1]) {
      case "top":
        truckBlock.style.top = "-14px";
        truckBlock.style.left = "-11px";
        truckImg.src = "/img/transport/truckTop.png";
        break;
      case "right":
        truckBlock.style.top = "-5px";
        truckBlock.style.left = "-20px";
        truckImg.src = "/img/transport/truckRight.png";
        break;
      case "down":
        truckBlock.style.top = "-10px";
        truckBlock.style.left = "-30px";
        truckImg.src = "/img/transport/truckDown.png";
        break;
      case "left":
        truckBlock.style.top = "-25px";
        truckBlock.style.left = "-15px";
        truckImg.src = "/img/transport/truckLeft.png";
        break;
    }
    menuTruckState.textContent = "Loading";
    const waitingInterval = setInterval(() => {
      const itemName = exportStData.cargoStationItem;
      if (
        (exportBldData.itemAmountOutput >= 8 ||
          exportStData.cargoStationType == "Import" ||
          exportBldData.buildingType == "tradingTerminal") &&
        !transportHasStarted
      ) {
        if (exportStData.cargoStationType == "Export") {
          //Resource marker
          resourceMarkerBlock.classList.remove("hidden");
          resourceMarkerQuantify.textContent = "8/8";
          if (exportBldData.buildingType != "tradingTerminal") {
            exportBldData.itemAmountOutput -= 8;
          }
          allItems.find((item) => {
            if (item.name == itemName) resourceMarkerImg.src = item.src;
            if (truckMenuObj) truckMenuObj.updateMenu(itemName);
          });
        } else resourceMarkerBlock.classList.add("hidden");

        const itemPrice = (allItems.find((item) => item.name === itemName) || {}).price;
        if (
          exportBldData.buildingType == "tradingTerminal" &&
          exportStation.dataset.cargoStationType == "Export"
        ) {
          money -= itemPrice * 8;
          console.log(money);
        }
        menuTruckState.textContent = "Moving";
        let index = 0;
        const moveStep = () => {
          if (index < directionsList.length) {
            let dir = directionsList[index];
            let currentStyle, property, offset;
            let nextDir = directionsList[index + 1];

            switch (dir) {
              case "top":
                property = "top";
                offset = nextDir === "left" ? -50 : nextDir === "right" ? -35 : -40;
                truckImg.src = "/img/transport/truckTop.png";
                break;
              case "right":
                property = "left";
                offset = nextDir === "top" ? 50 : nextDir === "down" ? 35 : 40;
                truckImg.src = "/img/transport/truckRight.png";
                break;
              case "down":
                property = "top";
                offset = nextDir === "right" ? 50 : nextDir === "left" ? 35 : 40;
                truckImg.src = "/img/transport/truckDown.png";
                break;
              case "left":
                property = "left";
                offset = nextDir === "down" ? -50 : nextDir === "top" ? -35 : -40;
                truckImg.src = "/img/transport/truckLeft.png";
                break;
            }

            currentStyle = parseInt(getComputedStyle(truckBlock)[property]) || 0;
            truckBlock.style[property] = currentStyle + offset + "px";

            index++;
            setTimeout(moveStep, 700);
            transportHasStarted = true;
          } else if (routePointsList[routePointsList.length - 1].dataset.cargoStationType == "Import") {
            menuTruckState.textContent = "Unloading";
            setTimeout(() => {
              if (
                importBldData.buildingType == "tradingTerminal" &&
                importStation.dataset.cargoStationType == "Import"
              ) {
                money += 0.75 * (itemPrice * 8);
              }

              const currentItem = exportStData.cargoStationItem;
              if (importBldData.buildingCategory == "inOut3" || importBldData.buildingCategory == "inOut2") {
                if (!importBldData.firstMatName || importBldData.firstMatName == currentItem) {
                  importBldData.firstMatAmount = addResAmount(importBldData.firstMatAmount);
                  importBldData.firstMatName = currentItem;
                } else if (!importBldData.secondMatName || importBldData.secondMatName == currentItem) {
                  importBldData.secondMatAmount = addResAmount(importBldData.secondMatAmount);
                  importBldData.secondMatName = currentItem;
                } else if (!importBldData.thirdMatName || importBldData.thirdMatName == currentItem) {
                  importBldData.thirdMatName = currentItem;
                  importBldData.thirdMatAmount = addResAmount(importBldData.thirdMatAmount);
                }
              } else {
                importBldData.itemAmount = addResAmount(importBldData.itemAmount);
                importBldData.itemType = currentItem;
              }

              function addResAmount(data) {
                return (parseInt(data, 10) + 8).toString();
              }

              this.startBackwardsRoute(routePointsList, directionsList, truckBlock);
              truckBlock.remove();
              clearInterval(waitingInterval);
            }, 4000);
          } else {
            menuTruckState.textContent = "Unloading";
            setTimeout(() => {
              this.startBackwardsRoute(routePointsList, directionsList, truckBlock);
              truckBlock.remove();
              clearInterval(waitingInterval);
            }, 4000);
          }
        };

        moveStep();
      }
    }, 700);
  }
  startBackwardsRoute(routePointsList, directionsList, truckBlock) {
    if (!truckBlock) {
      const reversedDirectionsList = this.reverseRouteDirections(directionsList);
      this.moveTransportImage(routePointsList.reverse(), reversedDirectionsList.reverse());
    } else {
      if (truckBlock.dataset.toRemove != "true") {
        const reversedDirectionsList = this.reverseRouteDirections(directionsList);
        this.moveTransportImage(
          routePointsList.reverse(),
          reversedDirectionsList.reverse(),
          truckBlock.dataset.truckId
        );
      } else {
        truckBlock.remove();
      }
    }
  }
  reverseRouteDirections(directionsList) {
    return directionsList.map((direction) => {
      switch (direction) {
        case "top":
          return "down";
        case "right":
          return "left";
        case "down":
          return "top";
        case "left":
          return "right";
      }
    });
  }
  createRoute(routePointsList, directionsList) {
    const stationA = routePointsList[0];
    const stationB = routePointsList[routePointsList.length - 1];
    const isRouteExist = allRoutesList.some((route) => route.id == stationA.dataset.routeId);
    console.log(routePointsList);
    let routeObj;
    if (!isRouteExist) {
      routeObj = {
        id: routeId++,
        trucks: [],
        stationA: stationA,
        stationB: stationB,
        drawRoutePointsList: routePointsList,
        drawDirectionsList: directionsList,
        color: getRandomColor(),
      };
      console.log(routePointsList);
      allRoutesList.push(routeObj);
      stationA.dataset.routeId = routeObj.id;
      stationB.dataset.routeId = routeObj.id;
      addStyleToRoute(routePointsList, stationA, stationB, routeObj.color);
    }
    function getRandomColor() {
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    }
    function addStyleToRoute(points, stationA, stationB, color) {
      const newColor = `routeColor-${Date.now() % 10000}`;
      const styleElement = document.createElement("style");
      const lineColor = `.${newColor}::after { background-color: ${color}; }`;
      const pointColor = `.${newColor}::before { background-color: ${color}; }`;
      const combinedStyles = lineColor + " " + pointColor;

      styleElement.appendChild(document.createTextNode(combinedStyles));
      document.head.appendChild(styleElement);

      points.forEach((point) => {
        point.classList.add(newColor);
      });

      stationA.classList.add(newColor);
      stationB.classList.add(newColor);
    }
    this.drawRoute(routeObj);
  }
  drawRoute(routeObj) {
    console.log(routeObj);
    routeObj.stationA.classList.add("pointRoute");
    routeObj.stationB.classList.add("pointRoute");
    if (routeObj.drawRoutePointsList[0] != routeObj.stationA) {
      console.log(routeObj.drawRoutePointsList);
      const reversedDrawRoutePointsList = routeObj.drawRoutePointsList.slice().reverse();
      for (let i = 0; i < routeObj.drawDirectionsList.length; i++) {
        let dir = routeObj.drawDirectionsList[i];
        reversedDrawRoutePointsList[i].classList.add(`${dir}Route`);
      }
    } else {
      for (let i = 0; i < routeObj.drawDirectionsList.length; i++) {
        let dir = routeObj.drawDirectionsList[i];
        routeObj.drawRoutePointsList[i].classList.add(`${dir}Route`);
      }
    }

    animateRoute(0);

    function animateRoute(index) {
      if (routeObj.stationA.classList.contains("pointRoute")) {
        if (index < routeObj.drawDirectionsList.length) {
          setTimeout(() => {
            routeObj.drawRoutePointsList[index].classList.add("routeColorChange");
          }, 60);
          setTimeout(() => {
            routeObj.drawRoutePointsList[index].classList.remove("routeColorChange");
            animateRoute(index + 1);
          }, 120);
        } else {
          // Добавлено условие завершения
          animateRoute(0);
        }
      }
    }
  }
}
class TradingTerminal extends Building {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "tradingTerminal";
    Object.assign(this, findTarget);
  }
}

function hideRoutes() {
  const allRouteTiles = document.querySelectorAll(".pointRoute, .topRoute, .rightRoute, .downRoute, .leftRoute");
  allRouteTiles.forEach((tile) => {
    tile.classList.remove("pointRoute", "topRoute", "rightRoute", "downRoute", "leftRoute");
  });
}
