import CourseDescription from "./CourseDescription";
import { IoIosAddCircleOutline } from 'react-icons/io'

// row of the table of all available courses
function CourseRow(props) {
    return (
        !props.loggedIn ?
            <tr>
                <td>{props.course.Code}</td>
                <td>{props.course.Name}</td>
                <td>{props.course.Credits}</td>
                <td>{props.course.Enrolled_students}</td> 
                <td>{props.course.Max_students!== null ? props.course.Max_students : 'No limits'}</td> 
                <td><CourseDescription key={props.course.Code} course= {props.course} /></td>
            </tr>
            :
            props.partTime=== null ?
                <tr>
                    <td>{props.course.Code}</td>
                    <td>{props.course.Name}</td>
                    <td>{props.course.Credits}</td>
                    <td>{props.course.Enrolled_students}</td> 
                    <td>{props.course.Max_students!== null ? props.course.Max_students : 'No limits'}</td> 
                    <td><CourseDescription key={props.course.Code} course= {props.course} /></td>
                </tr>
                :
                <tr>
                    <td>{props.course.Code}</td>
                    <td className={props.checkCourseCanBeAdded(props.course) ? "text-dark" : "text-danger"}>{props.course.Name}</td>
                    <td>{props.course.Credits}</td>
                    <td>{props.course.Enrolled_students}</td> 
                    <td>{props.course.Max_students!== null ? props.course.Max_students : 'No limits'}</td> 
                    <td><CourseDescription key={props.course.Code} course= {props.course} /></td>
                    <td> 
                        <button className="btn btn-outline-success" onClick={() => {props.addPersonalLocalCourse(props.course);}}> 
                            <IoIosAddCircleOutline/>
                        </button>
                    </td>
                </tr>
    );
}

export default CourseRow;