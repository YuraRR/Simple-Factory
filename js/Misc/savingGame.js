function saveGame() {
  let savedTiles = [];
  CELLS.forEach((cell) => {
    if (cell.dataset.type != "empty" || cell.dataset.undergroundType || cell.dataset.featuresType) {
      savedTiles.push(cell);
    }
  });
  function saveElementWithChildren(element) {
    const children = Array.from(element.children);
    const computedStyles = window.getComputedStyle(element);

    const jsonObject = {
      id: element.id,
      dataset: { ...element.dataset },
      styles: {},
      classes: [...element.classList],
      children: [],
      src: element.tagName === "IMG" ? element.src : null,
    };

    // Записываем инлайновые стили
    for (let i = 0; i < computedStyles.length; i++) {
      const propertyName = computedStyles[i];
      const propertyValue = computedStyles.getPropertyValue(propertyName);
      const defaultValue = window.getComputedStyle(document.body).getPropertyValue(propertyName);

      // Сохраняем только нестандартные значения
      if (propertyValue !== defaultValue) {
        jsonObject.styles[propertyName] = propertyValue;
      }
    }

    if (children.length > 0) {
      children.forEach((childElement) => {
        const childObject = saveElementWithChildren(childElement);
        jsonObject.children.push(childObject);
      });
    }

    return jsonObject;
  }

  const savedTilesWithChildren = Array.from(savedTiles).map((element) => {
    return saveElementWithChildren(element);
  });
  function saveVariables() {
    const variablesObj = {
      mineshaftMenuId: mineshaftMenuId,
      smelterMenuId: smelterMenuId,
      storageMenuId: storageMenuId,
      oreProcessingMenuId: oreProcessingMenuId,
      assemblerMenuId: assemblerMenuId,
      buildingId: buildingId,
      buildingDirection: buildingDirection,
    };
    return variablesObj;
  }
  const jsonVariables = JSON.stringify(saveVariables());
  localStorage.setItem("allVariables", jsonVariables);
  const jsonInfo = JSON.stringify(savedTilesWithChildren);
  localStorage.setItem("allInfo", jsonInfo);
}
function loadGame() {
  // Получение данных из Local Storage (если необходимо)
  const retrievedInfo = localStorage.getItem("allInfo");
  const loadTiles = JSON.parse(retrievedInfo);
  loadTiles.forEach((tile) => {
    const foundTile = document.getElementById(`${tile.id}`);
    loadVariables();
    loadDatasets(tile, foundTile);
    loadImages(tile, foundTile);
    loadClasses(tile, foundTile);
    loadDivs(tile, foundTile);
    startIntervals(tile, foundTile);
  });
}
function loadVariables() {
  const retrievedVariables = localStorage.getItem("allVariables");
  const obj = JSON.parse(retrievedVariables);
  mineshaftMenuId = obj.mineshaftMenuId;
  smelterMenuId = obj.smelterMenuId;
  storageMenuId = obj.storageMenuId;
  oreProcessingMenuId = obj.oreProcessingMenuId;
  assemblerMenuId = obj.assemblerMenuId;
  buildingId = obj.buildingId;
}
function loadDatasets(tile, foundTile) {
  let dataset = tile.dataset;
  for (let key in dataset) {
    if (dataset.hasOwnProperty(key)) {
      const value = dataset[key];
      key = toLowerCase(key);
      foundTile.setAttribute(`data-${key}`, value);
    }
  }
}
function loadImages(tile, foundTile) {
  const img = document.createElement("img");
  let imgObj = tile.children[0];
  if (imgObj && imgObj.src) {
    let imgSrc = imgObj.src;
    let imgDataset = imgObj.dataset;
    for (let key in imgDataset) {
      if (imgDataset.hasOwnProperty(key)) {
        const value = imgDataset[key];
        key = toLowerCase(key);
        img.setAttribute(`data-${key}`, value);
      }
    }
    loadClasses(imgObj, img);
    const index = imgSrc.indexOf("/img");

    if (index !== -1) {
      img.src = imgSrc.slice(index);
      foundTile.appendChild(img);
    }
  }
}
function loadClasses(tile, foundTile) {
  const classes = tile.classes;
  for (let key in classes) {
    if (classes.hasOwnProperty(key)) {
      const value = classes[key];
      foundTile.classList.add(value);
    }
  }
}
function loadStyles(tile, foundTile) {
  const height = tile.styles.height;
  const width = tile.styles.width;
  foundTile.style.height = height;
  foundTile.style.width = width;
}
function loadDivs(tile, foundTile) {
  let divObj = tile.children[1];
  const div = document.createElement("div");
  if (divObj) {
    loadClasses(divObj, div);
    loadStyles(divObj, div);
    foundTile.appendChild(div);
  }
}
function startIntervals(tile, foundTile) {
  let className = tile.dataset.buildingType;
  let clickArea = foundTile.querySelector(".clickArea");
  if (className && tile.classes.some((item) => item !== "grid-cell" && item !== "upgrade")) {
    const buildingClasses = {
      mineshaft: Mineshaft,
      waterPump: WaterPump,
      assembler: Assembler,
      smelter: Smelter,
      oreProcessing: OreProcessingPlant,
      storage: Storage,
      conveyor: Conveyor,
      connector: Connector,
      splitter: Splitter,
      pipe: Pipe,
      fluidSplitter: FluidSplitter,
    };

    let newBuilding = new buildingClasses[className](tile);
    newBuilding.getId(foundTile.id);

    switch (className) {
      case "oreProcessing":
      case "smelter":
      case "assembler":
        newBuilding.processing(clickArea);
        break;
      case "mineshaft":
        newBuilding.extraction(clickArea);
        break;
      case "conveyor":
        newBuilding.restoreMovement(foundTile);
        break;
      case "connector":
        newBuilding.restoreMovement(foundTile);
        newBuilding.exportItem();
        break;
      case "splitter":
        newBuilding.splitItems("item");
        break;
      case "pipe":
        newBuilding.addPipeDirection();
        break;
      case "fluidSplitter":
        newBuilding.splitItems("fluid");
        break;
    }
  }
}
function toLowerCase(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
