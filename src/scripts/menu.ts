export {};

const nav = document.querySelector("nav") as HTMLElement;
const navButtons = nav.querySelectorAll(
  "button"
) as NodeListOf<HTMLButtonElement>;

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
});
