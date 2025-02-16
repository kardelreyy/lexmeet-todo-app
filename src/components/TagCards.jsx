import React from "react";

function TagCards({ totalTaskNum, priorityTitle }) {
  return (
    <>
      <div className="col">
        <div
          className="card p-3 fs-2 text-center text-light bg-transparent shadow"
          style={{ border: "solid 3px #5E1B89" }}
        >
          {totalTaskNum}
        </div>
        <small className="d-flex justify-content-center text-light fw-semibold my-2">
          {priorityTitle}
        </small>
      </div>
    </>
  );
}

export default TagCards;
