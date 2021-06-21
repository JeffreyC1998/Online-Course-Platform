/*
 *  PasswordChange.js - Teacher's Pet - CS 476 Project
 *  Purpose: allows for changing to legal password
 * 
 *  Author: Junhao Zheng
 */

import {auth, db} from "../JSs/DatabaseConnect.js"
import {documenID} from "../JSs/ChangeProcess.js"

const formPa = document.querySelector('#ChangePa');

var pswd_v = /(?=.*\d)(?=.*[a-zA-Z0-9]).{8}/;

formPa.addEventListener('submit', (e) => {
    e.preventDefault();

    var password = formPa.password.value;
    var passc = formPa.pwdr.value;

    var verification = true;

    if (password==null || password=="" || pswd_v.test(password) == false)
    {
        verification = false;
    }
    if (password!=passc)
    {
        verification = false;
    }
        
    if (verification == false)
    {
        e.preventDefault();
    }
    if (verification == true)
    {             
        var user = auth.currentUser;
        console.log(user);
        user.updatePassword(formPa.password.value);
        db.collection('Users').doc(documenID).update({
            password: formPa.password.value
        }) 
        angular.element(document.getElementById('passProcess')).scope().AlertMessageP();
    }
});