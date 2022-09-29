const APIURL= 'http://localhost:3001/api/v1';

//login
async function apiLogin (credentials) {
    const response = await fetch(APIURL + '/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};

//user info
async function apiGetUserInfo() {
    const response = await fetch(APIURL + '/user/me', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;  // an object with the error coming from the server
    }
};

//logout
async function apiLogOut() {
    const response = await fetch(APIURL + '/user/logout', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

//all courses with ALL informations
async function apiGetAllCourses(){
    const url= APIURL + '/courses';
    try{
        const response = await fetch(url);
        if(response.ok){
            const list= await response.json();
            return list;
        }else{
            //application error
            const text = await response.text();
            throw new TypeError(text);
        }
    }catch(ex){
        //network error
        throw ex;
    }
}

//set the enrollment type
async function apiSetEnrollment(enrollment){
    const url= APIURL + '/user/me/enrollment';
    let data = { part_time: enrollment }   
    try{
        const response= await fetch(url, {
            method: 'PATCH', 
            mode: 'cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if(!response.ok){
            const errorMessage = await response.text();
            throw new TypeError(errorMessage);
        }
        return;
    }
    catch (exception) {
        throw exception;
    }
}

// get all USER personal courses
async function apiGetUserCourses(){
    const url= APIURL + '/user/me/courses';
    try{
        const response = await fetch(url, {
            credentials: 'include'
        });

        if(!response.ok){
            const errorMessage = await response.text();
            throw new TypeError(errorMessage);
        }else{
            const list= await response.json();
            return list;
        }

    }catch(exception){
        throw exception;
    }
}

// delete USER COURSES and ENROLLMENT type
async function apiDeleteUserCoursesAndEnrollment(){
    const url= APIURL + '/user/me/enrollment';
    try{
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        if(!response.ok){
            const errorMessage = await response.text();
            throw new TypeError(errorMessage);
        }
        return;
    }catch(exception){
        throw exception;
    }
}

//delete USER COURSES
async function apiDeleteUserCourses(){
    const url= APIURL + '/user/me/courses';
    try{
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        if(!response.ok){
            const errorMessage = await response.text();
            throw new TypeError(errorMessage);
        }
        return;
    }catch(exception){
        throw exception;
    }
}

// modify the number of entolled students
async function apiUpdateEnrolledStudents(list){
    const url= APIURL + '/courses';
    let data = { list: list } 
    try{
        const response= await fetch(url, {
            method:'PUT',
            mode: 'cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        })
        if(!response.ok){
            const errorMessage = await response.text();
            throw new TypeError(errorMessage);
        }
        return;
    }catch(exception){
        throw exception;
    }
}

// insert in the db the courses saved by the user
async function apiInsertUserCourses(list){
   const url= APIURL+"/user/me/courses";
   let data = { list: list } 
   try{
        const response= await fetch(url, {
            method:'POST',
            mode: 'cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        })
        if(!response.ok){
            const errorMessage = await response.text();
            throw new TypeError(errorMessage);
        }
        return;
    }catch(exception){
        throw exception;
    }

}

const API = {
    apiGetAllCourses, 
    apiLogin,
    apiGetUserInfo,
    apiLogOut,
    apiSetEnrollment,
    apiGetUserCourses,
    apiDeleteUserCourses,
    apiUpdateEnrolledStudents,
    apiInsertUserCourses,
    apiDeleteUserCoursesAndEnrollment,
};
export default API ;
