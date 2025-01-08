import { canvas } from "./main.js";
import { fabric } from "fabric";
import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoView } from "./mobile-logo-view.js";
import { mobileAddView } from "./mobile-add-view.js";
import { mobileTextView } from "./mobile-text-view.js";
import { mobileBackgroundMenu } from "./mobile-background-menu.js";
import { mobileLogoMenu } from "./mobile-logo-menu.js";
import { mobileTextMenu } from "./mobile-text-menu.js";
import createSubmenu from "./mobile-sub-menu.js";

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
    <div id="content-container" style="z-index: 10; height: 70px; background: #ffffff; position: absolute; bottom: 0; display: flex;">
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
