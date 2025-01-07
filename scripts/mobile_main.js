import { canvas } from "./main.js";
import { fabric } from "fabric";
import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoView } from "./mobile-logo-view.js";
import { mobileAddView } from "./mobile-add-view.js";
import { mobileTextView } from "./mobile-text-view.js";
import { mobileBackgroundMenu } from "./mobile-background-menu.js";
import { mobileLogoMenu } from "./mobile-logo-menu.js";
import { mobileTextMenu } from "./mobile-text-menu.js";

const navItems = document.querySelectorAll("#mobile-nav-bar [data-name]");
const categoryContent = document.querySelector("#mobile-category-content");

let category = "add";

const mainCategoryData = {
  add: mobileAddView,
  logo: mobileLogoView,
  text: mobileTextView,
  background: mobileBackgroundView,
};

const menuCategoryData = {
  logo: mobileLogoMenu,
  text: mobileTextMenu,
  background: mobileBackgroundMenu,
};

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    category = item.getAttribute("data-name");
    history.pushState({ category }, null, `#${category}`);
    routeHandler();
  });
});

function routeHandler() {
  const category = history?.state?.category;
  console.log(category);

  if (category) {
    categoryContent.innerHTML = `
    <div id="content-container" style="z-index: 10; background-color: #ffffff; height: auto; position: absolute; bottom: 0; width: 100vw; padding: 5px 15px 0 0;">
      ${mainCategoryData[category]}
    </div>`;
    categoryContent.style.display = "block";
  } else {
    categoryContent.style.display = "none";
  }
  if (menuCategoryData[category]) {
    menuCategoryData[category](canvas);
  }
}

routeHandler();

window.addEventListener("popstate", routeHandler);
