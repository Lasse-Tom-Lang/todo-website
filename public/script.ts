interface userData {
  id: string,
  name: string,
  todolists: {
    id: string,
    name: string,
    todos: {
      id: string,
      done: boolean,
      name: string
    }[]
  }[]
}

let userData:userData

fetch("/getUserData")
  .then((data) => data.json())
  .then((data) => {
    userData = data
    title.innerHTML = `Hello ${userData.name}`
    userData.todolists.forEach((list) => {
      let newHTML1 = document.createElement("h2");
      newHTML1.innerHTML = list.name;
      main.appendChild(newHTML1);
      let newHTML2 = document.createElement("ul");
      newHTML2.innerHTML = "<li><input type='text' placeholder='New ToDo' onblur='addItemBlur(event)' onkeydown='addItem(event)'></li>";
      main.appendChild(newHTML2);
    })
  })

let main = document.querySelector("main")
let title = document.querySelector("h1")
let lists = document.querySelectorAll("li input[type='text']")
let addList = document.querySelector("#addList") as HTMLImageElement
let addListName = document.querySelector(".addListName") as HTMLInputElement

function addItem(e) {
  if (e.keyCode == 13) {

    let input:string = e.target.value;
    if (input.trim().length != 0){
      e.target.value = "";
      let element = document.createElement("li") as HTMLLIElement;
      element.innerHTML = "<label><input type='checkbox'>"+ input + "<div></div></label>";

      e.target.parentNode.parentNode.insertBefore(element, e.target.parentNode);
      e.target.parentNode.parentNode.insertBefore(document.createElement("hr"), e.target.parentNode);
    }
  }
};

function addItemBlur(e) {

  let input:string = e.target.value;

  if (input.trim().length != 0){
    e.target.value = "";
    let element = document.createElement("li") as HTMLLIElement;
    element.innerHTML = "<label><input type='checkbox'>"+ input + "<div></div></label>";

    e.target.parentNode.parentNode.insertBefore(element, e.target.parentNode);
    e.target.parentNode.parentNode.insertBefore(document.createElement("hr"), e.target.parentNode);
  }
};

lists.forEach((element) => {
  element.addEventListener("keydown", (e) => addItem(e));
  element.addEventListener("blur", (e) => addItemBlur(e));
});

addList.addEventListener("click", () => {
  addList.style.display = "none";
  addListName.classList.add("addListNameActiv")
  addListName.focus();
});

addListName.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    addListName.classList = "addListName";
    addList.style.display = "block";

    let input = e.target.value;
    e.target.value = "";

    if (input.trim().length != 0) {
      let newHTML1 = document.createElement("h2");
      newHTML1.innerHTML = input;
      main.appendChild(newHTML1);
      let newHTML2 = document.createElement("ul");
      newHTML2.innerHTML = "<li><input type='text' placeholder='New ToDo' onblur='addItemBlur(event)' onkeydown='addItem(event)'></li>";
      main.appendChild(newHTML2);
      fetch(`/addList?listName=${input}`)
    }
  }
});