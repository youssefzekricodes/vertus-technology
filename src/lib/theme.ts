export type Theme = "light" | "dark";

export const THEME_KEY = "vertus-theme";

/** Theme for first-time visitors (the toggle stores their own choice). */
export const DEFAULT_THEME: Theme = "light";

// Runs before paint: the visitor's stored choice wins, otherwise the default.
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t="${DEFAULT_THEME}";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
