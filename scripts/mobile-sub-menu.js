export default function createSubmenu(parentMenu, submenuContent) {
  const submenu = document.createElement("div");
  submenu.style.width = "100%";
  submenu.style.height = "100%";
  submenu.style.zIndex = "20";
  submenu.style.display = "none";

  const contentElement = document.createElement("div");
  contentElement.innerHTML = submenuContent;
  submenu.appendChild(contentElement);

  parentMenu.parentElement.appendChild(submenu);
  return submenu;
}
