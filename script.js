main = document.querySelector("main");

lists = document.querySelectorAll("li input[type='text']");

function addItem(e) {
  if (e.keyCode == 13) {

    input = e.target.value;

    if (input.trim().length != 0){
      e.target.value = "";
      element = document.createElement("li");
      element.innerHTML = "<label><input type='checkbox'>"+ input + "<div></div></label>";

      e.target.parentNode.parentNode.insertBefore(element, e.target.parentNode);
      e.target.parentNode.parentNode.insertBefore(document.createElement("hr"), e.target.parentNode);
    }
  }
};

function addItemBlur(e) {

  input = e.target.value;

  if (input.trim().length != 0){
    e.target.value = "";
    element = document.createElement("li");
    element.innerHTML = "<label><input type='checkbox'>"+ input + "<div></div></label>";

    e.target.parentNode.parentNode.insertBefore(element, e.target.parentNode);
    e.target.parentNode.parentNode.insertBefore(document.createElement("hr"), e.target.parentNode);
  }
};

lists.forEach(element => {
  element.addEventListener("keydown", e => addItem(e));
  element.addEventListener("blur", e => addItemBlur(e));
});

addList = document.getElementById("addList");

addListName = document.querySelector(".addListName");

addList.addEventListener("click", (e) => {
  addList.style.display = "none";
  addListName.classList.add("addListNameActiv")
  addListName.focus();
});

addListName.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    addListName.classList = "addListName";
    addList.style.display = "block";

    input = e.target.value;
    e.target.value = "";

    if (input.trim().length != 0) {
      newHTML = document.createElement("h2");
      newHTML.innerHTML = input;
      main.appendChild(newHTML);
      newHTML = document.createElement("ul");
      newHTML.innerHTML = "<li><input type='text' placeholder='New ToDo' onblur='addItemBlur(event)' onkeydown='addItem(event)'></li>";
      main.appendChild(newHTML);
    }
  }
});