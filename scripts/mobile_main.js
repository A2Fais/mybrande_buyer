const navItems = document.querySelectorAll("#mobile-nav-bar [data-name]");
const categoryContent = document.querySelector("#mobile-category-content");

const categoryData = {
  add: `<div>
          <h3>Add New Item</h3>
          <button>Add Item</button>
        </div>`,
  logo: `<div>
          <h3>Logo Options</h3>
          <button>Upload Logo</button>
        </div>`,
  text: `<div>
          <h3>Text Settings</h3>
          <input type="text" placeholder="Enter text" />
        </div>`,
  background: `
              <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
                 <h3>Background Settings</h3>
                 <input type="color" />
              <div>`,
};

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    const category = item.getAttribute("data-name");

    if (categoryData[category]) {
      categoryContent.innerHTML = `<div style="background-color: #ffffff; height: 100px; position: absolute; bottom: 0; width: 100svw">
          ${categoryData[category]}
        </div>`;
      categoryContent.style.display = "block";
    }
  });
});

document.addEventListener("click", (event) => {
  if (!categoryContent.contains(event.target)) {
    categoryContent.style.display = "none";
  }
});
