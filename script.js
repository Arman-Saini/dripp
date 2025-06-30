const cursor = document.querySelector(".cursor");

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;
const speed = 0.1; // Smaller = slower, smoother

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Smoothly interpolate toward target mouse position
  currentX += (mouseX - currentX) * speed;
  currentY += (mouseY - currentY) * speed;

  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  requestAnimationFrame(animateCursor);
}

animateCursor(); // Start the animation loop


const container = document.querySelector(".shoePages");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

let currentIndex = 0; // Start on the first page
const totalPages = 4; // Total number of pages

// Function to update the transform property
function updateTransform() {
  container.style.transform = `translateX(-${currentIndex * 100}vw)`;
}

// Event listeners for buttons
leftBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--; // Move left
    updateTransform();
  }
});

rightBtn.addEventListener("click", () => {
  if (currentIndex < totalPages - 1) {
    currentIndex++; // Move right
    updateTransform();
  }
});



//************need to verify************
//Notes:
//Translation is not relative to the initial position, it is relative to the (absolute) (not the position:absolute but an adjective) initial position
//let's say I want to move left 100%, I apply the tranlation thing and it moves left 100%
//If I were to apply translation 100% once again, It won't move 100 % left more, i.e. it will still be 100% left of original position and not 200% left
//read last few chats of this https://chatgpt.com/c/67769f57-f070-8010-ae32-858a3982a74a