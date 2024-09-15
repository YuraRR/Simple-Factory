const routesMenuList = document.querySelector(".routesInfo-menu__routesList");
const routesInfoMenu = document.querySelector("#routesInfo-menu");
const modalMenu = document.querySelector(".tool-menu__modal");

function addRouteInfoToMenu(id, color) {
  const htmlContent = `
    <div class="routesInfo-menu__info">
      <span class="routesInfo-menu__id" style="background-color: ${color}">Line ${id} </span>
      <div class="routesInfo-menu__stations">
        <select class="routesInfo-menu__station" id="export${id}" data-station-a>
          <option value="" selected disabled>Export Station</option>
        </select>
        <img class="routesInfo-menu__arrowRight" src="./img/buttonIcons/arrow.png" />
        <select class="routesInfo-menu__station" id="import${id}" data-station-b>
          <option value="" selected disabled>Import Station</option>
        </select>
      </div>

      <div class="routesInfo-menu__item">
        <img class="routesInfo-menu__itemImg" src="./img/resourcesIcons/noItem.webp" />
        <span class="routesInfo-menu__itemName">Select Item</span>
        <div class="routesInfo-menu__itemSelect hidden"></div>
      </div>
      
      <button class="routesInfo-menu__arrow rotate-out hidden"> </button>
      <div class="routesInfo-menu__buttons">
       <button id="accept"> </button>
       <button id="decline"> </button>
      </div>

    </div>
    <div class="routesInfo-menu__trucksList">
    <span class="routesInfo-menu__quantityText">Delivery Quantity</span>
      <div class="routesInfo-menu__quantityBlock">
        <button class="minusBtn"></button>
        <span class="routesInfo-menu__quantity">8</span>
        <button class="plusBtn"></button>
        <label for="isInfinite"> Ꝏ Delivery</label>
        <input type="checkbox" id="isInfinite" name="isInfinite">
      </div>
      <button id="addTruck">Add truck 
      <img class="routesInfo-menu__plus" src="./img/buttonIcons/whitePlus.png" />
    </button>
    </div>`;

  const newElement = document.createElement("div");
  newElement.innerHTML = htmlContent;
  newElement.classList.add("routesInfo-menu__route");
  newElement.dataset.activeRoute = "";
  newElement.id = `route_${id}`;

  const lastChild = routesMenuList.lastElementChild;
  routesMenuList.insertBefore(newElement, lastChild);

  const stations = routesMenuList.querySelectorAll(".routesInfo-menu__station");

  stations.forEach((st) => {
    st.addEventListener("mousedown", (event) => {
      if (event.target === st) {
        addStationToList(st);
      } else {
        event.stopPropagation();
      }
    });
  });

  const routeBlock = routesMenuList.querySelector(`#route_${id}`);

  const createRouteButton = routeBlock.querySelector(`#accept`);
  const addTruckButton = routeBlock.querySelector(`#addTruck`);
  const selectItemButton = routeBlock.querySelector(".routesInfo-menu__item");
  const exportStationSel = routeBlock.querySelector(`[data-station-a]`);
  const importStationSel = routeBlock.querySelector(`[data-station-b]`);

  selectItemButton.onclick = () => {
    const activeRoute = document.querySelector(`[data-active-route]`);
    if (activeRoute != routeBlock) return;
    if (!exportStationSel.value || !importStationSel.value) return notyf.error("Stations is not selected!");

    const exportStation = document.querySelector(`[data-station-id="${exportStationSel.value}"]`);
    const importStation = document.querySelector(`[data-station-id="${importStationSel.value}"]`);
    const mainFactoryTile = document.querySelector(`[data-building-id="${exportStation.dataset.connectedToId}"]`);
    selectItem(routeBlock, mainFactoryTile, exportStation, importStation);
  };
  createRouteButton.onclick = () => {
    const exportStationTile = document.querySelector(`[data-station-id="${exportStationSel.value}"]`);
    const importStationTile = document.querySelector(`[data-station-id="${importStationSel.value}"]`);

    const itemName = routeBlock.querySelector(`.routesInfo-menu__itemName`).textContent;

    if (!exportStationTile || !importStationTile) return notyf.error("Select Export and Import stations!");

    if (itemName == "Select Item") return notyf.error("Select Item!");

    if (checkRouteValid(exportStationTile, importStationTile, id, color)) {
      createRouteButton.remove();
      showTrucksListBtn.classList.remove("hidden");
      routeBlock.removeAttribute(`data-active-route`);
      exportStationSel.disabled = true;
      importStationSel.disabled = true;
    }
  };

  const declineRouteButton = routesMenuList.querySelector(`#route_${id} #decline`);
  declineRouteButton.onclick = () => {
    routeId > 1 && routeId--;
    routesMenuList.removeChild(routesMenuList.querySelector(`#route_${id}`));

    const routeObj = allRoutesList.find((route) => route.id == id);
    if (!routeObj) return;

    const stationDataA = routeObj.stationA.dataset;
    const stationDataB = routeObj.stationB.dataset;
    stationDataA.routeId = stationDataA.routeFrom = stationDataA.routeTo = "";
    stationDataB.routeId = stationDataB.routeFrom = stationDataB.routeTo = "";
    const indexToRemove = allRoutesList.indexOf(routeObj);
    allRoutesList.splice(indexToRemove, 1);

    if (!routeObj.trucks) return;
    routeObj.trucks.forEach((truck) => {
      const truckElem = document.querySelector(`[data-truck-id="${truck.truckId}"]`);
      truckElem && (truckElem.dataset.toRemove = "true");
    });
  };

  const quantityValue = routeBlock.querySelector(".routesInfo-menu__quantity");
  const quantityPlusBtn = routeBlock.querySelector(".plusBtn");
  const quantityMinusBtn = routeBlock.querySelector(".minusBtn");
  let deliveriesNum = 8;

  quantityPlusBtn.onclick = () => {
    deliveriesNum == 9999 ? (deliveriesNum = 8) : "";
    deliveriesNum < 256 && (quantityValue.textContent = deliveriesNum += 8);
  };
  quantityMinusBtn.onclick = () => {
    deliveriesNum == 9999 ? (deliveriesNum = 8) : "";
    quantityValue.textContent = deliveriesNum > 8 ? (deliveriesNum -= 8) : 8;
  };
  addTruckButton.onclick = () => startTruck(id, deliveriesNum, trucksList);

  const showTrucksListBtn = routeBlock.querySelector(`.routesInfo-menu__arrow`);
  const trucksList = routeBlock.querySelector(`.routesInfo-menu__trucksList`);
  showTrucksListBtn.onclick = () => {
    routesMenuList.querySelectorAll(".routesInfo-menu__trucksList").forEach((e) => {
      trucksList != e && e.classList.remove("visible");
    });
    trucksList.classList.toggle("visible");
  };

  routesMenuList.scrollTop = routesMenuList.scrollHeight;
}
function addStationToList(select) {
  while (select.children.length > 1) {
    select.removeChild(select.children[1]);
  }
  select.children[0].selected = true;
  const itemSelect = document.querySelector(`[data-active-route] .routesInfo-menu__itemSelect`);
  itemSelect.classList.add("hidden");
  stationsList.forEach((station) => {
    const factoryData = document.querySelector(`[data-building-id="${station.dataset.connectedToId}"]`).dataset;
    const htmlContent = `
    <option class="routesInfo-menu__stationBlock" value="${station.dataset.stationId}">
        <span>
          ${formatString(station.dataset.connectedTo)} 
          ${factoryData.idByType} - ${station.dataset.stationLetter}
        </span>
    </option>`;

    const factoryTile = document.querySelector(`[data-building-id="${station.dataset.connectedToId}"]`);

    if (select.querySelector(`[value="${station.dataset.stationId}"]`) || station.dataset.routeId) return;
    if (select.dataset.stationB == "" && factoryTile.dataset.buildingCategory == "Out") return;

    select.insertAdjacentHTML("beforeend", htmlContent);
    if (select.parentElement.children[0].value == station.dataset.stationId) {
      select.querySelector(`[value="${station.dataset.stationId}"]`).remove();
    }
    if (select.parentElement.lastElementChild.value == station.dataset.stationId) {
      select.querySelector(`[value="${station.dataset.stationId}"]`).remove();
    }
  });
}

function createRouteElem() {
  const activeRoute = document.querySelector(`[data-active-route]`);
  const visibleElem = routesInfoMenu.querySelector(".visible");
  visibleElem && visibleElem.classList.remove("visible");
  if (!activeRoute) {
    let randomColor;
    do {
      randomColor = getRandomColor();
    } while (allRoutesList.find((route) => route.color === randomColor));

    addRouteInfoToMenu(routeId++, randomColor);
  }
}

function selectItem(menu, mainFactoryTile, exportStation, importStation) {
  const factoryData = mainFactoryTile.dataset;
  const importFactoryName = importStation.dataset.connectedTo;
  const importFactoryData = document.querySelector(
    `[data-building-id="${importStation.dataset.connectedToId}"]`
  ).dataset;
  const itemSelect = menu.querySelector(".routesInfo-menu__itemSelect");
  const routeItemImg = menu.querySelector(".routesInfo-menu__itemImg");
  const routeItemName = menu.querySelector(".routesInfo-menu__itemName");

  itemSelect.classList.toggle("hidden");
  itemSelect.innerHTML = "";
  let items = allItems;

  if (importFactoryData.buildingType != "tradingTerminal" && importFactoryData.buildingCategory != "storage") {
    items = items.filter((item) => item.processingIn.includes(importFactoryName));
  }

  items = items.filter((item) => item.isAltRecipe != true);
  items.forEach((item) => {
    if (item.isMovable != false) {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("importItem");

      itemBlock.innerHTML = `
        <button class="importItem-button">
          <img src="${item.imageSrc}"/>
        </button>
        <span>${item.name}</span>`;
      itemSelect.appendChild(itemBlock);

      itemBlock.querySelector(".importItem-button").onclick = () => {
        routeItemImg.src = item.imageSrc;
        routeItemName.textContent = item.name;
        setTimeout(() => itemSelect.classList.add("hidden"), 50);

        exportStation.dataset.cargoStationItem = item.name;
        importStation.dataset.cargoStationItem = item.name;
        if (factoryData.buildingCategory == "storage") {
          factoryData.itemTypeOutput1 = item.name;
        }
      };
    }
  });
}
function checkRouteValid(exportTile, importTile, routeId, routeColor) {
  exportTile.dataset.routeTo = importTile.dataset.stationId;
  exportTile.dataset.cargoStationType = "Export";
  exportTile.dataset.routeId = routeId;
  importTile.dataset.routeFrom = exportTile.dataset.stationId;
  importTile.dataset.cargoStationType = "Import";
  importTile.dataset.routeId = routeId;

  const truckObj = new Truck(exportTile);
  const route = truckObj.calculateRoute([exportTile, []]);
  if (exportTile == importTile) {
    notyf.error("Can`t select the same station!");
    return false;
  } else if (route && route.length > 0) {
    const routeObj = {
      id: routeId,
      trucks: [],
      stationA: exportTile,
      stationB: importTile,
      drawRoutePointsList: route,
      color: routeColor,
    };
    allRoutesList.push(routeObj);
    notyf.success("Route created successfully!");
    return true;
  } else {
    exportTile.dataset.routeTo = exportTile.dataset.routeId = "";
    importTile.dataset.routeFrom = importTile.dataset.routeId = "";
    notyf.error("Stations are not connected by roads!");
    return false;
  }
}
function startRoute(route, resAmount = 8) {
  const routeTiles = route.drawRoutePointsList;
  const exportStation = route.stationA;
  const truckObj = new Truck(exportStation);
  const startMethods = startBuildingMethods.bind(truckObj, exportStation);
  startMethods();
  truckObj.createRouteDirections(routeTiles, resAmount / 8);
  updateTrucksInGarage("", "", "minus");
  updateTrucksAmountInfo();
}
function updateTrucksAmountInfo() {
  const totalTrucksAmount = document.querySelector(".totalTrucksAmount");
  totalTrucksAmount.textContent = `${trucksAvailable}/${trucksTotal}`;
}
function addTruckToRouteInfo({ truckId, routeId, resourcesLeft, truckBlock }) {
  const trucksList = routesMenuList.querySelector(`#route_${routeId} .routesInfo-menu__trucksList`);
  const truckElem = trucksList.querySelector(`#truck_${truckId}`);
  truckElem && truckElem.remove();
  const htmlContent = `
    <div class="routesInfo-menu__truck" id="truck_${truckId}">
      <div class="routesInfo-menu__truck-info ">
      <img class="truck-image__img" src="./img/transport/truckDown.png" >
         <span class="truck-info__id">Truck ID: ${truckId}</span>
         <span class="truck-info__resources-left">Resources Left: ${
           resourcesLeft < 1000 ? resourcesLeft : "Ꝏ"
         }</span>
         <div class="routesInfo-menu__truckButtons">
          <button class="routesInfo-menu__deleteButton"></button>
          <button class="routesInfo-menu__copyButton"></button>
         </div>
      </div>
    </div>`;
  trucksList.insertAdjacentHTML("beforeend", htmlContent);

  const truckMenuBlock = trucksList.querySelector(`#truck_${truckId}`);
  const deleteTruckBtn = truckMenuBlock.querySelector(`.routesInfo-menu__deleteButton`);
  const copyTruckBtn = truckMenuBlock.querySelector(`.routesInfo-menu__copyButton`);

  deleteTruckBtn.onclick = () => {
    truckBlock.dataset.toRemove = "true";
    truckMenuBlock.classList.add("redBg");
  };

  copyTruckBtn.onclick = () => {
    const itemAmountElem = truckMenuBlock.querySelector(".truck-info__resources-left");
    const itemAmount = +itemAmountElem.textContent.replace(/\D/g, "");
    startTruck(routeId, itemAmount, trucksList);
  };
}
function startTruck(id, resAmount, trucksList) {
  if (trucksAvailable > 0) {
    const route = allRoutesList.find((route) => route.id == id);
    const routeBlock = document.querySelector(`#route_${id}`);
    const isInfinite = routeBlock.querySelector(`#isInfinite`);
    isInfinite.checked && (resAmount = 9999);
    startRoute(route, resAmount);
    trucksList.scrollTop = trucksList.scrollHeight;
  } else {
    notyf.error("No trucks available!");
  }
}
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

interfaceСont.querySelector(".tool-menu__trucksBlock").onclick = () => {
  modalMenu.classList.add("hidden");
  if (routesInfoMenu.classList.contains("hidden")) {
    allOpenedMenu.forEach((e) => e.classList.add("hidden"));
    allOpenedMenu.push(routesInfoMenu);
    routesInfoMenu.classList.remove("hidden");
  } else {
    routesInfoMenu.classList.add("hidden");
  }
};

routesInfoMenu.querySelector(".close-button").onclick = () => {
  const trucksVis = routesMenuList.querySelector(`.routesInfo-menu__trucksList.visible`);
  trucksVis && trucksVis.classList.remove("visible");
  routesInfoMenu.classList.add("hidden");
};
