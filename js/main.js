const API = "http://localhost:8000/user";

//? создание публикации
let inpImg = document.querySelector("#inpImg");
let inpDesc = document.querySelector("#inpDescription");
let btnCreate = document.querySelector("#btnCreate");
let adminBox = document.querySelector(".admin__box");
let admin = document.querySelector("#account__admin");
let addPost = document.querySelector("#add__box");
let mainModalWindow = document.querySelector(".main_modal_window");
let pinCode = "";
let btnDelete = document.querySelector(".btn_delete");
let mainModal = document.querySelector(".main_modal");
let inpReadImg = document.querySelector(".window_edit_details");
let inpReadDesc = document.querySelector(".window_edit_url");
let btnReadSave = document.querySelector(".btn_change");
let btnReadClose = document.querySelector(".window_edit_close");

//! поисковик
let inpSearch = document.querySelector("#inpSearch");
let searchValue = inpSearch.value;

//! вход в админку
function adminCreate() {
  if (pinCode !== "12345") {
    adminBox.style.display = "none";
  } else {
    adminBox.style.display = "block";
  }
}
admin.addEventListener("click", () => {
  console.log("eee");
  pinCode = prompt("Введите пароль");
  adminCreate();
});

//! добавляем карточку на бэк
function createProduct(createObj) {
  fetch(API, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(createObj),
  }).then(() => readProduct());
}

//! нажимаем кнопку проверяем заполненность и запускаем функцию добавления на бэк
btnCreate.addEventListener("click", () => {
  if (!inpImg.value.trim() || !inpDesc.value.trim()) {
    alert("Заполните все поля!");
    return;
  }
  let createObj = {
    img: inpImg.value,
    description: inpDesc.value,
  };
  createProduct(createObj);
  inpImg.value = "";
  inpDesc.value = "";
});

//! функция отображения
function readProduct() {
  fetch(`${API}?q=${searchValue}`)
    .then(elem => elem.json())
    .then(item => {
      mainModalWindow.innerHTML = "";
      item.forEach(element => {
        mainModalWindow.innerHTML += `<div class="modal_window">
        <div class="modal_window_first">
          <div class="imd_account_name">
            <img
              src="https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg"
              class="modal_window_first_left"
            />
            <span class="modal_window_first_center">
              <h4 class="account_holder">xacbik</h4>
              <h5 class="descr_holder">Paris</h5>
            </span>
          </div>
          <div class="modal_window_first_right" onclick = openModal(${element.id})>...</div>
        </div>
        <div class="place_for_photo">
          <img
            src=${element.img}
            alt="photo"
            class="post_photo"
          />
        </div>
        <div class="panel_after_post">
          <div class="heart_comment_send">
            <span class="material-symbols-outlined"> favorite </span>
          </div>
          <div class="heart_comment_send">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/comment-3251596-2724645.png"
              alt=""
            />
          </div>
          <div class="heart_comment_send">
            <img
              src="https://i.pinimg.com/originals/67/9c/1e/679c1ed7484edf66356691e36e948fff.png"
              alt=""
            />
          </div>
          
          <div class="to_save">
            
            <div class="heart_comment_send">
          <button class="btndel" onclick= deleteProduct(${element.id})>Delete</button>
          </div>
          </div>
        </div>
        <div class="post_description">
          <h5 class="post_text">
            ${element.description}
          </h5>
        </div>
        <div class="coments_add">
          <input
            type="text"
            name=""
            id=${element.id}
            class="inp_add_comment"
            placeholder="   Add your commentariy..."
          />
          <button class="btn_add_comment"><h3>Opublikovat</h3></button>
          
        </div>
      </div>`;
      });
      // pageList();
      // adminPanel();
    });
}
readProduct();

// //! создаём функцию удаления
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readProduct());
}

//! открываем модальное окно
let editId = "";
function openModal(id) {
  mainModal.style.display = "block";
  fetch(`${API}/${id}`)
    .then(element => element.json())
    .then(user => {
      inpReadImg.value = user.img;
      inpReadDesc.value = user.description;
      editId = user.id;
      console.log(editId);
    });
}

//! отправляем на бэк сохранённые данные
function editReadProduct(editId, createReadObj) {
  fetch(`${API}/${editId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(createReadObj),
  }).then(() => readProduct());
}

//! сохраняем изменения
btnReadSave.addEventListener("click", () => {
  if (!inpReadImg.value.trim() || !inpReadDesc.value.trim()) {
    alert("Заполните все поля!");
    return;
  }
  //? создаём объект со значениями из инпутов
  let createReadObj = {
    img: inpReadImg.value,
    description: inpReadDesc.value,
  };
  editReadProduct(editId, createReadObj);
  mainModal.style.display = "none";
});

//! Edition END
//? на кнопке закрыть событие закрывает окно
btnReadClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

//! это для поиска
inpSearch.addEventListener("input", e => {
  searchValue = e.target.value;
  readProduct();
});
