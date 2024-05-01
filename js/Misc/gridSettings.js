const gridContainer = document.querySelector(".grid-container");
const limitContainer = document.querySelector("#limit-container");
const gridSize = 50;
let CELLS;
// Создание сетки игры
const fragment = document.createDocumentFragment();
const mainMenu = document.querySelector(".mainMenu-container");
function startGame() {
  mainMenu.classList.add("hidden");
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");

      cell.classList.add("grid-cell");
      cell.id = i + "." + j;

      cell.dataset.type = "empty";
      cell.dataset.groundType = "grass";
      fragment.appendChild(cell);
    }
  }

  gridContainer.appendChild(fragment);
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let animationFrameId;
  const sensitivity = 0.5; // Коэффициент чувствительности
  const dragThreshold = 7; // Порог для начала перемещения

  let isDragging = false;
  let startX, startY, startOffsetX, startOffsetY;

  function handleWheel(event) {
    gridContainer.classList.add("smoothZoom");
    event.preventDefault();
    const delta = event.deltaY * -0.01;
    zoom(delta);
  }

  limitContainer.addEventListener("wheel", handleWheel, { passive: false });

  function zoom(delta) {
    const scaleFactor = 1.3; // Множитель масштаба

    if (delta > 0) {
      // Прокрутка вверх
      scale *= scaleFactor;
    } else {
      // Прокрутка вниз
      scale /= scaleFactor;
    }

    scale = Math.min(Math.max(0.3, scale), 5); // Ограничиваем масштаб от 0.5 до 4

    cancelAnimationFrame(animationFrameId);

    function animateZoom() {
      gridContainer.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px) rotateX(45deg) rotateZ(45deg)`;
      animationFrameId = requestAnimationFrame(animateZoom);
    }

    animateZoom();
  }

  function handleMouseDown(event) {
    // Проверка, что событие было вызвано левой кнопкой мыши или колесиком
    if (event.button === 0 || event.button === 1) {
      // Начало перемещения
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startOffsetX = offsetX;
      startOffsetY = offsetY;
    }
  }

  document.addEventListener("mousedown", handleMouseDown);

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging && !blockCameraMove) {
      gridContainer.classList.remove("smoothZoom");
      const deltaX = (event.clientX - startX) * sensitivity;
      const deltaY = (event.clientY - startY) * sensitivity;

      // Проверка на достаточное перемещение для начала перемещения
      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        offsetX = startOffsetX + deltaX;
        offsetY = startOffsetY + deltaY;
        gridContainer.style.transform = `scale(${scale}) 
        translate(${offsetX}px, ${offsetY}px) rotateX(45deg) rotateZ(45deg)`;
      }
    }
  });
  CELLS = document.querySelectorAll(".grid-cell");
  generateWorld();
}
