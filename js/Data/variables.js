//MENU ID
let truckIdCounter = 1;
let conveyorItemId = 1;

const buildingsMenuId = {};
//BUILDING ID
let buildingId = 1;
//GLOBAL AMOUNT
let totalEnergy = 0;
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
let cheatMode = true;
let isPaused = false;
//MONEY
let money = 500;
//TRUCKS
let trucksTotal = 0;
let trucksAvailable = 0;
let routeId = 1;
let allRoutesList = [];

//GLOBAL RESOURCES

//ITEMS LIST

//RECEPIES LIST
const allProcessingOreRecipes = [
  {
    productName: "Refined Iron",
    materialName: "Raw Iron Ore",
    materialImage: "img/resourcesIcons/ironOre-icon.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/refinedIronOre.svg",
    productAmount: 1,
  },
  {
    productName: "Refined Copper",
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
    materialName: "Refined Iron ",
    materialImage: "img/resourcesIcons/refinedIronOre.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/ironIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Iron Ingot",
    productSubtype: "Ingots",
    materialName: "Refined Iron",
    materialImage: "img/resourcesIcons/refinedIronOre.svg",
    materialAmount: 3,
    productImage: "img/resourcesIcons/ironIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Iron Rod",
    productSubtype: "Rods",
    materialName: "Refined Iron",
    materialImage: "img/resourcesIcons/refinedIronOre.svg",
    materialAmount: 4,
    productImage: "img/resourcesIcons/ironIngot.svg",
    productAmount: 2,
  },
  {
    productName: "Copper Plate",
    productSubtype: "Plates",
    materialName: "Refined Iron",
    materialImage: "img/resourcesIcons/refinedCopperOre.svg",
    materialAmount: 2,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Copper Ingot",
    productSubtype: "Ingots",
    materialName: "Refined Copper",
    materialImage: "img/resourcesIcons/refinedCopperOre.svg",
    materialAmount: 3,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 1,
  },
  {
    productName: "Copper Pipe",
    productSubtype: "Rods",
    materialName: "Refined Copper",
    materialImage: "img/resourcesIcons/refinedCopperOre.svg",
    materialAmount: 4,
    productImage: "img/resourcesIcons/copperIngot.svg",
    productAmount: 2,
  },
];
const allAssemblyRecipes = [
  {
    firstMatName: "Iron Ore",
    firstMatAmount: 4,
    firstMatImage: "",
    secondMatName: "Copper Ore",
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
    processTime: 4000,
  },
];
//EQUIPMENT LIST
const oreProcessingEquipment = [
  {
    name: "Crusher Machine",
    img: "",
  },
  {
    name: "Washing Machine",
    img: "",
  },
];
const smelterEquipment = [
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
const structuresList = [
  {
    factoryName: "mineshaft",
    structures: ["TNT"],
  },
  {
    factoryName: "quarry",
    structures: ["Crusher"],
    Stone: "Gravel",
    Limestone: "Crushed Limestone",
  },
  {
    factoryName: "cementPlant",
    structures: ["WaterTower"],
  },
  {
    factoryName: "brickFactory",
    structures: ["WaterTower"],
  },
  {
    factoryName: "glassFactory",
    structures: ["WaterTower"],
  },
];
//COLORS
const colors = [
  "#ff6666", // Светло-красный
  "#66ff66", // Светло-зеленый
  "#6666ff", // Светло-синий
  "#ffff99", // Светло-желтый
  "#ff99ff", // Светло-розовый
  "#99ffff", // Светло-бирюзовый
  "#996699", // Светло-фиолетовый
  "#ffcc66", // Светло-оранжевый
  "#66cc66", // Светло-темно-зеленый
  "#6666cc", // Светло-темно-синий
  "#cc6666", // Светло-темно-красный
  "#66cc66", // Светло-темно-зеленый лес
  "#cc66cc", // Светло-темно-фиолетовый
  "#6699e1", // Светло-стальной синий
  "#f09999", // Светло-лососевый
  "#66e0cc", // Светло-бирюзовый
  "#ffdcb3", // Светло-золотой
  "#ccae66", // Светло-темно-золотой
  "#66cccc", // Светло-темно-бирюзовый
  "#b38258", // Светло-коричневый
  "#8ebf8e", // Светло-морская зелень
  "#ffae99", // Светло-томатный
  "#8f9c6b", // Светло-темно-оливковый
  "#ccae7a", // Светло-перуанский коричневый
  "#9480cd", // Светло-темно-сиреневый
  "#c4876b", // Светло-коричнево-красный
  "#ae99cc", // Светло-темно-фиолетовый
  "#c4876b", // Светло-коричнево-красный
  "#f5f5f5", // Светло-ледяной
  "#66cccc", // Светло-темно-циан
];
