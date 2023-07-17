import React, { useState, useEffect } from "react";

const GpaCalculator = () => {
  const [modules, setModules] = useState([]);
  const [gpa, setGPA] = useState(0);

  useEffect(() => {
    const initialModules = [
      { credits: 4, grade: "A" },
      { credits: 5, grade: "B+" },
      // Add more modules as needed
    ];

    setModules(initialModules);
  }, []);

  const calculateGPA = () => {
    let totalCredits = 0;
    let weightedSum = 0;

    modules.forEach((module) => {
      const { credits, grade } = module;
      const gradePoints = calculateGradePoints(grade);

      totalCredits += credits;
      weightedSum += credits * gradePoints;
    });

    const calculatedGPA = weightedSum / totalCredits;
    setGPA(calculatedGPA);
  };

  const calculateGradePoints = (grade) => {
    // Add your grade-to-grade-points conversion logic here
    // Example conversion for a 5-point scale:
    switch (grade) {
      case "A+":
        return 5.0;
      case "A":
        return 5.0;
      case "A-":
        return 4.5;
      case "B+":
        return 4.0;
      case "B":
        return 3.5;
      case "B-":
        return 3.0;
      case "C+":
        return 2.5;
      case "C":
        return 2.0;
      case "D+":
        return 1.5;
      case "D":
        return 1.0;
      case "F":
        return 0.0;
      default:
        return 0.0;
    }
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  return (
    <div>
      {/* Module input fields */}
      {modules.map((module, index) => (
        <div key={index}>
          <input
            type="number"
            value={module.credits}
            onChange={(e) =>
              handleModuleChange(index, "credits", parseInt(e.target.value))
            }
          />
          <input
            type="text"
            value={module.grade}
            onChange={(e) => handleModuleChange(index, "grade", e.target.value)}
          />
        </div>
      ))}

      {/* GPA calculation button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={calculateGPA}>Calculate GPA</button>
      </div>

      {/* Display the calculated GPA */}
      <p>GPA: {gpa}</p>
    </div>
  );
};

export default GpaCalculator;
