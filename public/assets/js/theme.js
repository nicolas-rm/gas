// src/assets/js/theme.js
(function (w, d) {
  function chainHandler(obj, prop, handler) {
    var prev = obj[prop];
    if (typeof prev === 'function') {
      obj[prop] = function (e) { try { prev.call(this, e); } catch(_) {} handler.call(this, e); };
    } else {
      obj[prop] = handler;
    }
  }

  function Theme() {
    var onScroll = function () {
      var topHeader = d.querySelector(".top-header");
      if (!topHeader) return;

      var scrolled = (d.body.scrollTop || d.documentElement.scrollTop) > 60;
      if (scrolled) {
        topHeader.classList.add("shadow-sm");
      } else {
        topHeader.classList.remove("shadow-sm");
      }
    };

    chainHandler(w, 'onscroll', onScroll);
    // Estado inicial sin esperar scroll
    try { onScroll(); } catch (_) {}
  }

  // Exporta global
  w.Theme = Theme;
})(window, document);
