/* ----------- PRELOADER ----------- */

const preloader = document.querySelector("#preloader");

function removePreloader() {
    setTimeout(() => {
        preloader.addEventListener("transitionend", () => preloader.remove());
        preloader.classList.add("hide");
    }, 1000);
    window.removeEventListener("load", removePreloader);
}

window.addEventListener("load", removePreloader);