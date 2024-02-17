//GRID VALUES
const TOOLBUTTONS = document.querySelectorAll(".tool-menu__btn");
//MENU ID
let mineshaftMenuId = 1;
let smelterMenuId = 1;
let cementFactoryId = 1;
let storageMenuId = 1;
let oreProcessingMenuId = 1;
let assemblerMenuId = 1;
let cargoStationMenuId = 1;
let truckIdCounter = 1;
//BUILDING ID
let buildingId = 1;
//GLOBAL AMOUNT
let ironOreAmount = 0;
let copperOreAmount = 0;
let woodAmount = 0;
//BUILDING DIRECTIONS
let DIRECTIONS;
let buildingDirection = 0;
let currentTool;
//MISC
let allOpenedMenu = [];
let blockCameraMove = false;
let undergroundOpened = false;
let foundryType;
let conveyorIntervalId;
//MONEY
let money = 500;
//TRUCKS
let trucksTotal = 0;
let trucksAvailable = 0;
let routeId = 1;
let allRoutesList = [];

//CONVEYOR DIRECTIONS
const connectorDirections = [
  "connectorUp-hover",
  "connectorRight-hover",
  "connectorDown-hover",
  "connectorLeft-hover",
];
const conveyorDirections = [
  "conveyorUp-hover",
  "conveyorRight-hover",
  "conveyorDown-hover",
  "conveyorLeft-hover",
];
const splitterDirections = [
  "splitterUp-hover",
  "splitterRight-hover",
  "splitterDown-hover",
  "splitterLeft-hover",
];
const fluidSplitterDirections = [
  "fluidSplitterUp-hover",
  "fluidSplitterRight-hover",
  "fluidSplitterDown-hover",
  "fluidSplitterLeft-hover",
];
// prettier-ignore
const pipeDirections = [
  "pipeUp-hover",
  "pipeRight-hover",
  "pipeDown-hover",
  "pipeLeft-hover",
];

const waterPumpDirections = ["mineshaft-hover", "mineshaft-hover", "mineshaft-hover", "mineshaft-hover"];
const mineshaftDirections = ["mineshaft-hover", "mineshaft-hover", "mineshaft-hover", "mineshaft-hover"];

const demolitionHover = ["demolition-hover", "demolition-hover", "demolition-hover", "demolition-hover"];
const directionsList = {
  conveyor: conveyorDirections,
  connector: connectorDirections,
  splitter: splitterDirections,
  pipe: pipeDirections,
  mineshaft: mineshaftDirections,
  waterPump: waterPumpDirections,
  demolition: demolitionHover,
  fluidSplitter: fluidSplitterDirections,
};
const allDirections = conveyorDirections.concat(
  connectorDirections,
  splitterDirections,
  pipeDirections,
  waterPumpDirections,
  demolitionHover,
  fluidSplitterDirections
);
//ITEMS LIST

//BUIDINGS LIST
const allBuilding = [
  //SOURCE
  {
    name: "mineshaft",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "quarry",
    xSize: 2,
    zSize: 2,
  },
  {
    name: "waterPump",
    xSize: 1,
    zSize: 1,
  },
  //PROCESSING
  {
    name: "oreProcessing",
    xSize: 2,
    zSize: 2,
  },
  {
    name: "smelter",
    xSize: 3,
    zSize: 3,
  },
  {
    name: "assembler",
    xSize: 6,
    zSize: 4,
  },
  {
    name: "cementPlant",
    xSize: 2,
    zSize: 2,
  },

  //STORAGE
  {
    name: "storage",
    xSize: 2,
    zSize: 2,
  },
  //TRANSPORTATION
  {
    name: "conveyor",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "connector",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "splitter",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "pipe",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "fluidSplitter",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "road",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "cargoStation",
    xSize: 1,
    zSize: 1,
  },
  {
    name: "tradingTerminal",
    xSize: 3,
    zSize: 3,
  },
  //MISC
  {
    name: "demolition",
    xSize: 1,
    zSize: 1,
  },
];
//RECEPIES LIST
const allProcessingOreRecipes = [
  {
    productName: "Refined Iron Ore",
    materialName: "Raw Iron Ore",
    materialImage: "img/resourcesIcons/ironOre-icon.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/refinedIronOre.svg",
    productAmount: 1,
  },
  {
    productName: "Refined Copper Ore",
    materialName: "Raw Copper Ore",
    materialImage: "img/resourcesIcons/copperOre-icon.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 1,
  },
];
const allSmeltingRecipes = [
  {
    productName: "Iron Plate",
    productSubtype: "Plates",
    materialName: "Refined Iron Ore",
    materialImage: "img/resourcesIcons/refinedIronOre.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/ironIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Iron Ingot",
    productSubtype: "Ingots",
    materialName: "Refined Iron Ore",
    materialImage: "img/resourcesIcons/refinedIronOre.svg",
    materialAmount: 3,
    productImage: "img/resourcesIcons/ironIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Iron Rod",
    productSubtype: "Rods",
    materialName: "Refined Iron Ore",
    materialImage: "img/resourcesIcons/refinedIronOre.svg",
    materialAmount: 4,
    productImage: "img/resourcesIcons/ironIngot.svg",
    productAmount: 2,
  },
  {
    productName: "Copper Plate",
    productSubtype: "Plates",
    materialName: "Refined Iron Ore",
    materialImage: "img/resourcesIcons/refinedCopperOre.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Copper Ingot",
    productSubtype: "Ingots",
    materialName: "Refined Copper Ore",
    materialImage: "img/resourcesIcons/refinedCopperOre.svg",
    materialAmount: 3,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Copper Pipe",
    productSubtype: "Rods",
    materialName: "Refined Copper Ore",
    materialImage: "img/resourcesIcons/refinedCopperOre.svg",
    materialAmount: 4,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 2,
  },
];
const allAssemblyRecipes = [
  {
    firstMatName: "Raw Iron Ore",
    firstMatAmount: 4,
    firstMatImage: "",
    secondMatName: "Raw Copper Ore",
    secondMatAmount: 4,
    productName: "Iron frame",
    productImage: "",
    productAmount: 2,
  },
];

const allRecepies = [
  {
    firstMatName: "Limestone",
    firstMatAmount: 4,
    firstMatImage: "",
    secondMatName: "Clay",
    secondMatAmount: 4,
    productName: "Cement",
    productImage: "",
    productAmount: 2,
  },
];
//UPGRADES LIST
const oreProcessingUpgrades = [
  {
    name: "Crusher Machine",
    img: "",
  },
  {
    name: "Washing Machine",
    img: "",
  },
];
const smelterUpgrades = [
  {
    name: "Blast Furnace",
    img: "",
  },
  {
    name: "Foundry (plates)",
    img: "",
  },
  {
    name: "Foundry (ingots)",
    img: "",
  },
  {
    name: "Foundry (rods)",
    img: "",
  },
  {
    name: "Slag Recycler",
    img: "",
  },
];

//COLORS
const colors = [
  "#ff0000", // Красный
  "#00ff00", // Зеленый
  "#0000ff", // Синий
  "#ffff00", // Желтый
  "#ff00ff", // Розовый
  "#00ffff", // Бирюзовый
  "#800080", // Фиолетовый
  "#ffA500", // Оранжевый
  "#008000", // Темно-зеленый
  "#000080", // Темно-синий
  "#8B0000", // Темно-красный
  "#228B22", // Темно-зеленый лес
  "#8B008B", // Темно-фиолетовый
  "#4169E1", // Стальной синий
  "#FA8072", // Лососевый
  "#40E0D0", // Бирюзовый
  "#FFD700", // Золотой
  "#B8860B", // Темно-золотой
  "#008B8B", // Темно-бирюзовый
  "#A52A2A", // Коричневый
  "#2E8B57", // Морская зелень
  "#FF6347", // Томатный
  "#556B2F", // Темно-оливковый
  "#CD853F", // Перуанский коричневый
  "#483D8B", // Темно-сиреневый
  "#8B4513", // Коричнево-красный
  "#9932CC", // Темно-фиолетовый
  "#8B4513", // Коричнево-красный
  "#FFFAFA", // Ледяной
  "#008080", // Темно-циан
];
