/*
 *  SignUpData.js - Teacher's Pet - CS 476 Project
 *  Purpose: Defines rules for SignUp data.
 *           then uploads data to datbase
 * 
 *  Author: Junhao Zheng
 */
import {auth, db} from "../JSs/DatabaseConnect.js"

const form = document.querySelector('#SignUp');


var email_v = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
var name_v = /^[a-z,.'-]+$/i;
var pswd_v = /(?=.*\d)(?=.*[a-zA-Z0-9]).{8}/;
var file;

const fileSelector = document.getElementById('file');
fileSelector.addEventListener('change', (event) => {
    file = event.target.files[0];
})


form.addEventListener('submit', (e) => {
    e.preventDefault();

    var email = form.email.value;
    var fname = form.fname.value;
    var lname = form.lname.value;
    var password = form.password.value;
    var passc = form.pwdr.value;
    var option = form.option.value;
    var verification = true;

    if (email==null || email =="" || email_v.test(email) == false)
    {
        verification = false;
    }	
    
    if (fname==null || fname=="" || name_v.test(fname) == false)
    {
        verification = false;
    }
    if (lname==null || lname=="" || name_v.test(lname) == false)
    {
        verification = false;
    }
    if (password==null || password=="" || pswd_v.test(password) == false)
    {
        verification = false;
    }
    if (password!=passc)
    {
        verification = false;
    }
    if (file==null || file=="")
    {
        verification = false;
    }
    if(option==null || option=="") 
    {
        verification = false;
    }
        
    if (verification == false)
    {
        e.preventDefault();
    }
    if (verification == true)
    {     
        e.preventDefault();
        
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(file.name);
        fileRef.put(file);

        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
            auth.createUserWithEmailAndPassword(form.email.value, form.password.value).then(cred => {
                db.collection('Users').add({
                    user_id: cred.user.uid,
                    FirstName: form.fname.value,
                    LastName: form.lname.value,
                    email: form.email.value,
                    password: form.password.value,
                    avatar: file.name,
                    option: form.option.value,
                    first_class: false
                }) 
                angular.element(document.getElementById('dataProcess')).scope().AlertMessage(option);
            });
        });
    }
});