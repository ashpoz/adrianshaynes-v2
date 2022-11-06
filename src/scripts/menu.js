const nav = document.querySelector("nav");
const navButtons = nav.querySelectorAll("button");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
})