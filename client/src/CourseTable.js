import { useState } from "react";
import { Table, Form, Button, Col, Row } from "react-bootstrap";
import CourseForm from "./CourseForm";
import CourseRow from "./CourseRow";
import PersonalCourseRow from "./PersonalCourseRow";

function CourseTable(props){

    const [enrollmentString, setEnrollmentString]= useState("");
   
    const handleClick= (event) =>{
        props.setEnrollment(enrollmentString);
    }
    
    return (
        !props.loggedIn ?
        <>  
            <h2>Available courses</h2>
            <Table striped={true} bordered={false} hover={true} >
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th>Enrolled Students</th>
                        <th>Maximum students</th>
                        <th>Other Informations</th>
                    </tr>
                </thead>
                <tbody>
                    {props.courses.map((course) => (<CourseRow  key={course.Code} course={course} loggedIn={props.loggedIn} />))}
                </tbody>
            </Table>
        </> 
        :
        <>
            <h2>Available courses</h2>
            {
                props.partTime=== null ?
                <>
                    <Form className="pb-3 mb-3" /*</>onSubmit={handleSubmit}*/>
                        <Form.Group >
                            <Row>
                                <Col>
                                    <Form.Label className="fw-bold ">Choose an enrollment type:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Select className="lg" onChange={ev=>{setEnrollmentString(ev.target.value)}}>
                                        <option value=""></option>
                                        <option value="part">Part Time</option>
                                        <option value="full">Full Time</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    {
                                        enrollmentString=== '' ?
                                        <Button className="btn btn-dark" disabled= {true}>Select</Button> :
                                        <Button className="btn btn-dark" onClick={handleClick} type="submit">Select</Button>
                                    }
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form> 
                    <Table striped={true} bordered={false} hover={true} >
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Credits</th>
                                <th>Enrolled Students</th>
                                <th>Maximum students</th>
                                <th>Other Informations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.courses.map((course) => (<CourseRow  key={course.Code} course={course} loggedIn={props.loggedIn} partTime={props.partTime} />))}
                        </tbody>
                    </Table>
                </>
                :
                <>
                    <Table striped={true} bordered={false} hover={true} >
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Credits</th>
                                <th>Enrolled Students</th>
                                <th>Maximum students</th>
                                <th>Other Informations</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.courses.map((course) => (<CourseRow  key={course.Code} course={course} loggedIn={props.loggedIn} addPersonalLocalCourse={props.addPersonalLocalCourse}  checkCourseCanBeAdded={props.checkCourseCanBeAdded} />))}
                        </tbody>
                    </Table>
                    <h2>Personal Study Plan</h2>
                    {
                        props.partTime===1 ?
                        <>
                            <h3>Part Time Student</h3>
                            <h4>Minimum credits: 20</h4>
                            <h4>Current credits: {props.coursesCreditsSum}</h4>
                            <h4>Maximum credits: 40</h4>
                        </> 
                        :
                        <>
                            <h3>Full Time Student</h3>
                            <h4>Minimum credits: 60</h4>
                            <h4>Current credits: {props.coursesCreditsSum}</h4>
                            <h4>Maximum credits: 80</h4>
                        </>
                    }
                    <Table striped={true} bordered={false} hover={true} >
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Credits</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.personalLocalCourses.map((pCourse) => (<PersonalCourseRow  key={pCourse.Code} pCourse={pCourse} deletePersonalLocalCourse={props.deletePersonalLocalCourse} checkCourseCanBeDeleted={props.checkCourseCanBeDeleted}/>))}
                        </tbody>
                    </Table>
                    <CourseForm deleteAllPersonalLocalCourses={props.deleteAllPersonalLocalCourses} deleteAllPersonalDBCourses={props.deleteAllPersonalDBCourses} addAllPersonalLocalCourses={props.addAllPersonalLocalCourses} partTimeDB={props.partTimeDB}/>
                </>
            }
        </> 
    )
}

export default CourseTable;