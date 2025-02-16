import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { RiArrowGoBackFill } from "react-icons/ri";

const ViewCompleted = ({
  show,
  handleClose,
  completedTasks,
  handleRestoreTask,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(to right, #9c4ec2, #ff8661)",
        }}
        className="custom-header-font text-light"
      >
        <Modal.Title>Completed Tasks</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {completedTasks.length === 0 ? (
          <p className="text-center fs-5">No completed tasks.</p>
        ) : (
          <Table borderless hover>
            <thead>
              <tr>
                <th style={{ color: "#f5412c" }}>Task</th>
                <th style={{ color: "#f5412c" }}>Due Date</th>
                <th style={{ color: "#f5412c" }}>Restore</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((task) => (
                <tr key={task.id} className="align-middle">
                  <td>{task.title}</td>
                  <td>
                    {task.dueDate
                      ? `${new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} - ${new Date(task.dueDate).toLocaleTimeString(
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
                    <Button
                      className="border-0 bg-transparent text-dark p-0"
                      onClick={() => handleRestoreTask(task.id)}
                    >
                      <RiArrowGoBackFill size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="border-0"
          style={{ backgroundColor: "#f05c4cd1" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewCompleted;
