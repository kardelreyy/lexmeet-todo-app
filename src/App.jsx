import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Card,
  Badge,
} from "react-bootstrap";
import {
  RiAddCircleFill,
  RiCheckboxCircleFill,
  RiDeleteBin4Fill,
  RiPencilFill,
  RiCheckboxFill,
  RiSortAsc,
  RiSortDesc,
} from "react-icons/ri";
import "./index.css";

import TagCards from "./components/TagCards";
import ViewCompleted from "./components/ViewCompleted";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [sortTodayAsc, setSortTodayAsc] = useState(true);
  const [sortWeekAsc, setSortWeekAsc] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrEditTask = () => {
    if (!taskTitle.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setError("");

    if (editingTaskIndex !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskIndex
            ? { ...task, title: taskTitle, dueDate, priority }
            : task
        )
      );
      setEditingTaskIndex(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        dueDate,
        priority,
        completed: false,
        archived: false,
      };
      setTasks([...tasks, newTask]);
    }

    setTaskTitle("");
    setDueDate("");
    setPriority("To Do");
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (!taskToEdit) return;

    setTaskTitle(taskToEdit.title);
    setDueDate(taskToEdit.dueDate);
    setPriority(taskToEdit.priority);
    setEditingTaskIndex(taskId);
  };

  const handleArchiveTask = (taskId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to archive this task?"
    );

    if (isConfirmed) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRestoreTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: false } : task
      )
    );
  };

  const tasksDueToday = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  const tasksDueThisWeek = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate) > new Date() &&
      new Date(task.dueDate) <=
        new Date(new Date().setDate(new Date().getDate() + 7))
  );

  const sortedTasksDueToday = [...tasksDueToday].sort((a, b) => {
    return sortTodayAsc
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate);
  });

  const sortedTasksDueThisWeek = [...tasksDueThisWeek].sort((a, b) => {
    return sortWeekAsc
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate);
  });

  return (
    <Container fluid className="p-4 d-flex flex-column justify-content-center">
      <Row>
        <Col className="px-4 justify-content-center" lg={7}>
          <h1 className="custom-header-font text-light fw-bold">
            Ready to slay your day?
          </h1>

          <p className="text-light">
            Today is{" "}
            <strong>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </strong>
            ! You currently have:
          </p>

          {/* CARDS AS COUNTERS FOR EXISTING TASKS AND CLASSIFICATIONS */}
          <Row className="my-1">
            <TagCards
              totalTaskNum={tasks.filter((task) => !task.completed).length}
              priorityTitle="Total Tasks"
            />
            <TagCards
              totalTaskNum={
                tasks.filter(
                  (task) => task.priority === "To Do" && !task.completed
                ).length
              }
              priorityTitle="To Do"
            />
            <TagCards
              totalTaskNum={
                tasks.filter(
                  (task) => task.priority === "To Plan" && !task.completed
                ).length
              }
              priorityTitle="To Plan"
            />
            <TagCards
              totalTaskNum={
                tasks.filter(
                  (task) => task.priority === "To Delegate" && !task.completed
                ).length
              }
              priorityTitle="To Delegate"
            />
          </Row>

          <hr className="w-100 mt-4 mb-3 text-light" />

          {/* FORM FOR ADDING AND EDITING TASKS */}
          <Form className="mb-1 mb-md-3">
            <Row>
              <Col sm={12} lg={5} xl={5} className="mb-2 mb-lg-0">
                <Form.Control
                  type="text"
                  placeholder="Enter a task"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    setError("");
                  }}
                  className={`shadow ${
                    error ? "border border-3 border-warning" : ""
                  }`}
                />
                {error && <small className="text-light">{error}</small>}{" "}
              </Col>
              <Col xs={6} sm={6} lg={4} xl={4} className="mb-2 mb-md-0">
                <Form.Control
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="shadow"
                />
              </Col>
              <Col xs={6} sm={6} lg={2} xl={2} className="mb-2 mb-lg-0">
                <Form.Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="shadow"
                >
                  <option value="To Do">To Do</option>
                  <option value="To Plan">To Plan</option>
                  <option value="To Delegate">To Delegate</option>
                </Form.Select>
              </Col>
              <Col
                xs={12}
                sm={12}
                lg={1}
                xl={1}
                className="mb-2 mb-lg-0 d-flex d-md-block justify-content-end justify-content-lg-center"
              >
                <Button
                  variant="primary"
                  className="d-flex align-items-center justify-content-center bg-transparent border-0 p-1"
                  onClick={handleAddOrEditTask}
                >
                  {editingTaskIndex !== null ? (
                    <RiCheckboxCircleFill size={32} />
                  ) : (
                    <RiAddCircleFill size={32} />
                  )}
                </Button>
              </Col>
            </Row>
          </Form>

          {/* MAIN LIST WHERE TASKS APPEAR AFTER BEING CREATED */}
          <Container
            className="custom-scrollbar p-0 mb-3 mb-lg-0"
            style={{ height: "330px", maxHeight: "350px", overflowY: "auto" }}
          >
            {tasks.filter((task) => !task.completed).length === 0 ? (
              <p className="text-light mt-3 fs-5 text-center">
                No tasks yet! Add some.
              </p>
            ) : (
              <Table borderless hover className="mt-1">
                <tbody>
                  {tasks
                    .filter((task) => !task.completed)
                    .map((task, index) => (
                      <tr key={task.id} className="align-middle">
                        <td className="bg-transparent text-light">
                          <Form.Check
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id)}
                          />
                        </td>
                        <td className="bg-transparent text-light">
                          {task.title}
                        </td>
                        <td className="bg-transparent text-light">
                          {task.dueDate
                            ? `${new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )} - ${new Date(task.dueDate).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}`
                            : "No deadline set"}
                        </td>
                        <td className="bg-transparent">
                          <Badge bg="light" style={{ color: "#F5412C" }}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="bg-transparent text-light align-middle">
                          <div className="d-flex justify-content-evenly align-items-center w-100">
                            <Button
                              size="sm"
                              className="bg-transparent border-0 text-light"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <RiPencilFill size={21} />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-transparent border-0 text-light"
                              onClick={() => handleArchiveTask(task.id)}
                            >
                              <RiDeleteBin4Fill size={20} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Container>
          <hr className="w-100 d-lg-none mt-2 mb-4 text-light" />
        </Col>

        {/* RIGHT SECTION OF THE PAGE - DUE TODAY AND DUE THIS WEEK */}
        <Col className="d-flex flex-column" lg={5}>
          {/* DUE TODAY SECTION */}
          <Card
            className="custom-card-scrollbar px-4 py-2 bg-white rounded-4 flex-grow-1 d-flex"
            style={{ height: "300px", maxHeight: "300px", overflow: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <p
                className="custom-header-font fs-4 fw-semibold m-0"
                style={{ color: "#F4512C" }}
              >
                DUE TODAY
              </p>
              <Button
                className="bg-transparent border-0 text-dark"
                onClick={() => setSortTodayAsc(!sortTodayAsc)}
              >
                {sortTodayAsc ? (
                  <RiSortDesc size={22} color="#5E1B89" />
                ) : (
                  <RiSortAsc size={22} color="#5E1B89" />
                )}
              </Button>
            </div>
            {sortedTasksDueToday.length > 0 ? (
              <Table responsive borderless hover className="mt-1">
                <tbody>
                  {sortedTasksDueToday.map((task) => (
                    <tr key={task.id} className="align-middle">
                      <td>{task.title}</td>
                      <td className="text-secondary">
                        Today at{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "No deadline set"}
                      </td>
                      <td>
                        <Badge bg="dark" className="text-light">
                          {task.priority}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="fs-5 mt-4 text-center">No tasks due today.</p>
            )}
          </Card>

          {/* DUE THIS WEEK SECTION */}
          <Card
            className="custom-card-scrollbar px-4 py-2 mt-2 bg-white rounded-4 flex-grow-1 d-flex"
            style={{ height: "300px", maxHeight: "300px", overflow: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <p
                className="custom-header-font fs-4 fw-semibold m-0"
                style={{ color: "#F4512C" }}
              >
                DUE THIS WEEK
              </p>
              <span>
                <Button
                  className="bg-transparent border-0 text-dark"
                  onClick={() => setSortWeekAsc(!sortWeekAsc)}
                >
                  {sortWeekAsc ? (
                    <RiSortDesc size={22} color="#5E1B89" />
                  ) : (
                    <RiSortAsc size={22} color="#5E1B89" />
                  )}
                </Button>
              </span>
            </div>
            {sortedTasksDueThisWeek.filter(
              (task) =>
                new Date(task.dueDate).toDateString() !==
                new Date().toDateString()
            ).length > 0 ? (
              <Table responsive borderless hover className="mt-1">
                <tbody>
                  {sortedTasksDueThisWeek
                    .filter(
                      (task) =>
                        new Date(task.dueDate).toDateString() !==
                        new Date().toDateString()
                    )
                    .map((task) => (
                      <tr key={task.id} className="align-middle">
                        <td>{task.title}</td>
                        <td className="text-secondary">
                          {task.dueDate
                            ? `${new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )} - ${new Date(task.dueDate).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}`
                            : "No deadline set"}
                        </td>
                        <td>
                          <Badge bg="dark" className="text-light">
                            {task.priority}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <p className="fs-5 mt-4 text-center">
                No tasks due for this week.
              </p>
            )}
          </Card>

          {/* BUTTON FOR OPENING VIEW COMPLETED TASKS MODAL */}
          <Button
            className="border-0 fw-bold text-center mt-1"
            style={{ backgroundColor: "#F4512C" }}
            onClick={() => setShowCompletedModal(true)}
          >
            <RiCheckboxFill size={18} className="me-1 mb-1" />
            View Completed Tasks
          </Button>
        </Col>
      </Row>

      {/* COMPLETED TASKS MODAL */}
      <ViewCompleted
        show={showCompletedModal}
        handleClose={() => setShowCompletedModal(false)}
        completedTasks={tasks.filter((task) => task.completed)}
        handleRestoreTask={handleRestoreTask}
      />
    </Container>
  );
}

export default App;
