/*
 *  HomeRetrieve.js - Teacher's Pet - CS 476 Project
 *  Purpose: logs the user in if email and password are in authorization database
 * 
 *  Author: Junhao Zheng
 *  Editor: David Lee
 */
import {auth, db} from '../JSs/DatabaseConnect.js';

const form = document.querySelector('#Login');

form.addEventListener('submit', (e) => {
    
    var email = form.uname.value;
    var pw = form.password.value;

    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        auth.signInWithEmailAndPassword(email, pw).then(cred => {
            db.collection("Users").where("user_id", "==", cred.user.uid).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if(doc.data().option == "teacher")
                    {
                        window.location.href = 'TeacherView.html';
                    }
                    else if (doc.data().option = "student")
                    {
                        window.location.href = 'Student.html';
                    }
                    else
                    {
                        alert("failed to login due to option error");
                    }
                })
            })
        }).catch(function(error) {
            document.getElementById("email_msg").innerHTML="email or password is Invalid. \n";
        });
    });
})
