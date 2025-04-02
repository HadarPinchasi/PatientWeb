import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import UploadSection from "./UploadSection";
import SortSection from "./SortSection";
function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  
  // Fetch patient data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try{
      const response = await fetch("http://localhost:3001/patients", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(response.error);
      }
      const result = await response.json();
      setData(result);
      setSortedData(result); }
      catch(error){
          console.error("Error fetching data:", error)
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="mt-5">
      <UploadSection/>
      <SortSection setSortedData= {setSortedData}
      data={data}/>
      <Row className="mt-4">
        <Col>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index} className={`${row.latest ? "" : "table-secondary text-decoration-line-through"}`}>
                  <td>{row.timestamp}</td>
                  <td>{row.patient_id}</td>
                  <td>{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
