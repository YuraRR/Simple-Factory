class Truck extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "truck";
    this.tile = tile;
    this.isRouteFound = false;
    Object.assign(this, findTarget);
  }

  calculateRoute([currentTile, closedTilesList = []]) {
    const pointA = this.tile;
    const pointB = document.querySelector(`[data-station-id="${pointA.dataset.routeTo}"]`);

    const currentClosedTilesList = [...closedTilesList];

    if (currentTile.id == pointB.id && !this.isRouteFound) {
      this.isRouteFound = true;
      currentClosedTilesList.push(currentTile);
      return currentClosedTilesList;
    }

    const neighborsTiles = findNeighbors(currentTile);

    let openTilesList = [];
    neighborsTiles.forEach((tile) => {
      if ((tile.dataset.roadType || tile == pointA || tile == pointB) && !currentClosedTilesList.includes(tile)) {
        openTilesList.push(tile);
      }
    });

    const fCostsList = openTilesList.map((tile) => {
      const hCost = findcost(pointB, tile);
      const gCost = findcost(pointA, tile);
      return { tile, cost: hCost + gCost, hCost };
    });

    currentClosedTilesList.push(currentTile);
    for (let i = 0; i < fCostsList.length; i++) {
      const nextTile = fCostsList[i].tile;
      const result = this.calculateRoute([nextTile, currentClosedTilesList]);
      if (result) return result;
    }
  }

  createRouteDirections(routePointsList, deliveriesAmount) {
    let previousTile;
    let directionsList = [];
    routePointsList.forEach((currentTile) => {
      if (previousTile) {
        const [currentX, currentZ] = findXZpos(currentTile);
        const [previousX, previousZ] = findXZpos(previousTile);
        const xDifference = currentX - previousX;
        const zDifference = currentZ - previousZ;
        let currentDirection;

        if (xDifference == 1 && zDifference == 0) currentDirection = "down";
        else if (xDifference == -1 && zDifference == 0) currentDirection = "top";
        if (zDifference == 1 && xDifference == 0) currentDirection = "right";
        else if (zDifference == -1 && xDifference == 0) currentDirection = "left";

        directionsList.push(currentDirection);
      }

      previousTile = currentTile;
    });

    let exportStation = routePointsList[0];
    let importStation = routePointsList[routePointsList.length - 1];
    if (exportStation.dataset.cargoStationType == "Import") {
      let temp = importStation;
      importStation = exportStation;
      exportStation = temp;
    }

    const exportStData = exportStation.dataset;
    const exportStItem = exportStData.cargoStationItem;

    const importBuilding = document.querySelector(`[data-building-id="${importStation.dataset.connectedToId}"]`);
    const importBldData = importBuilding.dataset;
    let routeAvailable;
    switch (importBldData.buildingCategory) {
      case "in1Out1":
      case "in1Out2":
      case "In":
        routeAvailable =
          importBldData.materialName1 === exportStItem || exportStData.connectedTo == "tradingTerminal";
        break;
      case "in2Out1":
      case "in2Out2":
        routeAvailable =
          importBldData.materialName1 === exportStItem ||
          importBldData.materialName2 === exportStItem ||
          exportStData.connectedTo == "tradingTerminal";
        break;
      case "in3Out1":
      case "in3Out3":
        routeAvailable =
          importBldData.materialName1 === exportStItem ||
          importBldData.materialName2 === exportStItem ||
          importBldData.materialName3 === exportStItem ||
          exportStData.connectedTo == "tradingTerminal";
        break;
      case "storage":
        routeAvailable =
          !importBldData.itemTypeOutput1 ||
          importBldData.itemTypeOutput1 === exportStItem ||
          exportStData.connectedTo == "tradingTerminal";
        break;
      case "terminal":
        routeAvailable = true;
        break;
    }
    if (routeAvailable) {
      this.moveTransportImage(routePointsList, directionsList, "", deliveriesAmount);
      this.createRoute(routePointsList, directionsList);
      importStation.dataset.cargoStationItem = exportStation.dataset.cargoStationItem;
      return true;
    } else {
      return false;
    }
  }
  moveTransportImage(routePointsList, directionsList, truckId, deliveriesAmount) {
    //Stations
    const exportStation = routePointsList[0];
    const exportBuilding = document.querySelector(`[data-building-id="${exportStation.dataset.connectedToId}"]`);
    const exportBldData = exportBuilding.dataset;
    const exportStData = exportStation.dataset;

    const importStation = routePointsList[routePointsList.length - 1];
    const importBuilding = document.querySelector(`[data-building-id="${importStation.dataset.connectedToId}"]`);
    const importBldData = importBuilding.dataset;

    //Truck creation
    const truckBlock = document.createElement("div");
    const truckImg = document.createElement("img");

    //Truck menu creation
    const existMenu = document.querySelector(`#Truck${truckId}`);
    let truckMenuObj, menu;
    !truckId && (truckId = truckIdCounter++);
    truckBlock.dataset.truckId = truckId;
    if (existMenu) menu = existMenu;
    else {
      truckMenuObj = new TruckMenu(truckId, exportStData.cargoStationItem, exportStation, importStation);
      menu = truckMenuObj.menuCreation();
      truckMenuObj.removeTruck(truckBlock);
    }
    truckBlock.onclick = () => {
      menu.classList.remove("hidden");
      !allOpenedMenu.includes(menu) && allOpenedMenu.push(menu);
    };
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
    const routeIndex = allRoutesList.findIndex((route) => route.id == exportStData.routeId);

    if (routeIndex != -1) {
      const trucksList = allRoutesList[routeIndex].trucks;

      const truckObj = {
        truckId: truckId,
        routeId: exportStData.routeId,
        resourcesLeft: deliveriesAmount * 8,
        truckBlock: truckBlock,
      };
      if (!trucksList.some((truck) => truck.id == truckObj.id)) {
        trucksList.push(truckObj);
      }
      addTruckToRouteInfo(truckObj);
    }

    //Starting position
    switch (directionsList[1]) {
      case "top":
        truckImg.src = "./img/transport/truckTop.png";
        break;
      case "right":
        truckImg.src = "./img/transport/truckRight.png";
        break;
      case "down":
        truckImg.src = "./img/transport/truckDown.png";
        break;
      case "left":
        truckImg.src = "./img/transport/truckLeft.png";
        break;
    }
    truckBlock.style.top = "0";
    truckBlock.style.left = "0";
    menuTruckState.textContent = "Loading";
    const waitingInterval = setInterval(() => {
      const itemName = exportStData.cargoStationItem;
      if (
        (exportBldData.itemAmountOutput1 >= 8 ||
          exportStData.cargoStationType == "Import" ||
          exportBldData.buildingType == "tradingTerminal") &&
        !transportHasStarted
      ) {
        if (exportStData.cargoStationType == "Export") {
          //Resource marker
          resourceMarkerBlock.classList.remove("hidden");
          resourceMarkerQuantify.textContent = "8/8";
          if (exportBldData.buildingType != "tradingTerminal") {
            exportBldData.itemAmountOutput1 -= 8;
          }
          allItems.find((item) => {
            item.name == itemName && (resourceMarkerImg.src = item.imageSrc);
            truckMenuObj && truckMenuObj.updateMenu(itemName);
          });
        } else resourceMarkerBlock.classList.add("hidden");

        const itemPrice = (allItems.find((item) => item.name === itemName) || {}).price;
        if (
          exportBldData.buildingType == "tradingTerminal" &&
          exportStation.dataset.cargoStationType == "Export"
        ) {
          showMoneyChange(itemPrice * 8, "minus");
        }
        menuTruckState.textContent = "Moving";
        let index = 0;
        const moveStep = () => {
          if (index < directionsList.length) {
            function setTruckPos() {
              let dir = directionsList[index];
              let currentStyle, property, offset;
              let nextDir = directionsList[index + 1];
              switch (dir) {
                case "top":
                  property = "top";
                  offset = -40;
                  truckImg.src = "./img/transport/truckTop.png";
                  break;
                case "right":
                  property = "left";
                  offset = 40;
                  truckImg.src = "./img/transport/truckRight.png";
                  break;
                case "down":
                  property = "top";
                  offset = 40;
                  truckImg.src = "./img/transport/truckDown.png";
                  break;
                case "left":
                  property = "left";
                  offset = -40;
                  truckImg.src = "./img/transport/truckLeft.png";
                  break;
              }

              currentStyle = parseInt(getComputedStyle(truckBlock)[property]) || 0;
              truckBlock.style[property] = currentStyle + offset + "px";
              const [x, z] = findXZpos(routePointsList[index + 1]);
              truckBlock.style.zIndex = x + z + 2;
            }

            setTruckPos();

            let truckSpeed;
            if (routePointsList[index].dataset.roadType == "gravelRoad") {
              truckSpeed = 800;
              truckBlock.style.transition = "all 0.8s linear";
            } else {
              truckSpeed = 500;
              truckBlock.style.transition = "all 0.5s linear";
            }

            index++;
            deltaTimeout(moveStep, truckSpeed);
            transportHasStarted = true;
          } else if (routePointsList[routePointsList.length - 1].dataset.cargoStationType == "Import") {
            menuTruckState.textContent = "Unloading";
            deltaTimeout(() => {
              if (
                importBldData.buildingType == "tradingTerminal" &&
                importStation.dataset.cargoStationType == "Import"
              ) {
                showMoneyChange(0.75 * (itemPrice * 8), "plus");
                const itemExportObj = itemsExported.find((item) => item.name == itemName);
                itemExportObj.totalAmount += 8;
                notyf.open({
                  type: "smallNotyf",
                  message: `8 ${itemName} was sold for ${0.75 * (itemPrice * 8)} $`,
                });
              }

              const currentItem = exportStData.cargoStationItem;
              if (importBldData.buildingCategory != "storage") {
                if (!importBldData.materialName1 || importBldData.materialName1 == currentItem) {
                  importBldData.materialAmount1 = addResAmount(importBldData.materialAmount1);
                  importBldData.materialName1 = currentItem;
                } else if (!importBldData.materialName2 || importBldData.materialName2 == currentItem) {
                  importBldData.materialAmount2 = addResAmount(importBldData.materialAmount2);
                  importBldData.materialName2 = currentItem;
                } else if (!importBldData.materialName3 || importBldData.materialName3 == currentItem) {
                  importBldData.materialName3 = currentItem;
                  importBldData.materialAmount3 = addResAmount(importBldData.materialAmount3);
                }
              } else if (importBldData.buildingCategory == "storage") {
                importBldData.itemAmountOutput1 = addResAmount(importBldData.itemAmountOutput1);
                importBldData.itemTypeOutput1 = currentItem;
              }

              function addResAmount(data) {
                return (parseInt(data, 10) + 8).toString();
              }
              deliveriesAmount--;
              if (deliveriesAmount > 0) {
                this.startBackwardsRoute(routePointsList, directionsList, truckBlock, deliveriesAmount);
              } else {
                updateTrucksInGarage("", "", "plus");
                updateTrucksAmountInfo();
                const truckInRouteInfo = document.querySelector(`#truck_${truckId}`);
                truckInRouteInfo && truckInRouteInfo.remove();
              }
              truckBlock.classList.add("fade-in");
              truckBlock.remove();
              clearInterval(waitingInterval);
            }, 4000);
          } else {
            menuTruckState.textContent = "Unloading";
            deltaTimeout(() => {
              this.startBackwardsRoute(routePointsList, directionsList, truckBlock, deliveriesAmount);
              truckBlock.remove();

              clearInterval(waitingInterval);
            }, 4000);
          }
        };

        moveStep();
      }
    }, 700);
  }
  startBackwardsRoute(routePointsList, directionsList, truckBlock, deliveriesAmount) {
    if (!truckBlock) {
      const reversedDirectionsList = this.reverseRouteDirections(directionsList);
      this.moveTransportImage(routePointsList.reverse(), reversedDirectionsList.reverse(), "", deliveriesAmount);
    } else {
      if (truckBlock.dataset.toRemove != "true") {
        const reversedDirectionsList = this.reverseRouteDirections(directionsList);
        const reversedPoints = _.cloneDeep(routePointsList);
        this.moveTransportImage(
          reversedPoints.reverse(),
          reversedDirectionsList.reverse(),
          truckBlock.dataset.truckId,
          deliveriesAmount
        );
      } else {
        updateTrucksInGarage("", "", "plus");
        updateTrucksAmountInfo();
        const truckInRouteInfo = document.querySelector(`#truck_${truckBlock.dataset.truckId}`);
        truckInRouteInfo && truckInRouteInfo.remove();
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

  drawRoute(routeObj) {
    routeObj.stationA.classList.add("pointRoute");
    routeObj.stationB.classList.add("pointRoute");
    if (routeObj.drawRoutePointsList[0] != routeObj.stationA) {
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
          deltaTimeout(() => {
            routeObj.drawRoutePointsList[index].classList.add("routeColorChange");
          }, 60);
          deltaTimeout(() => {
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
