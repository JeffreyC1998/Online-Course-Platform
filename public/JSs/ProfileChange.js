/*
 *  ProfileChange.js - Teacher's Pet - CS 476 Project
 *  Purpose: Reviews change in email and sends to database if legal
 * 
 *  Author: Junhao Zheng
 */
import {auth, db} from "../JSs/DatabaseConnect.js"
import {documenID} from "../JSs/ChangeProcess.js"

const formIn = document.querySelector('#ChangeIn');

var email_v = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
var file;

const fileSelector = document.getElementById('file');
fileSelector.addEventListener('change', (event) => {
    file = event.target.files[0];
})


formIn.addEventListener('submit', (e) => {
    var t0 = performance.now()
    e.preventDefault();
    var email = formIn.email.value;

    var verification = true;

    if (email==null || email =="" || email_v.test(email) == false)
    {
        verification = false;
    }	
        
    if (verification == false)
    {
        e.preventDefault();
    }
    if (verification == true)
    {     
        if (file!=null && file!="")
        {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(file.name);
            fileRef.put(file); 
            
            db.collection('Users').doc(documenID).update({
                avatar: file.name
            }) 
        }

        var user = auth.currentUser;
        console.log(user);
        user.updateEmail(formIn.email.value);
        db.collection('Users').doc(documenID).update({
            email: formIn.email.value
        })
        var t1 = performance.now()
        console.log("Call to change profile took " + (t1 - t0) + " milliseconds.")
        angular.element(document.getElementById('infoProcess')).scope().AlertMessage();
    }

});