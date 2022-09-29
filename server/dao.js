'use strict'

const sqlite= require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('studyPlan.sqlite', (err) => {
    if (err) {
        throw err;
    }
});

//get all courses ordered by name
async function getAllCourses(){
    return new Promise((resolve, reject)=>{
        const sql = `SELECT * FROM courses
                     ORDER BY courses.Name`
        db.all(sql, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows)
            }
        })
    })
}

//get all the incompatibilities
async function getIncompatibleCourses(code){
    return new Promise((resolve, reject)=>{
        const sql= `SELECT incompatible_courses.code_2 AS Code
                    FROM incompatible_courses, courses
                    WHERE incompatible_courses.code_1= courses.Code AND courses.Code=?
                    UNION
                    SELECT incompatible_courses.code_1 AS Code
                    FROM incompatible_courses, courses
                    WHERE incompatible_courses.code_2= courses.Code AND courses.Code=?`
        db.all(sql, [code, code], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                resolve(rows)
            }
        })
    })
}

//get user by email
async function getUserByEmail(email, password){
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name, part_time: row.part_time};
        const salt = row.salt;
        const storedHash = row.hash;
        crypto.scrypt(password, salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), hashedPassword)){
            resolve(false);
          }
          else{
            resolve(user);
          }
        });
      }
    });
  });
};

//get user by id
async function getUserById(id){
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name, part_time: row.part_time};
        resolve(user);
      }
    });
  });
};

// set the enrollment type of a user : 1 if part time, 0 if full time, null if no study plan
async function setEnrollment(id, part_time){
  return new Promise((resolve, reject) =>{
    const sql =  `UPDATE users 
                  SET part_time=?
                  WHERE id=?`
    db.run(sql, [part_time, id], (err, row)=>{
      if (err) { 
        reject(err); 
      }else{
        resolve({status: "Well updated!"});
      }
    })
  })
}

// get all the courses of a user
async function getUserCourses(id){
  return new Promise((resolve, reject)=>{
    const sql= `SELECT c.*
                FROM courses c, user_course uc
                WHERE c.Code=uc.course_code AND uc.user_id=?`
    db.all(sql, [id], (err, rows)=>{
      if(err){
        reject(err);
      }else{
        if(rows.length===0 ){
          resolve(0);
        }else{
          resolve(rows);
        }
      }
    })
  })
}

// delete all the courses of a user
async function deleteUserCourses(id){
  return new Promise((resolve, reject)=>{
    const sql=`DELETE FROM user_course WHERE user_id=?`
    db.run(sql, [id], (err, row)=>{
      if(err){
        reject(err);
      }else{
        resolve({status: "Deleted!"});
      }
    })
  })
}


//update the number of enrolled students
async function updateEnrolledStudents(code, enr){
  return new Promise((resolve, reject)=>{
    const sql=`UPDATE courses
               SET Enrolled_students=?
               WHERE Code=?`

    db.run(sql, [enr, code], (err, row)=>{
      if(err){
        reject(err);
      }else{
        resolve({status: "Updated!"});
      }
    })
  })
}

//inser a course for a certain user
async function insertUserCourse(id, code){
  
  return new Promise((resolve, reject)=>{
    const sql=`INSERT INTO user_course(user_id, course_code)
               VALUES (?, ?)`;
    db.run(sql, [id, code], (err, row)=>{
      if(err){
        reject(err);
      }else{
        resolve({status: "Inserted!"});
      }
    })
  })
}

module.exports= {
    getAllCourses,
    getIncompatibleCourses,
    getUserByEmail, 
    getUserById, 
    setEnrollment,
    getUserCourses,
    deleteUserCourses,
    updateEnrolledStudents,
    insertUserCourse
}