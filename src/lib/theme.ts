export type Theme = "light" | "dark";

export const THEME_KEY = "vertus-theme";

// Runs before paint: stored choice wins, otherwise follow the OS setting.
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
