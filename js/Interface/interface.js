//////TOOLBAR//////

//Format name
function formatString(inputString) {
  return inputString
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}
function addBuildingsToMenu() {
  const buildingsNames = Object.values(buildingCreating);
  buildingsNames.forEach((bld) => {
    const buildingType = allBuilding.find((item) => item.name === bld.name).type;
    const toolContainer = document.querySelector(`[data-group-type="${buildingType}"]`);
    const buttonBlock = document.createElement("div");
    buttonBlock.classList.add("tool-menu__block");
    const buttonHtml = `
    <button class="tool-menu__btn" id="${bld.name}">
      <img src="/img/buildings/${bld.name}.webp" draggable="false" />
    </button>
    <span>${formatString(bld.name)}</span>
  `;
    buttonBlock.innerHTML = buttonHtml;
    toolContainer.appendChild(buttonBlock);
  });
}

function activeToolCategory() {
  const categoryButtons = document.querySelectorAll(".tool-menu__category");
  const toolGroups = document.querySelectorAll(".tool-menu__group");
  const toolButtons = document.querySelectorAll(".tool-menu__btn");
  const menuModal = document.querySelector(".tool-menu__modal");
  const closeBtn = menuModal.querySelector(".close-button");

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      menuModal.classList.remove("hidden");
      const currentMenu = document.querySelector(`[data-group-type="${btn.id}"]`);
      toolGroups.forEach((btn) => btn.classList.add("hidden"));
      currentMenu.classList.remove("hidden");
    });
  });

  toolButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTool = btn.id;
      removeButtonActive(toolButtons, btn);
      createEventListener(currentTool);
    });
  });
  closeBtn.addEventListener("click", () => {
    menuModal.classList.add("hidden");
  });
}

function createEventListener(currentTool) {
  resetTool();
  gridContainer.removeEventListener("click", demolitionFunc);
  gridContainer.addEventListener("click", buildingCreating[currentTool]);
  ghostRotating();
}

function removeButtonActive(buttons, btn) {
  buttons.forEach((btn) => btn.classList.remove("buttonActive"));
  btn.classList.add("buttonActive");
}
function resetTool() {
  const creatingMethods = Object.values(buildingCreating);
  creatingMethods.forEach((method) => {
    gridContainer.removeEventListener("click", method);
  });
  const equipmentMethods = Object.values(equipmentCreating);
  equipmentMethods.forEach((method) => {
    gridContainer.removeEventListener("click", method);
  });
}
addBuildingsToMenu();
activeToolCategory();

// PROGRESS BAR
function moveProgressBar(menu, time, callback) {
  let progressBar = menu.querySelector(".progressBar");
  let width = 0;
  let animationId;

  function frame(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;

    const elapsed = timestamp - startTimestamp;

    if (elapsed < time) {
      width = (elapsed / time) * 100;
      progressBar.style.width = width + "%";
      animationId = requestAnimationFrame(frame);
    } else {
      progressBar.style.width = "0%";
      callback(); // Вызываем обратную функцию после завершения анимации
    }
  }

  let startTimestamp;
  animationId = requestAnimationFrame(frame);

  // Возвращаем объект с функцией для остановки анимации
  return {
    stop: function () {
      cancelAnimationFrame(animationId);
      progressBar.style.width = "0%";
    },
    width: width,
  };
}

// CONTEXT MENU
document.addEventListener("DOMContentLoaded", () => {
  const contextMenu = document.getElementById("customContextMenu");
  const demolitionButton = document.getElementById("demolitionButton");
  const undergroundButton = document.getElementById("undergroundButton");

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    showContextMenu(event.clientX, event.clientY);
  });

  document.addEventListener("click", () => {
    hideContextMenu();
  });

  // Добавляем слушатели событий только один раз
  demolitionButton.addEventListener("click", () => {
    currentTool = "demolition";

    gridContainer.addEventListener("click", demolitionFunc);
    // TOOLBUTTONS.forEach((btn) => btn.classList.remove("buttonActive"));
    ghostRotating();
  });

  undergroundButton.addEventListener("click", () => {
    showUnderground();
  });

  function showContextMenu(x, y) {
    contextMenu.style.display = "flex";
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
  }

  function hideContextMenu() {
    contextMenu.style.display = "none";
  }
});

//CAMERA MOVE TO BUILDING
// function cameraMoveCenter(event) {
//   // Получаем координаты клика

//   let newOffsetX = window.innerWidth / 2 - event.clientX + offsetX;
//   let newOffsetY = window.innerHeight / 2 - event.clientY + offsetY;
//   offsetX = newOffsetX;
//   offsetY = newOffsetY;

//   // scale = 1;

//   // console.log(newOffsetX, newOffsetY, scale);
//   // Применяем трансформацию для перемещения центра экрана
//   gridContainer.style.transform = `scale(${scale}) translate(${newOffsetX}px, ${newOffsetY}px) rotateX(45deg) rotateZ(45deg)`;
//   document.removeEventListener("click", cameraMoveCenter);
// }

function dragElement(id) {
  const position = { x: 0, y: 0 };
  const container = document.querySelector("#limit-container");
  interact(`#${id}`).draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: container,
      }),
    ],

    listeners: {
      start(event) {
        blockCameraMove = true;
      },
      move(event) {
        position.x += event.dx;
        position.y += event.dy;

        event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
      },
      end(event) {
        blockCameraMove = false;
      },
    },
  });
}
