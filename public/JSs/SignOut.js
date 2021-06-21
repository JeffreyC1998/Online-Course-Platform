/*
 *  SignOut.js - Teacher's Pet - CS 476 Project
 *  Purpose: Logs out user
 * 
 *  Author: David Lee
 */
import { auth } from "./DatabaseConnect.js";

//usable on any page
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("signed out")
        window.location.href = 'index.html';
    })

});