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

let main = document.querySelector("main") as HTMLElement
let title = document.querySelector("h1") as HTMLHeadingElement
let lists = document.querySelectorAll("li input[type='text']")
let addList = document.querySelector("#addList") as HTMLImageElement
let addListName = document.querySelector(".addListName") as HTMLInputElement

function addToDo(toDoName: string, done: boolean) {
  return `
    <li>
      <label>
        <input type="checkbox" ${done?"checked":""}>
        ${toDoName}
        <div/>
      </label>
    </li>
  `
}

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
      list.todos.forEach((item) => {
        newHTML2.innerHTML += addToDo(item.name, item.done)
      })
      newHTML2.innerHTML += `<li><input type='text' placeholder='New ToDo' onblur='addItemBlur(event)' data-id=${list.id} onkeydown='addItem(event)'></li>`;
      main.appendChild(newHTML2);
    })
  })

function addItem(e:KeyboardEvent) {
  if (e.key == "Enter") {
    let target = e.target as HTMLInputElement
    let input = target.value;
    if (input.trim().length != 0){
      target.value = "";
      let element = document.createElement("li") as HTMLLIElement;
      element.innerHTML = "<label><input type='checkbox'>"+ input + "<div></div></label>";
      target.parentNode!.parentNode!.insertBefore(element, target.parentNode);
      target.parentNode!.parentNode!.insertBefore(document.createElement("hr"), target.parentNode);
      fetch(`/addToDo?todo=${input}&todolist=${target.getAttribute("data-id")}`)
    }
  }
};

function addItemBlur(e:Event) {
  let target = e.target as HTMLInputElement
  let input:string = target.value;
  if (input.trim().length != 0){
    target.value = "";
    let element = document.createElement("li") as HTMLLIElement;
    element.innerHTML = "<label><input type='checkbox'>"+ input + "<div></div></label>";

    target.parentNode!.parentNode!.insertBefore(element, target.parentNode);
    target.parentNode!.parentNode!.insertBefore(document.createElement("hr"), target.parentNode);
    fetch(`/addToDo?todo=${input}&todolist=${target.getAttribute("data-id")}`)
  }
};

lists.forEach((element) => {
  element.addEventListener("keydown", (e) => addItem);
  element.addEventListener("blur", addItemBlur);
});

addList.addEventListener("click", () => {
  addList.style.display = "none";
  addListName.classList.add("addListNameActiv")
  addListName.focus();
});

addListName.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    addListName.classList.value = "addListName";
    addList.style.display = "block";
    let target = e.target as HTMLInputElement
    let input = target.value;
    target.value = "";

    if (input.trim().length != 0) {
      fetch(`/addList?listName=${input}`)
        .then((data) => data.json())
        .then((data) => {
          let newHTML1 = document.createElement("h2");
          newHTML1.innerHTML = input;
          main.appendChild(newHTML1);
          let newHTML2 = document.createElement("ul");
          newHTML2.innerHTML = `<li><input type='text' placeholder='New ToDo' onblur='addItemBlur(event)' data-id=${data.id} onkeydown='addItem(event)'></li>`;
          main.appendChild(newHTML2);
        })
    }
  }
});