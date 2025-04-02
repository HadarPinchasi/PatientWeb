import { RiTestTubeLine } from "react-icons/ri";
import React, { useState, useRef } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

function UploadSection() {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a CSV file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                // Success case
                alert("File uploaded successfully! please refresh the page fo see updated version");
            } else {
                // If errors exist in the result
                if (result.errors && Array.isArray(result.errors)) {
                    alert("You have issues in the attached CSV file you uploaded. The problems are detailed below.\n"+ result.errors.join("\n"));
                } else {
                    alert(result.error || "Unknown error occurred.");
                }
            }
        } catch (error) {
            alert("Error uploading file: " + error.message);
        }

        setFile(null);
        fileInputRef.current.value = "";
    };

    return (
        <Row className="justify-content-center">
            <Col md={7} className="text-center">
                <h1 className="d-flex align-items-center justify-content-center gap-2">
                    <RiTestTubeLine style={{ fontSize: "1em", color: "blue" }} />
                    Revision Keeper
                </h1>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Please upload CSV File:</Form.Label>
                        <Form.Control type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
export default UploadSection;
