import { RiDeleteBin2Line } from 'react-icons/ri'

function PersonalCourseRow(props) {
   
    return (
        <tr>
            <td>{props.pCourse.Code}</td>
            <td className={props.checkCourseCanBeDeleted(props.pCourse.Code) ? "text-dark" : "text-danger"}>{props.pCourse.Name}</td>
            <td>{props.pCourse.Credits}</td>
            <td> 
                <button className="btn btn-outline-danger" onClick={() => {props.deletePersonalLocalCourse(props.pCourse.Code)}}> 
                    <RiDeleteBin2Line/>
                </button>&nbsp;
            </td>
        </tr>
    );
}

export default PersonalCourseRow;