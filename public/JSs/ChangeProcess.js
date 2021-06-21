/*
 *  ChangeProcess.js - Teacher's Pet - CS 476 Project
 *  Purpose: Angular intermediary for changes
 * 
 *  Author: Junhao Zheng
 */
import { auth, db, storage} from './DatabaseConnect.js';
var app = angular.module('myApp', []);

var tempId,tempEmail, documenID, tempURL;
auth.onAuthStateChanged(function(user) {
    if(user) {
      var id = user.uid;
      tempId = id;
      db.collection("Users").where("user_id", "==", id).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          db.collection('Users').doc(doc.id).get().then((doc) => {
            tempEmail = doc.get("email");
            documenID = doc.id;
            var urltemp = storage.child(doc.get('avatar'));
            urltemp.getDownloadURL().then((url) => {
              tempURL = url;
            })
          });
          
        })
      });
    }
    else{
      window.location.href = 'index.html';
    }
})

app.factory('CurrentUser',function(){

    var Current = {
      user_id: "uid"
    }
  
    auth.onAuthStateChanged(function(user) {
        Current.user_id = user.uid;
    })
  
    return {
      getUser: function() {
        return Current.user_id;
      },
      setUser: function(uid) {
        Current.user_id = uid;
      }
    }
  });

app.controller('InfoProcessCtrl', function($scope, $window) {
    setTimeout(function() {
        $scope.$apply(function(){
            $scope.user_id = tempId;
            $scope.current_email = tempEmail;
            $scope.current_avatar = tempURL;
        });
    }, 1200);

    $scope.AlertMessage = function() {
        alert("Information change successfully!!!");
        setTimeout(function(){
            $window.location.href = 'Student.html';
        }, 500);
    };

    $scope.AlertMessageP = function() {
        alert("Password change successfully!!!");
        setTimeout(function(){
            $window.location.href = 'Student.html';
        }, 500);
    };

    $scope.toggle_info = function() {
        $scope.error_info = true;
    }
    $scope.toggle_pass = function() {
        $scope.error_pass = true;
    }
    $scope.submit_info = function() {
        $scope.error_info = false;
    }
    $scope.submit_pass = function() {
        $scope.error_pass = false;
    }
});

export { documenID };