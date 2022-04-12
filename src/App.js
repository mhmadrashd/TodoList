import { useState, useEffect } from "react";
import React from "react";
import "./App.css";
import background from "./background.jpg";

function TodoInput({ onSubmit, label = "Add Todo", inputValue }) {
  let [value, setValue] = useState(inputValue);
  return (
    <div className="ipField">
      <input
        className="ipTxt"
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      ></input>
      <button
        className="ipBtn"
        onClick={() => {
          onSubmit(value);
          setValue("");
        }}
      >
        {label}
      </button>
    </div>
  );
}

function TodoItem({
  value,
  onDelete,
  index,
  completeTodo,
  children,
  onChecked,
  onDoubleClick,
}) {
  return (
    <div>
      <br></br>
      <li
        className="list-group-item"
        onDoubleClick={() => onDoubleClick(value.id)}
      >
        <input
          type="checkbox"
          checked={value.isCompleted}
          onChange={() => {
            onChecked(value);
          }}
        />
        {value.title}

        <button className="xBtn" onClick={() => onDelete()}>
          X
        </button>
      </li>
    </div>
  );
}

function TodoList({
  items,
  onDelete,
  completeTodo,
  header,
  onChecked,
  onUpdate,
}) {
  const [inEdit, setInEdit] = useState(null);
  return (
    <>
      {header}
      <ul className="mylist">
        {items.map((item) =>
          inEdit === item.id ? (
            <TodoInput
              inputValue={item.title}
              label="Save"
              onSubmit={(value) => {
                onUpdate(item, value);
                setInEdit(null);
              }}
            />
          ) : (
            <TodoItem
              key={item.id}
              value={item}
              onDelete={() => {
                onDelete(item);
              }}
              onChecked={() => {
                onChecked(item);
              }}
              onDoubleClick={(value) => setInEdit(value)}
            >
              {(title) => <span>{title}</span>}
            </TodoItem>
          )
        )}
      </ul>
    </>
  );
}

function App() {
  const [items, setItems] = useState([
    { id: 1, title: "item1", isCompleted: false },
    { id: 2, title: "item2", isCompleted: false },
    { id: 3, title: "item3", isCompleted: false },
  ]);
  
    const handleUpdate = (item, value) =>{
      setItems(
        items.map((TodoItem) =>
          TodoItem.id === item.id
            ? { ...TodoItem, title: value }
            : TodoItem
        )
      );
    }
  // const completeTodo = index => {
  //   const newTodos = [...items];
  //   newTodos[index].isCompleted = true;
  //   setItems(newTodos);
  // };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => setItems(json));
  }, []);

  return (
    <div style={{ backgroundImage: `url(${background})` }}>
      <TodoInput
        onSubmit={(value) => {
          setItems([
            ...items,
            { id: Math.random(), title: value, isCompleted: false },
          ]);
        }}
      />
      <TodoList
        header={<h2 className="title">ToDo List Items:</h2>}
        items={items}
        onDelete={(item) => {
          setItems(items.filter((TodoItem) => TodoItem.id !== item.id));
        }}
        // completeTodo={completeTodo}
        onChecked={(item) => {
          setItems(
            items.map((TodoItem) =>
              TodoItem.id === item.id
                ? { ...TodoItem, isCompleted: !TodoItem.isCompleted }
                : TodoItem
            )
          );
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
