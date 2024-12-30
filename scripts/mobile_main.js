import { fabric } from "fabric";
import { mobileBackgroundView } from "./mobile-background-view.js";
import { mobileLogoView } from "./mobile-logo-view.js";
import { mobileAddView } from "./mobile-add-view.js";
import { mobileTextView } from "./mobile-text-view.js";
import { mobileBackgroundMenu } from "./mobile-background-menu.js";
import { mobileLogoMenu } from "./mobile-logo-menu.js";

const navItems = document.querySelectorAll("#mobile-nav-bar [data-name]");
const categoryContent = document.querySelector("#mobile-category-content");

const mainCategoryData = {
  add: mobileAddView,
  logo: mobileLogoView,
  text: mobileTextView,
  background: mobileBackgroundView,
};

const menuCategoryData = {
  logo: mobileLogoMenu,
  background: mobileBackgroundMenu,
};

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    const category = item.getAttribute("data-name");

    // MAIN CATEGORY -> Shows add, logo, text, background
    if (!mainCategoryData[category]) return;
    categoryContent.innerHTML = `
        <div id="content-container" style="z-index: 10; background-color: #ffffff; height: auto; position: absolute; bottom: 0; width: 100vw; padding: 15px;">
          <div id="content-back-btn" style="display: flex; align-items: center; margin-bottom: 10px;">
            <i class="fa-solid fa-arrow-left" style="color: var(--gray); font-size: 20px; margin-right: 10px;"></i>
          </div>
          ${mainCategoryData[category]}
        </div>`;
    categoryContent.style.display = "block";

    // Close button for category view
    const contentBackBtn = document.querySelector("#content-back-btn");
    contentBackBtn.addEventListener("click", () => {
      categoryContent.style.display = "none";
    });

    // MAIN CATEGORY MENUS -> Opens add, logo, text, background
    if (menuCategoryData[category]) {
      menuCategoryData[category]();
    }
  });
});
