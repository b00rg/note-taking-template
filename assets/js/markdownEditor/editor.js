export function initializeEditor() {
    // Load SimpleMDE CSS if not already loaded
    if (!document.querySelector("#simplemde-css")) {
        const cssLink = document.createElement("link");
        cssLink.id = "simplemde-css";
        cssLink.rel = "stylesheet";
        cssLink.href = "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css";
        document.head.appendChild(cssLink);
    }

    // Load SimpleMDE JS dynamically
    if (window.SimpleMDE) {
        setTimeout(() => new SimpleMDE({ element: document.getElementById("editor") }), 100);
    } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";
        script.onload = () => new SimpleMDE({ element: document.getElementById("editor") });
        document.body.appendChild(script);
    }
}
