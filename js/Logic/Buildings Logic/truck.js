class Truck extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "truck";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  calculateRoute([currentTile, closedTilesList, alternativeWaysList, forkTile]) {
    let pointA = this.tile;
    let pointB = document.querySelector(`[data-station-id="${pointA.dataset.routeTo}"]`);
    console.log(pointB);
    console.log(pointA);
    if (!currentTile) return false;
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
      const neighborsTiles = findNeighbors(currentTile);
      let openTilesList = [];
      neighborsTiles.forEach((tile) => {
        if (
          tile.dataset.buildingType == "gravelRoad" ||
          tile.dataset.buildingType == "concreteRoad" ||
          tile.dataset.routeFrom
        ) {
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

        if (xDifference == 1) currentDirection = "down";
        else if (xDifference == -1) currentDirection = "top";
        if (zDifference == 1) currentDirection = "right";
        else if (zDifference == -1) currentDirection = "left";

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
        routeAvailable =
          importBldData.firstMatName === exportStItem || exportStData.connectedTo == "tradingTerminal";
        break;
      case "in2Out1":
      case "in2Out2":
        routeAvailable =
          importBldData.firstMatName === exportStItem ||
          importBldData.secondMatName === exportStItem ||
          exportStData.connectedTo == "tradingTerminal";
        break;
      case "in3Out1":
      case "in3Out3":
        routeAvailable =
          importBldData.firstMatName === exportStItem ||
          importBldData.secondMatName === exportStItem ||
          importBldData.thirdMatName === exportStItem ||
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
      if (exportStData.cargoStationType == "Import") {
        this.startBackwardsRoute(routePointsList, directionsList, "", deliveriesAmount);
        this.createRoute(routePointsList, this.reverseRouteDirections(directionsList).reverse());
        importStation.dataset.cargoStationItem = exportStation.dataset.cargoStationItem;
      } else {
        this.moveTransportImage(routePointsList, directionsList, "", deliveriesAmount);
        this.createRoute(routePointsList, directionsList);
        exportStation.dataset.cargoStationItem = importStation.dataset.cargoStationItem;
      }
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
    console.log(existMenu);
    if (existMenu) menu = existMenu;
    else {
      truckMenuObj = new TruckMenu(truckId, "itemName", exportStation, importStation);
      menu = truckMenuObj.menuCreation();
      console.log(menu);
      console.log(truckMenuObj);
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
      console.log(truckId);
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
        truckBlock.style.top = "-9px";
        truckBlock.style.left = "-5px";
        truckImg.src = "/img/transport/truckTop.png";
        break;
      case "right":
        truckBlock.style.top = "-2px";
        truckBlock.style.left = "-17px";
        truckImg.src = "/img/transport/truckRight.png";
        break;
      case "down":
        truckBlock.style.top = "-10px";
        truckBlock.style.left = "-25px";
        truckImg.src = "/img/transport/truckDown.png";
        break;
      case "left":
        truckBlock.style.top = "-17px";
        truckBlock.style.left = "-15px";
        truckImg.src = "/img/transport/truckLeft.png";
        break;
    }
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
          money -= itemPrice * 8;
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
                  offset = nextDir === "left" ? -45 : nextDir === "right" ? -33 : -40;
                  truckImg.src = "/img/transport/truckTop.png";
                  break;
                case "right":
                  property = "left";
                  offset = nextDir === "top" ? 45 : nextDir === "down" ? 36 : 40;
                  truckImg.src = "/img/transport/truckRight.png";
                  break;
                case "down":
                  property = "top";
                  offset = nextDir === "right" ? 45 : nextDir === "left" ? 33 : 40;
                  truckImg.src = "/img/transport/truckDown.png";
                  break;
                case "left":
                  property = "left";
                  offset = nextDir === "down" ? -45 : nextDir === "top" ? -33 : -40;
                  truckImg.src = "/img/transport/truckLeft.png";
                  break;
              }

              currentStyle = parseInt(getComputedStyle(truckBlock)[property]) || 0;
              truckBlock.style[property] = currentStyle + offset + "px";
            }

            setTruckPos();

            let truckSpeed;
            if (routePointsList[index].dataset.roadType == "gravelRoad") {
              truckSpeed = 1000;
              truckBlock.style.transition = "all 1s linear";
            } else {
              truckSpeed = 700;
              truckBlock.style.transition = "all 0.7s linear";
            }

            index++;
            setTimeout(moveStep, truckSpeed);
            transportHasStarted = true;
          } else if (routePointsList[routePointsList.length - 1].dataset.cargoStationType == "Import") {
            menuTruckState.textContent = "Unloading";
            setTimeout(() => {
              if (
                importBldData.buildingType == "tradingTerminal" &&
                importStation.dataset.cargoStationType == "Import"
              ) {
                moneySound();
                money += 0.75 * (itemPrice * 8);
              }

              const currentItem = exportStData.cargoStationItem;
              if (importBldData.buildingCategory != "storage") {
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
                trucksAvailable++;
                updateTrucksAmountInfo();
                updateTrucksInGarage();
                const truckInRouteInfo = document.querySelector(`#truck_${truckId}`);
                truckInRouteInfo && truckInRouteInfo.remove();
              }
              truckBlock.classList.add("fade-in");
              truckBlock.remove();
              clearInterval(waitingInterval);
            }, 4000);
          } else {
            menuTruckState.textContent = "Unloading";
            setTimeout(() => {
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
        this.moveTransportImage(
          routePointsList.reverse(),
          reversedDirectionsList.reverse(),
          truckBlock.dataset.truckId,
          deliveriesAmount
        );
      } else {
        trucksAvailable++;
        updateTrucksAmountInfo();
        updateTrucksInGarage();
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
  createRoute(routePointsList, directionsList) {
    const stationA = routePointsList[0];
    const stationB = routePointsList[routePointsList.length - 1];
    const isRouteExist = allRoutesList.some((route) => route.id == stationA.dataset.routeId);

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
      allRoutesList.push(routeObj);
      stationA.dataset.routeId = routeObj.id;
      stationB.dataset.routeId = routeObj.id;
      addStyleToRoute(routePointsList, stationA, stationB, routeObj.color);
      console.log(routeObj);
      addRouteInfoToMenu(routeObj);
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
    routeObj && this.drawRoute(routeObj);
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
