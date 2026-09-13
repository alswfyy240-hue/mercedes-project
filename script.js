const models = {
  "c-class": {category:"C-CLASS · 2025", name:"Mercedes-Benz C 200", power:"204", acceleration:"7.3", engine:"1.5", price:"239,900", color:"Obsidian Black", image:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"},
  "e-class": {category:"E-CLASS · 2025", name:"Mercedes-Benz E 300", power:"258", acceleration:"6.3", engine:"2.0", price:"318,500", color:"Selenite Grey", image:"https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85"},
  gle: {category:"GLE SUV · 2025", name:"Mercedes-Benz GLE 450", power:"381", acceleration:"5.7", engine:"3.0", price:"439,900", color:"Polar White", image:"https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85"},
  "s-class": {category:"S-CLASS · 2025", name:"Mercedes-Benz S 500", power:"449", acceleration:"4.8", engine:"3.0", price:"579,900", color:"Diamond White", image:"https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85"},
  "g-class": {category:"G-CLASS · 2025", name:"Mercedes-AMG G 63", power:"585", acceleration:"4.5", engine:"4.0", price:"899,900", color:"Manufaktur Olive", image:"https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85"},
  eqs: {category:"EQS · 2025", name:"Mercedes-Benz EQS 450+", power:"333", acceleration:"6.2", engine:"كهربائي", price:"499,900", color:"Obsidian Black", image:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=85"}
};

const $ = (selector) => document.querySelector(selector);
const tabs = document.querySelectorAll(".model-tab");
const stage = $("#carStage");

// Always start at the hero section when the page is opened without an anchor.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
  window.addEventListener("load", () => window.scrollTo(0, 0), {once: true});
}

function updateModel(key) {
  const model = models[key];
  const modelKeys = Object.keys(models);
  $("#modelCategory").textContent = model.category;
  $("#modelName").textContent = model.name;
  $("#modelPower").innerHTML = `${model.power} <b>حصان</b>`;
  $("#modelAcceleration").innerHTML = `${model.acceleration} <b>ثانية</b>`;
  $("#modelEngine").innerHTML = `${model.engine} <b>لتر</b>`;
  $("#modelPrice").innerHTML = `${model.price} <b>ر.س</b>`;
  $("#modelColor").textContent = model.color;
  $("#heroCarImage").src = model.image;
  $("#heroCarImage").alt = model.name;
  $("#modelIndex").textContent = String(modelKeys.indexOf(key) + 1).padStart(2, "0");
  tabs.forEach((tab) => {
    const active = tab.dataset.model === key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active);
  });
}

tabs.forEach((tab) => tab.addEventListener("click", () => updateModel(tab.dataset.model)));

if (stage) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let rotationY = 0;
  let rotationX = 0;
  const angleLabel = $("#viewerAngle");

  const applyRotation = () => {
    const angle = ((Math.round(rotationY) % 360) + 360) % 360;
    stage.style.setProperty("--spin-angle", `${angle}deg`);
    stage.style.setProperty("--view-rotation", `${rotationY}deg`);
    stage.style.transform = `rotateX(${rotationX}deg)`;
    if (angleLabel) angleLabel.textContent = `${angle}°`;
  };

  stage.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    stage.style.transition = "none";
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });

  stage.addEventListener("pointermove", (event) => {
    if (isDragging) {
      // A full horizontal drag maps to a complete 360-degree product turn.
      rotationY += (event.clientX - startX) * 0.7;
      rotationX -= (event.clientY - startY) * 0.2;
      rotationX = Math.max(-12, Math.min(12, rotationX));
      startX = event.clientX;
      startY = event.clientY;
      applyRotation();
      return;
    }
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--hover-x", `${x * 8}deg`);
    stage.style.setProperty("--hover-y", `${y * -5}deg`);
    stage.style.transform = `rotateX(${y * -5 + rotationX}deg)`;
  });
  stage.addEventListener("pointerup", (event) => {
    isDragging = false;
    stage.style.transition = "";
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    stage.classList.remove("is-dragging");
  });
  stage.addEventListener("pointercancel", () => {
    isDragging = false;
    stage.style.transition = "";
    stage.classList.remove("is-dragging");
  });
  stage.addEventListener("mouseleave", () => { if (!isDragging) applyRotation(); });
}

const modal = $("#driveModal");
const openModal = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
const closeModal = () => { modal.classList.remove("open"); modal.classList.remove("submitted"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
document.querySelectorAll("[data-open-modal]").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
$("#bookingForm").addEventListener("submit", (event) => { event.preventDefault(); modal.classList.add("submitted"); });
document.querySelector("[data-scroll-experience]").addEventListener("click", () => $("#experience").scrollIntoView({behavior:"smooth"}));

document.querySelector(".menu-toggle").addEventListener("click", () => {
  const nav = $(".main-nav");
  const isOpen = nav.classList.toggle("mobile-open");
  nav.style.display = isOpen ? "flex" : "";
});
