import 'bootstrap/dist/css/bootstrap.min.css'
import API from './API';
import {useState, useEffect} from 'react';
import { Row, Container, Spinner } from 'react-bootstrap';
import {BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import CourseTable from './CourseTable';
import './App.css';
import Topbar from './Topbar';
import {LoginForm} from './AuthComponents'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [courses, setCourses]= useState([]); //all courses

  const [loading, setLoading]= useState(true); //to manage the loading

  const [loggedIn, setLoggedIn] = useState(false); //to keep track of whether a user is logged in or not

  const [partTime, setPartTime]= useState(undefined); //to keep track of whether a user is part time, full time or if they does not have chosen a study plan yet

  const [personalLocalCourses, setPersonalLocalCourses]= useState([]); // to have a list of all personal local courses

  const [personalDBCourses, setPersonalDBCourses]= useState([]); // to have a list of all personal courses saved in the database

  const [partTimeDB, setPartTimeDB]= useState(undefined); // to keep track of whether in the database a user is saved as part time, full time or if they does not have chosen a study plan yet  


  //load all available courses
  async function load(){
    const list= await API.apiGetAllCourses();
    setCourses(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  //get user info
  async function checkAuth(){
    await API.apiGetUserInfo(); 
    setLoggedIn(true);
    setLoading(false) ;
  }

  useEffect(() => {
    checkAuth();
  }, []);

  //error message
  function showError(message) {
    toast.error(message, { position: "top-center" }, { toastId: 0 });
  }
  //success message
  function showSuccess(message) {
    toast.success(message, { position: "top-center" }, { toastId: 0 });
  }

  // manage the login
  const handleLogin = async (credentials) => {
    try {
      const user= await API.apiLogin(credentials);

      setLoggedIn(true);
     
      setLoading(true);
      const list= await API.apiGetUserCourses();
      
      setPersonalLocalCourses(list);
      setPersonalDBCourses(list);
      checkAuth();
      showSuccess(`Welcome, ${user.name}!`);

      setPartTimeDB(user.part_time);
      setPartTime(user.part_time);

    } catch (err) {
      showError(err);
    }
  };

  //manage the logout
  const handleLogout = async () => {
    
    await API.apiLogOut();
    setLoggedIn(false);
    setPersonalLocalCourses([]);
    showSuccess("Successful logout")
  };

  //set the enrollment in local (not saved in the db)
  const setEnrollment = (enrollment) => {
    try {
      let enr= -1;
      if(enrollment==="part"){
        enr=1;
      }else if(enrollment==="full"){
        enr=0;
      }
      setPartTime(enr);
    }
    catch (e) {
      showError(e.message);
      throw (e);
    }
  }

  // control all the constraints (used to change the color of a course that cannot be added to the personal study plan)
  const checkCourseCanBeAdded = (course)=>{
    let result= false;
    let pre= course.Preparatory_course;
    let inc= course.Incompatible_courses;
    let max= course.Max_students;
    let enr= course.Enrolled_students;
    let ok1= true;
    let ok2= false;
    let ok3= true;
    let ok4= true;
    let incList=[];
    if(pre=== null){
      ok2= true;
    }else{
      pre= pre.trim()
    }
    if(inc!==''){
      incList= inc.split(", ");
    }
    if(!isNaN(max)){
      if(max=== enr){
        ok1= false;
      }
    }
    personalLocalCourses.forEach( c => {
        if(c.Code=== course.Code){
          ok3= false;
        }
        if(incList!==[]){
          for(let i=0; i< incList.length; i++){
            if(c.Code=== incList[i]){
              ok4= false;
            }
          }
        }
        if(ok2!== true){
          if(c.Code=== pre){
            ok2= true;
          }
        }
      }
    )
    if(ok1 && ok2 && ok3 && ok4){
      result= true;
    }
    return result;
  }


  //add a course in the personal local list of courses, only if it respects the constraints, else error message
  const addPersonalLocalCourse = (course) =>{
    let pre= course.Preparatory_course;
    let inc= course.Incompatible_courses;
    let max= course.Max_students;
    let enr= course.Enrolled_students;
    let ok1= true;
    let ok2= false;
    let ok3= true;
    let ok4= true;
    let incList=[];
    if(pre=== null){
      ok2= true;
    }else{
      pre= pre.trim();
    }
    if(inc!==''){
      incList= inc.split(", ");
    }
    if(!isNaN(max)){
      if(max=== enr){
        ok1= false;
        showError("Maximum number of enrolled students reached!");
      }
    }
    personalLocalCourses.forEach( c => {
        if(c.Code=== course.Code){
          ok3= false;
          showError("This course is already in your personal list!");
        }
        if(incList!==[]){
          for(let i=0; i< incList.length; i++){
            if(c.Code=== incList[i]){
              ok4= false;
              showError("This course is not compatible to others of your list!");
            }
          }
        }
        if(ok2!== true){
          if(c.Code=== pre){
            ok2= true;
          }
        }
      }
    )
    if(ok2===false){
      showError("This course can be added only after its preparatory course!");
    }
    if(ok1=== true && ok2=== true && ok3=== true && ok4=== true){
      setPersonalLocalCourses((oldCourses)=>[...oldCourses, course]);
    }
  }

  // control if a course is preparatory for another (used to change the color of a course that cannot be deleted from the personal study plan)
  const checkCourseCanBeDeleted = (code) =>{
    let result= true;
    personalLocalCourses.forEach(c => {
      if(c.Preparatory_course=== code){
        result= false;
      }
    })
    return result;
  }

  //delete a course from the personal local list of courses, only if possible, else error message
  const deletePersonalLocalCourse= (code)=>{
      let ok= true;
      personalLocalCourses.forEach(c => {
        if(c.Preparatory_course=== code){
          ok= false;
          showError("This course cannot be deleted because it is preparatory for another course!");
        }
      })
      if(ok){
        setPersonalLocalCourses((oldCourses)=>(oldCourses.filter((c)=>(c.Code!== code))));
      } 
  }

  //used for the 'RESTORE' button
  const deleteAllPersonalLocalCourses= ()=>{
    setPartTime(partTimeDB);
    setPersonalLocalCourses(personalDBCourses);
  }

  //delete definitively the study plan
  const deleteAllPersonalDBCourses = async () => {
    try {
      setLoading(true);
      
      personalDBCourses.forEach(course=>{
        course.Enrolled_students= course.Enrolled_students - 1
      })
      await API.apiUpdateEnrolledStudents(personalDBCourses);
      load();
      setLoading(true);
      await API.apiDeleteUserCoursesAndEnrollment();
      setPersonalDBCourses([]);
      setPersonalLocalCourses([]);
      setPartTime(null);
      setPartTimeDB(null);

      checkAuth();
    }
    catch (e) {
      showError(e.message);
      throw (e);
    }
  }

  //save in the database  the enrollment type and all the courses selected by the user
  const addAllPersonalLocalCourses= async ()=>{
    try{
      if((partTime===1 && (coursesCreditsSum<20 || coursesCreditsSum>40)) || (partTime===0 && (coursesCreditsSum<60 || coursesCreditsSum>80))){
        showError("You must select a number of credits contained in the range!");
      }else{
        
        //set the enrollment type
        setLoading(true);
        setPartTimeDB(partTime);
        await API.apiSetEnrollment(partTime);
        checkAuth();
      
        
        //before, delete all
        setLoading(true)
        personalDBCourses.forEach(course=>{
          course.Enrolled_students= course.Enrolled_students - 1
        })
        await API.apiUpdateEnrolledStudents(personalDBCourses);
        load();
        setLoading(true);
        await API.apiDeleteUserCourses();
        
        //then, add
        setLoading(true);
        personalLocalCourses.forEach(course=>{
          course.Enrolled_students= course.Enrolled_students + 1
        })
        await API.apiUpdateEnrolledStudents(personalLocalCourses);
        load();

        setLoading(true);
        await API.apiInsertUserCourses(personalLocalCourses);
        setPersonalDBCourses(personalLocalCourses);
        checkAuth();
      }
    }catch(e){
      showError(e.message);
      throw (e);
    }
  }

  //to compute the sum of the current credits
  const coursesCreditsSum= personalLocalCourses.reduce((s,c)=>(s+c.Credits),0);

  //if loading see only the spinner
  if(loading){
    return( 
      <Container fluid>
        <Row>
          <Spinner animation="border" variant="dark" className="spin-load" size="lg" />
        </Row>
      </Container>
    );
  }else{
    return(
      <BrowserRouter>
       <ToastContainer />
          <Container fluid>
            <Row>
              <Topbar loggedIn= {loggedIn} logout= {handleLogout}/>
            </Row>
            <Row>
              <Routes>
                <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <LoginForm login={handleLogin}></LoginForm>}></Route>
                <Route path= "/" element={<CourseTable loading= {loading} courses= {courses} loggedIn= {loggedIn} partTime= {partTime} setEnrollment= {setEnrollment} personalLocalCourses={personalLocalCourses} addPersonalLocalCourse={addPersonalLocalCourse} deletePersonalLocalCourse={deletePersonalLocalCourse} coursesCreditsSum={coursesCreditsSum} deleteAllPersonalLocalCourses={deleteAllPersonalLocalCourses} personalDBCourses={personalDBCourses} deleteAllPersonalDBCourses={deleteAllPersonalDBCourses}  addAllPersonalLocalCourses={addAllPersonalLocalCourses}  checkCourseCanBeAdded= {checkCourseCanBeAdded} checkCourseCanBeDeleted={checkCourseCanBeDeleted} partTimeDB={partTimeDB}/>}></Route>
              </Routes>
            </Row>
          </Container>
      </BrowserRouter>
    );
  }
}

export default App;
