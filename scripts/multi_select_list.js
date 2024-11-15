const initMultiSelectList = function () {
    const lists = document.querySelectorAll(".ms-select-list");

    const handleListItemClick = (listItem, parent) => {
      const value = listItem.getAttribute("value");
      const text = listItem.innerText;
      parent.classList.remove("show");

      const toggleBtn = parent.querySelector(".ms-list-toggle");
      toggleBtn.querySelector(".ms-list-value").innerText = text;
      parent.setAttribute("data-value", value);
      parent.dispatchEvent(new Event("change")); 
      listItem.classList.add("selected");
    };

    const initializeListItem = (li) => {
      if (li.classList.contains("initialized")) return true;

      li.addEventListener("click", function(e) {
        e.stopPropagation();
        let parent = this.parentElement.parentElement;
        if (this.parentElement.classList.contains("collection")) {
          parent = this.parentElement.parentElement.parentElement;
        }
        handleListItemClick(this, parent);
      });

      li.classList.add("initialized");
    };

    const handleValueChange = function(e) {
      e.stopPropagation();
      const value = this.getAttribute("data-value");
      const toggleBtn = this.querySelector(".ms-list-toggle");
      
      let text = this.querySelector(`.ms-select-list-menu li[value="${value}"]`);
      if (value == "undefined") {
        text = this.getAttribute("data-default-value");
      } else if (text) {
        text = text.innerText;
      }
      toggleBtn.querySelector(".ms-list-value").innerText = text;
    };

    const initializeList = (list) => {
      const menu = list.querySelector(".ms-select-list-menu");
      const defaultVal = list
        .querySelector(".ms-list-toggle .ms-list-value")
        .getAttribute("value");
      
      list.setAttribute("data-default-value", defaultVal);
      menu.querySelectorAll("li").forEach(initializeListItem);
      list.addEventListener("valueChange", handleValueChange);

      if (list.classList.contains("initialized")) return true;

      list.querySelector(".ms-list-toggle").addEventListener("click", function(e) {
        e.stopPropagation();
        const lists = document.querySelectorAll(".ms-select-list");
        const parent = this.parentElement;
        lists.forEach(item => 
          item != parent ? item.classList.remove("show") : item
        );
        parent.classList.toggle("show");
      });

      list.classList.add("initialized");
    };

    lists.forEach(initializeList);

    document.onclick = function(e) {
      const target = e.target.parentElement?.tagName === "LI" 
        ? e.target.parentElement 
        : e.target;

      // Close dropdown if clicking outside
      if (!target.classList.contains("ms-select-list") && 
          !target.classList.contains("live-search")) {
        lists.forEach(list => list.classList.remove("show"));
      }

      // Handle list item selection
      if (target.tagName !== "LI") return true;

      e.stopPropagation();
      let parent = target.parentElement.parentElement;
      if (target.parentElement.classList.contains("collection")) {
        parent = target.parentElement.parentElement.parentElement;
      }

      if (!parent.classList.contains("ms-select-list")) return true;
      handleListItemClick(target, parent);
    };
  };

  export default initMultiSelectList;