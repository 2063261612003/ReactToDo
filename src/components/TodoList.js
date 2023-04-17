import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { FaSort } from "react-icons/fa";
import axios from "axios";
import '../App.css'


const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [todoDetails, setTodoDetails] = useState({ id: "", userId: "", title: "", name: "", email: "" });
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos").then((response) => {
      setTodos(response.data);
    });
  }, []);



  const handleSort = (event) => {
    const column = event.target.getAttribute("data-column");
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTodos((prevTodos) =>
      prevTodos.sort((a, b) =>
        sortOrder === "asc" ? a[column] - b[column] : b[column] - a[column]
      )
    );
  };

  const handleOpen = (id, title, userId) => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`).then((response) => {
      console.log("Hi i m here with response" + response.data.name)
      setTodoDetails({
        id,
        userId,
        title,
        name: response.data.name,
        email: response.data.email,
      });
      setShowModal(true);
    })
  };
  const handleClose = () => setShowModal(false);


  const handleSearch = (event) => {
    setSearchKeyword(event.target.value.toLowerCase());
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.id.toString().includes(searchKeyword) ||
      todo.title.toLowerCase().includes(searchKeyword) ||
      todo.completed.toString().includes(searchKeyword)
  );

  return (
    <div className="d-flex justify-content-left" style={{width : "650px"}}>
      <div className="w-75">
        <h2 className="text-center my-4">TODO LIST</h2>
        <Form>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchKeyword}
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                ID{" "}
                <FaSort
                  data-column="id"
                  onClick={handleSort}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th>Title</th>
              <th>
                Status{" "}
                <FaSort
                  data-column="completed"
                  onClick={handleSort}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Completed" : "Incomplete"}</td>
                <td>

                  <Button
                    variant="primary"
                    onClick={() =>
                      handleOpen(
                        todo.id,
                        todo.title,
                        todo.userId
                      )
                    }
                  >
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div >
          <Modal show={showModal} onHide={handleClose} >
            <Modal.Header closeButton>
              <Modal.Title>USER DETAILS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>

                <tr>
                  <th>Todo ID : </th>
                  <td>{todoDetails.id}</td>
                </tr>
                <tr>
                  <th>Todo Title :</th>
                  <td>{todoDetails.title}</td>
                </tr>
                <tr>
                  <th>User ID :</th>
                  <td>{todoDetails.userId}</td>
                </tr>
                <tr>
                  <th>Name :</th>
                  <td>{todoDetails.name}</td>
                </tr>
                <tr>
                  <th>Email :</th>
                  <td>{todoDetails.email}</td>
                </tr>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="btn btn-danger" onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>

        </div>

      </div>
    </div>
  )
}

export default TodoList;