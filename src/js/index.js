import "../scss/index.scss";
import "./jquery.modal.min.js";

$(document).ready(function() {
  var todos = [];
  let todoCore = {
    readTodos: function() {
      $("#renderListTodo").empty();
      todos.forEach((Titem, index) => {
        let newItem = createItem(
          Titem.title,
          Titem.content,
          Titem.status,
          index
        );
        $("#renderListTodo").append(newItem);
      });
      let total = todos.length;
      $('#totoal').html(total);
      var uncompleted = 0
     for(let i in todos) {
       if(todos[i].status === false){
        uncompleted +=1
       }
      
     }
     $('#unCompleted').html(uncompleted)
    },
    deleteTodo: function(index) {
      todos.splice(index, 1);
      this.addTodosToLocalStorage();
      this.readTodos();
    },
    createTodos: function(new_title, new_content) {
      let newTodoItem = {
        title: new_title,
        content: new_content,
        status: false
      };
      todos.push(newTodoItem);
      this.addTodosToLocalStorage();
      this.readTodos();
    },
    addTodosToLocalStorage: function() {
      var todoStr = JSON.stringify(todos);
      localStorage.setItem("todos", todoStr);
    },
    getTodosFromLocalStorage: function() {
      var str = localStorage.getItem("todos");
      todos = JSON.parse(str);
      if (!todos) {
        todos = [];
      }
    },
    updateStatus: function(id, status) {
      todos[id].status = status;
      this.addTodosToLocalStorage();
      this.readTodos();
    },
    updateItem: function(id, title, content) {
      todos[id].title = title;
      todos[id].content = content;
      this.addTodosToLocalStorage();
      this.readTodos();
    },

  };

  function generateNode(nodeType, NodeText, className) {
    let item = document.createElement(nodeType);
    item.setAttribute("class", className);
    let textItem = document.createTextNode(NodeText);

    item.appendChild(textItem);
    return item;
  }
  function createItem(title, content, status, id) {
    var item = document.createElement("li");

    let iHeader = generateNode("div", "", "item-header");
    iHeader.addEventListener("click", function() {
      var cardBody = this.nextElementSibling;
      if (cardBody.style.display === "block") {
        cardBody.style.display = "none";
      } else {
        cardBody.style.display = "block";
      }
    });
    let label = generateNode("h4", title, "title");
    let editTitle = generateNode("input", "", "");
    editTitle.style.display = "none";
    iHeader.appendChild(label);
    iHeader.appendChild(editTitle);

    let pBody = generateNode("div", "", "panel-body");
    let itemContent = generateNode("p", content, "content");
    let editeContent = generateNode("textarea", "", "");
    editeContent.style.display = "none";

    let hr = generateNode("hr", "", "");
    let checkBoxLabel = generateNode("label", "", "switch");
    let itemStatus = generateNode("input", "", "status");
    itemStatus.checked = status;
    itemStatus.addEventListener("click", function() {
      todoCore.updateStatus(id, itemStatus.checked);
    });
    let spanStatus = generateNode("span", "", "slider");
    checkBoxLabel.appendChild(itemStatus);
    checkBoxLabel.appendChild(spanStatus);
    itemStatus.type = "checkbox";
    let itemDelete = generateNode("a", "Delete", "btn btn-primary");
    let itemUpdate = generateNode("a", "Edit", "btn btn-secondary");
    itemDelete.addEventListener("click", function() {
      todoCore.deleteTodo(id);
    });
    itemUpdate.addEventListener("click", function() {
      if (editTitle.style.display === "block") {
        editTitle.style.display = "none";
        editeContent.style.display = "none";
        itemContent.style.display = "block";
        itemUpdate.innerHTML = "Edit";
        label.style.display = "block";
        todoCore.updateItem(id, editTitle.value, editeContent.value);
      } else {
        editTitle.style.display = "block";
        editeContent.style.display = "block";
        itemContent.style.display = "none";
        editeContent.value = content;
        editTitle.value = title;
        label.style.display = "none";
        itemUpdate.innerHTML = "Update";
      }
    });

    pBody.appendChild(itemContent);
    pBody.appendChild(editeContent);
    pBody.appendChild(hr);
    pBody.appendChild(checkBoxLabel);
    pBody.appendChild(itemDelete);
    pBody.appendChild(itemUpdate);
    item.appendChild(iHeader);
    item.appendChild(pBody);
    return item;
  }
 

  $("#addTodo").on("click", function() {
    let todoTitle = $("#addTodo_title").val();
    let todoContent = $("#addTodo_content").val();
    todoCore.createTodos(todoTitle, todoContent);
    createItem(todoTitle, todoContent);
    $('#addTodo_title').val('')
    $('#addTodo_content').val('')
  });
  todoCore.getTodosFromLocalStorage();
  todoCore.readTodos();
});


