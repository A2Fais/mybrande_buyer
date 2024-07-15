const querySelect = (element) => document.querySelector(element);
const querySelectAll = (element) => document.querySelectorAll(element);
const getAttr = (element, attr) => querySelect(element).getAttribute(attr);

export { querySelect, querySelectAll, getAttr };
