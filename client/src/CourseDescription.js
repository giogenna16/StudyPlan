import { Button, Collapse } from "react-bootstrap";
import { useState } from 'react';

//to create a collapse for the preparatory course and the incompatible courses
function CourseDescription(props) {
    
    const [open, setOpen] = useState(false);
    let ac= "collapse"+props.course.Code
    return (
      <>
        <Button variant="outline-secondary"
          onClick={() => setOpen(!open)}
          aria-controls={ac}
          aria-expanded={open}
        >
          Other informations
        </Button>
        <Collapse in={open}>
          <div id={ac}>
            <ul>
                <li>Preparatory course: { props.course.Preparatory_course !== null ? props.course.Preparatory_course : "No"}</li>
                <li>Incompatible courses: {props.course.Incompatible_courses !== '' ? props.course.Incompatible_courses : "No"}</li>
            </ul> 
          </div>
        </Collapse>
      </>
    );
}
  
  //render(<ExamDescription />);

export default CourseDescription;