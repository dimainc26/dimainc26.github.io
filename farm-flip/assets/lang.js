// Sceglie la lingua da ?lang=, poi dalla lingua del browser; inglese se non è supportata.
// Nessun cookie né localStorage: il sito non salva nulla sul dispositivo di chi lo visita.
(function () {
  var supported = ["en", "it", "fr", "es", "pt"];
  var root = document.documentElement;
  root.classList.add("js");

  function pick() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (supported.indexOf(fromUrl) >= 0) return fromUrl;
    var fromBrowser = (navigator.language || "en").slice(0, 2).toLowerCase();
    return supported.indexOf(fromBrowser) >= 0 ? fromBrowser : "en";
  }

  function apply(lang) {
    root.lang = lang;
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang") === lang);
    });
    document.querySelectorAll(".langs button").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.value === lang));
    });
    // I link interni portano con sé la lingua scelta.
    document.querySelectorAll("a[data-internal]").forEach(function (link) {
      var url = new URL(link.getAttribute("href"), location.href);
      url.searchParams.set("lang", lang);
      link.href = url.toString();
    });
    var current = new URL(location.href);
    current.searchParams.set("lang", lang);
    history.replaceState(null, "", current.toString());
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".langs button");
    if (button) apply(button.value);
  });

  apply(pick());
})();
