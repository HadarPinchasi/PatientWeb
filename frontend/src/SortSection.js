import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

function SortSection({ setSortedData, data }) {
  const [sortColumn1, setSortColumn1] = useState("");
  const [sortColumn2, setSortColumn2] = useState("");

  // Handle sorting when button is clicked
  const handleSort = () => {
    if (!sortColumn1) {
      alert("Please select at least one column to sort by.");
      return;
    }

    const sorted = [...data].sort((a, b) => {
      let primary = 0;
      let secondary = 0;

      if (sortColumn1) {
        // Special handling for date comparison, otherwise standard string comparison
        primary = sortColumn1 === "timestamp"
          ? (new Date(b.timestamp) - new Date(a.timestamp)) 
          : (a[sortColumn1] > b[sortColumn1] ? 1 : a[sortColumn1] < b[sortColumn1] ? -1 : 0);
      }
        // Apply secondary sort only if primary sort resulted in equality
      if (sortColumn2 && primary === 0) {
        secondary = sortColumn2 === "timestamp"
          ? (new Date(b.timestamp) - new Date(a.timestamp)) 
          : (a[sortColumn2] > b[sortColumn2] ? 1 : a[sortColumn2] < b[sortColumn2] ? -1 : 0);
      }

      return primary || secondary;
    });

    // Update the sorted data in parent component
    setSortedData(sorted);
  };

  return (
    <Row className="mt-4 text-center">
      <Col md={5}>
        <Form.Label>Sort by:</Form.Label>
        <Form.Select onChange={(e) => setSortColumn1(e.target.value)}>
          <option value="">Select Column</option>
          <option value="timestamp">Date</option>
          <option value="patient_id">Patient ID</option>
        </Form.Select>
      </Col>
      <Col md={5}>
        <Form.Label>Then by:</Form.Label>
        <Form.Select onChange={(e) => setSortColumn2(e.target.value)}>
          <option value="">Select Column</option>
          <option value="timestamp">Date</option>
          <option value="patient_id">Patient ID</option>
        </Form.Select>
      </Col>
      <Col md={2} className="d-flex align-items-end">
        <Button variant="primary" onClick={handleSort}>Sort</Button>
      </Col>
    </Row>
  );
}

export default SortSection;
