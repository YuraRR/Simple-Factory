//GRID VALUES
const gridSize = 40;
const TOOLBUTTONS = document.querySelectorAll(".tool-menu__btn");
//MENU ID
let mineshaftMenuId = 1;
let smelterMenuId = 1;
let storageMenuId = 1;
let oreProcessingMenuId = 1;
let assemblerMenuId = 1;
let cargoStationMenuId = 1;
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
let menuOpened = false;
let undergroundOpened = false;
let foundryType;
let conveyorIntervalId;
//SIZE OF GHOST
let xSize = 1;
let zSize = 1;
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

const waterPumpDirections = [
  "mineshaft-hover",
  "mineshaft-hover",
  "mineshaft-hover",
  "mineshaft-hover",
];
const mineshaftDirections = [
  "mineshaft-hover",
  "mineshaft-hover",
  "mineshaft-hover",
  "mineshaft-hover",
];

const demolitionHover = [
  "demolition-hover",
  "demolition-hover",
  "demolition-hover",
  "demolition-hover",
];
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
const allItems = [
  {
    name: "Raw Iron Ore",
    processingIn: "oreProcessing",
    src: "img/resourcesIcons/ironOre-icon.svg",
    price: 10,
  },
  {
    name: "Raw Copper Ore",
    processingIn: "oreProcessing",
    src: "img/resourcesIcons/noItem.svg",
    price: 10,
  },
  {
    name: "Refined Iron Ore",
    processingIn: "smelter",
    src: "img/resourcesIcons/RefinedIronOre.svg",
    price: 20,
  },
  {
    name: "Refined Copper Ore",
    processingIn: "smelter",
    src: "img/resourcesIcons/copperOre-icon.svg",
    price: 20,
  },
  {
    name: "Iron Ingot",
    processingIn: "assembler",
    src: "img/resourcesIcons/ironIngot.svg",
    price: 40,
  },
  {
    name: "Iron Plate",
    processingIn: "assembler",
    src: "img/resourcesIcons/ironIngot.svg",
    price: 40,
  },
  {
    name: "Iron Rod",
    processingIn: "assembler",
    src: "img/resourcesIcons/ironIngot.svg",
    price: 40,
  },
  {
    name: "Copper Ingot",
    processingIn: "assembler",
    src: "img/resourcesIcons/copperIngot.svg",
    price: 40,
  },
];
//BUIDINGS LIST
const allBuilding = ["mineshaft", "oreProcessing", "smelter", "assembler", "conveyor"];
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
    productName: "Refined copper ore",
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
