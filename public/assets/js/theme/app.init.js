// src/assets/js/app.init.js
(function (w) {
  var defaults = {
    Layout: 'vertical',         // 'vertical' | 'horizontal'
    SidebarType: 'full',        // 'full' | 'mini-sidebar'
    BoxedLayout: false,         // true | false
    Direction: 'ltr',           // 'ltr' | 'rtl'
    Theme: 'light',             // 'light' | 'dark'
    ColorTheme: 'default',      // id de radio/tema de color en tu UI
    cardBorder: false           // true = border, false = shadow
  };

  w.userSettings = Object.assign({}, defaults, w.userSettings || {});
})(window);
