import React, { useState } from "react";
import "./SegmentPopup.css";

const SegmentPopup = ({ onClose }) => {
  const initialOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [availableOptions, setAvailableOptions] = useState([...initialOptions]);
  const [dynamicDropdowns, setDynamicDropdowns] = useState([]);
  const [addedSchemas, setAddedSchemas] = useState([]);

  const handleAddSchema = () => {
    if (selectedSchema) {
      setAddedSchemas([...addedSchemas, selectedSchema]);

      // Remove the selected option from available options
      const updatedAvailableOptions = availableOptions.filter(
        (option) => option.value !== selectedSchema.value
      );
      setAvailableOptions(updatedAvailableOptions);

      // Create a new dropdown with selected value and remaining unselected options
      const newDropdowns = [...dynamicDropdowns, selectedSchema];
      setDynamicDropdowns(newDropdowns);

      // Reset the selected schema
      setSelectedSchema("");
    }
  };
  const handleDynamicDropdownChange = (e, dropdownIndex) => {
    const { value } = e.target;
    const updatedDynamicDropdowns = [...dynamicDropdowns];
    updatedDynamicDropdowns[dropdownIndex] = availableOptions.find(
      (option) => option.value === value
    );
    setDynamicDropdowns(updatedDynamicDropdowns);
    // Remove the selected value from available options
    const updatedAvailableOptions = availableOptions.filter(
      (option) => option.value !== value
    );
    setAvailableOptions(updatedAvailableOptions);
  };

  const renderDynamicDropdowns = () => {
    return dynamicDropdowns.map((selectedSchemas, index) => (
      <div key={index} className="custom-select-dynamic">
        <select
          value={selectedSchemas.label}
          onChange={(e) => handleDynamicDropdownChange(e, index)}
        >
          <option value={selectedSchemas.value}>{selectedSchemas.label}</option>
          {availableOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  const handleCnacel = () => {
    setSegmentName("");
    setSelectedSchema("");
    setDynamicDropdowns([]);
    setAddedSchemas([]);
  };
  const handleSave = () => {
    if (segmentName && addedSchemas.length > 0) {
      // Construct the data in the specified format
      const segmentData = {
        segment_name: segmentName,
        schema: addedSchemas.map((schema) => ({
          [schema.value]: schema.label,
        })),
      };
      alert(
        `segmentName: ${segmentName} is created. check the console for see the full segement data.`
      );
      console.log("segmentData", segmentData);
      // Send the data to the server
      fetch("our-server-endpoint-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(segmentData),
      })
        .then((response) => {
          if (response.ok) {
            // Segment saved successfully, you can handle the response here
            console.log("Segment saved successfully");
          } else {
            // Handle errors here
            console.error("Error saving segment");
          }
        })
        .catch((error) => {
          // Handle network errors here
          console.error("Network error:", error);
        });
    } else {
      alert(`please choose the values`);

      // Handle invalid data or missing segment name here
      console.error("Invalid segment data");
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
          <h2>Saving Segment</h2>
        </div>
        <div className="popup-body">
          <label>Enter the Name of the Segment:</label>
          <input
            type="text"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="Name of the Segment"
          />
          <p>
            To save your segement,you need to add the schemas to build the query
          </p>

          {/* Dropdown for adding new schema */}

          <div className="custom-select">
            <select
              value={selectedSchema.value}
              onChange={(e) =>
                setSelectedSchema(
                  initialOptions.find(
                    (option) => option.value === e.target.value
                  )
                )
              }
            >
              <option value="">Add schema to segement</option>
              {availableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Button to add a new schema */}
          <div className="custom-select">
            <button onClick={handleAddSchema}>+ Add new schema</button>
          </div>
          {/* Render dynamically created dropdowns */}
          {renderDynamicDropdowns()}
        </div>

        <div className="popup-footer">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCnacel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SegmentPopup;
