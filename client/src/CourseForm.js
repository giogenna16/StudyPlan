import { Button, Form} from "react-bootstrap";

//to manage the user's actions related to their study plan
function CourseForm(props){

    const handleSubmit = (event) => {
        event.preventDefault();
        props.addAllPersonalLocalCourses();
    };

    const handleRestore = (event) =>{
        props.deleteAllPersonalLocalCourses();
    }

    const handleDelete = (event)=>{
        props.deleteAllPersonalDBCourses();
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div class="d-grid gap-2 col-3 mx-auto" align="center">
                <Button className='btn btn-dark btn-lg' type='submit'>Save</Button>
                <Button className='btn btn-secondary' onClick={handleRestore} >Restore</Button> &nbsp;
            </div>
            {
                props.partTimeDB=== null ?
                <div className="d-grid gap-4 pb-3 mb-3 ">
                    <Button variant="danger" size="lg" disabled={true}>Delete Definitely!</Button>
                </div> 
                :
                <div className="d-grid gap-4 pb-3 mb-3 ">
                    <Button variant="danger" size="lg" onClick={handleDelete}>Delete Definitely!</Button>
                </div> 

            }
            
            
        </Form>
    )

}

export default CourseForm;