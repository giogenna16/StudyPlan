'use strict';

const PORT = 3001;
const PREFIX= '/api/v1';

const dao = require('./dao');

const express = require('express');

const app = express();

const morgan= require('morgan');
const cors= require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

app.use(morgan('common'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    secret:'a random secret string',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.authenticate('session'))


passport.use(new LocalStrategy( function verify (email, password, callback) {
    dao.getUserByEmail(email, password).then((result)=>{
        if(result!=undefined){
            return callback(null, result);
        }
        return callback(null, false, {message:'Wrong email or password'});
    })
}))

passport.serializeUser((user, cb)=>{
    cb(null, {id:user.id, email:user.email, name:user.name, part_time:user.part_time});
})

passport.deserializeUser((user, cb)=>{
    return cb(null, user);
})


const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({message:"Not authenticated"});
}

app.post(PREFIX+'/user/login', passport.authenticate('local'), async (req, res) => { 
    res.status(200).json({id:req.user.id, name:req.user.name, part_time:req.user.part_time});
});

app.get(PREFIX+'/user/me', isLoggedIn, async (req, res) => { 
    res.status(200).json(req.user);
});

app.delete(PREFIX+'/user/logout', async (req, res)=>{
    req.logout(()=>{
        res.status(200).end();
    })
})

//CREDENTIALS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//1, "genna@webapp.com", "password", "Giovanni"
//2, "student@polytechnic.it", "turin", "John"
//3, "user@github.uk", "hello", "July"
//4, "franco@slack.it", "swiss", "Franco"
//5, "install@start.npm", "modules", "Dalila"


//GET /courses
app.get(PREFIX+'/courses', async (req, res)=>{
    let listOfCourses= [];
    await dao.getAllCourses().then(
        (value)=>{
            for(let i=0; i< value.length; i++){
                listOfCourses.push(value[i]);
            }
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    )
    let courseIncompatibleCourses= new Map();
    for (let i=0; i< listOfCourses.length; i++){
        courseIncompatibleCourses.set(listOfCourses[i].Code, '');
        await dao.getIncompatibleCourses(listOfCourses[i].Code).then(
            (value)=>{
              let v= courseIncompatibleCourses.get(listOfCourses[i].Code);
              for(let j=0; j<value.length; j++){
                  if(j=== value.length-1){
                    v+=value[j].Code;
                  }else{
                    v+=value[j].Code+", ";
                  }
              } 
              courseIncompatibleCourses.set(listOfCourses[i].Code, v);
            }
        ).catch(
            (err) => {
                res.status(500).json({ error: err });
            }
        )
    }

    let result = [];
    let i=0;
    listOfCourses.forEach(course => {
        course.Incompatible_courses= courseIncompatibleCourses.get(course.Code);
        result[i]= course;
        i++;
    });
    res.status(200).json(result);
});

//PATCH /user/me/enrollment
app.patch(PREFIX+'/user/me/enrollment', isLoggedIn, async (req, res) => {
    await dao.setEnrollment(req.user.id, req.body.part_time).then(
        (value)=>{
            res.status(201).end();
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    )
})

//GET /user/me/courses
app.get(PREFIX+'/user/me/courses', isLoggedIn, async (req, res)=>{
    await dao.getUserCourses(req.user.id).then(
        (value)=>{
            if(value===0){
                res.status(200).json([]);
            }else{
                res.status(200).json(value);
            }
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    )
})

//DELETE /user/me/enrollment
app.delete(PREFIX+'/user/me/enrollment', isLoggedIn, async (req, res)=>{
    let ok = false;
    await dao.deleteUserCourses(req.user.id).then(
        (value)=>{
            ok= true;
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    )
    if(ok){
        await dao.setEnrollment(req.user.id, null).then(
            (value)=>{
                res.status(200).end();
            }
        ).catch(
            (err) => {
                res.status(500).json({ error: err });
            }
        )
    }
})

//DELETE /user/me/courses
app.delete(PREFIX+'/user/me/courses', isLoggedIn, async (req, res)=>{
    
    await dao.deleteUserCourses(req.user.id).then(
        (value)=>{
            res.status(200).end();
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    )
})

app.put(PREFIX+"/courses", isLoggedIn, async (req, res)=>{
    let list=  req.body.list;
    let n=0;
    for(let i = 0; i< list.length; i++){
        await dao.updateEnrolledStudents(list[i].Code, list[i].Enrolled_students).then(
            (value)=>{n++;}
        ).catch(
            (err) => {
                res.status(500).json({ error: err });
            }
        )
    }
   
    if(n===list.length){
        res.status(200).end();
    }
})

app.post(PREFIX+"/user/me/courses", isLoggedIn, async (req, res)=>{
    let list=  req.body.list;
    let n=0;
    for(let i = 0; i< list.length; i++){
        await dao.insertUserCourse(req.user.id, list[i].Code).then(
            (value)=>{n++;}
        ).catch(
            (err) => {
                res.status(500).json({ error: err });
            }
        )
    }
    if(n===list.length){
        res.status(200).end();
    }
})




//RUN server
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));