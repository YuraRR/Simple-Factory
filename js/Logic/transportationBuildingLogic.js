class Conveyor extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "conveyor";
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
  addDirection() {
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
    }
    switch (this.direction) {
      case 0:
        this.tileData.direction = "up";
        this.tile.classList.add(`${this.name}Up`);
        this.moveItem(this.tile, this.findTopTile(), "conveyor");
        break;
      case 1:
        this.tileData.direction = "right";
        this.tile.classList.add(`${this.name}Right`);
        this.moveItem(this.tile, this.findRightTile(), "conveyor");
        break;
      case 2:
        this.tileData.direction = "down";
        this.tile.classList.add(`${this.name}Down`);
        this.moveItem(this.tile, this.findBottomTile(), "conveyor");
        break;
      case 3:
        this.tileData.direction = "left";
        this.tile.classList.add(`${this.name}Left`);
        this.moveItem(this.tile, this.findLeftTile(), "conveyor");
        break;
    }
  }
  restoreMovement(tile) {
    this.tile = tile;
    switch (this.tileData.direction) {
      case "up":
        this.moveItem(this.tile, this.findTopTile(), "conveyor");
        break;
      case "right":
        this.moveItem(this.tile, this.findRightTile(), "conveyor");
        break;
      case "down":
        this.moveItem(this.tile, this.findBottomTile(), "conveyor");
        break;
      case "left":
        this.moveItem(this.tile, this.findLeftTile(), "conveyor");
        break;
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
    let topTile = this.findTopTile();
    let rightTile = this.findRightTile();
    let bottomTile = this.findBottomTile();
    let leftTile = this.findLeftTile();
    switch (this.tileData.direction) {
      case "up":
        this.moveItem(bottomTile, this.tile, "conveyor");
        break;
      case "right":
        this.moveItem(leftTile, this.tile, "conveyor");
        break;
      case "down":
        this.moveItem(topTile, this.tile, "conveyor");
        break;
      case "left":
        this.moveItem(rightTile, this.tile, "conveyor");
        break;
    }
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
    let topTile = this.findTopTile();
    let rightTile = this.findRightTile();
    let bottomTile = this.findBottomTile();
    let leftTile = this.findLeftTile();

    switch (this.tileData.direction) {
      case "up":
        this.toSplit(this.tile, topTile, rightTile, leftTile);
        break;
      case "right":
        this.toSplit(this.tile, topTile, rightTile, bottomTile);
        break;
      case "down":
        this.toSplit(this.tile, rightTile, bottomTile, leftTile);
        break;
      case "left":
        this.toSplit(this.tile, topTile, bottomTile, leftTile);
        break;
    }
  }
  toSplit(tile, firstDir, secondDir, thirdDir) {
    this.tile = tile;
    let splitterCounter = 0;
    setInterval(() => {
      if (this.tileData.itemAmount > 0 || this.tileData.fluidAmount > 0) {
        switch (splitterCounter) {
          case 0:
            this.splitDirectionCheck(this.tile, firstDir);
            break;
          case 1:
            this.splitDirectionCheck(this.tile, secondDir);
            break;
          case 2:
            this.splitDirectionCheck(this.tile, thirdDir);
            break;
        }
        splitterCounter = (splitterCounter + 1) % 3;
      }
    }, 1000);
  }
  splitDirectionCheck(tile, dir) {
    this.tileData = tile.dataset;
    if (this.tileData.buildingType == "splitter") {
      if (dir.dataset.itemAmount == 0) {
        this.tileData.itemAmount--;
        dir.dataset.itemAmount++;
        dir.dataset.itemType = this.tileData.itemType;
      }
    } else {
      if (dir.dataset.fluidAmount == 0) {
        this.tileData.fluidAmount--;
        dir.dataset.fluidAmount++;
        dir.dataset.fluidType = this.tileData.fluidType;
      }
    }
  }
}

class Pipe extends Conveyor {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "pipe";
    Object.assign(this, findTarget);
  }
  addPipeDirection() {
    let img = this.tile.querySelector(`[data-image-type="pipe"]`);
    this.tileData.undergroundType = "pipe";
    if (!this.tileData.fluidAmount) {
      this.tileData.fluidAmount = 0;
    }

    switch (this.direction) {
      case 0:
        this.tileData.pipeDirection = "up";
        this.moveItem(this.tile, this.findTopTile(), "pipe");
        img.classList.add(`${this.name}Up`);
        break;
      case 1:
        this.tileData.pipeDirection = "right";
        this.moveItem(this.tile, this.findRightTile(), "pipe");
        img.classList.add(`${this.name}Right`);
        break;
      case 2:
        this.tileData.pipeDirection = "down";
        this.moveItem(this.tile, this.findBottomTile(), "pipe");
        img.classList.add(`${this.name}Down`);
        break;
      case 3:
        this.tileData.pipeDirection = "left";
        this.moveItem(this.tile, this.findLeftTile(), "pipe");
        img.classList.add(`${this.name}Left`);
        break;
    }
  }
  curvedPipeCreating() {
    let topTile = this.findTopTile();
    let topRightTile = this.findTopRightTile();
    let rightTile = this.findRightTile();
    let bottomTile = this.findBottomTile();
    let leftTile = this.findLeftTile();
    this.tileData.fluidAmount = 0;

    //prettier-ignore
    { 
            //TOP-RIGHT CORNER
            this.placeCurvedPipe(this.tile, topTile, rightTile, "pipeTopRightCorner", "up", "right");
            //RIGHT-BOTTOM CORNER
            this.placeCurvedPipe(this.tile, rightTile, bottomTile, "pipeRightBottomCorner", "right", "down");
            //BOTTOM-LEFT CORNER
            this.placeCurvedPipe(this.tile, bottomTile, leftTile, "pipeBottomLeftCorner", "down", "left");
            //LEFT-TOP CORNER
            this.placeCurvedPipe(this.tile, leftTile, topTile, "pipeLeftTopCorner", "left", "up");
          }
  }

  placeCurvedPipe(tile, firstTile, secondTile, pipeName, firstDir, secondDir) {
    if (
      firstTile.dataset.undergroundType == "pipe" &&
      secondTile.dataset.undergroundType == "pipe"
    ) {
      this.tile = tile;
      this.tile.children[0].classList.add(pipeName);
      this.tile.children[0].src = `/img/conveyors/${pipeName}.png`;
      if (firstTile.dataset.pipeDirection == firstDir) {
        this.tileData.pipeDirection = firstDir;
      } else {
        this.tileData.pipeDirection = secondDir;
      }
    }
  }
}
class FluidSplitter extends Splitter {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "fluidSplitter";
    Object.assign(this, findTarget);
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
    Object.assign(this, findTarget);
  }

  updateData(mainFactoryTile, type, selectedExportItem) {
    if (mainFactoryTile) {
      const data = mainFactoryTile.dataset;
      let itemName, itemAmount, multiplyMaterials;
      if (type == "export" && data.buildingType != "tradingTerminal") {
        itemName = data.itemTypeOutput;
        itemAmount = data.itemAmountOutput;
      } else if (type == "export" && data.buildingType == "tradingTerminal") {
        itemName = selectedExportItem;
        itemAmount = 99;
      } else if (type == "import" && data.buildingType == "assembler") {
        multiplyMaterials = {
          firstMatName: data.firstMatName,
          firstMatAmount: data.firstMatAmount,
          secondMatName: data.secondMatName,
          secondMatAmount: data.secondMatAmount,
        };
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
        imgSrc: itemInfo.src,
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

    let [currentX, currentZ] = findXZpos(currentTile);

    if (currentTile.id != pointB.id) {
      let neighborsTilesFunc = findNeighbors.bind(this, currentX, currentZ);
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
        let [currentX, currentZ] = findXZpos(currentTile);
        let [previousX, previousZ] = findXZpos(previousTile);
        let xDifference = currentX - previousX;
        let zDifference = currentZ - previousZ;
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
    const exportBuilding = findTargetTileByDirection(exportStation);
    const exportBldData = exportBuilding.dataset;
    const exportStData = exportStation.dataset;
    const importStation = routePointsList[routePointsList.length - 1];
    const importBuilding = findTargetTileByDirection(importStation);
    const importBldData = importBuilding.dataset;

    //Truck creation
    const truckBlock = document.createElement("div");
    const truckImg = document.createElement("img");

    //Truck menu creation
    const existMenu = document.querySelector(`#Truck${truckId}`);
    let truckMenuObj, menu;
    if (!truckId) truckId = truckIdCounter++;
    truckBlock.dataset.truckId = truckId;
    if (existMenu) {
      menu = existMenu;
    } else {
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
          } else if (
            routePointsList[routePointsList.length - 1].dataset.cargoStationType == "Import"
          ) {
            menuTruckState.textContent = "Unloading";
            setTimeout(() => {
              if (
                importBldData.buildingType == "tradingTerminal" &&
                importStation.dataset.cargoStationType == "Import"
              ) {
                money += 0.75 * (itemPrice * 8);
              }

              importBldData.itemAmount = parseInt(importBldData.itemAmount) + 8;
              importBldData.itemType = exportStData.cargoStationItem;
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
  const allRouteTiles = document.querySelectorAll(
    ".pointRoute, .topRoute, .rightRoute, .downRoute, .leftRoute"
  );
  allRouteTiles.forEach((tile) => {
    tile.classList.remove("pointRoute", "topRoute", "rightRoute", "downRoute", "leftRoute");
  });
}
