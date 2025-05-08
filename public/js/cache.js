const scripts = document.querySelectorAll("script[src]");
const styles = document.querySelectorAll("link[rel='stylesheet']");

scripts.forEach(script => {
    script.src += "?t="+Date.now();
});