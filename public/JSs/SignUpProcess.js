/*
 *  SignUpProcess.js - Teacher's Pet - CS 476 Project
 *  Purpose: Defines Angular functionality for SignUp
 * 
 *  Author: Junhao Zheng
 */
var app = angular.module('myApp', []);

app.controller('processCtrl', function($scope, $window) {
    $scope.AlertMessage = function(option) {
        alert("Sign up successfully \nYou are a " + option + '\n' + "You will be redirected to your home page");
        setTimeout(function(){
            if(option == 'teacher')
            {
                window.location.href = 'TeacherView.html';
            }
            else if(option == 'student')
            {
                window.location.href = 'Student.html';
            }
            else
            {
                window.location.href = 'index.html';
            }

        }, 500);
        
    };
});