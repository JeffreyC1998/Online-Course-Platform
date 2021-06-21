/*
 *  StudentAngular.js - Teacher's Pet - CS 476 Project
 *  Purpose: Defines all functionality of the Student page
 * 
 *  Author: Junhao Zheng
 */
import { auth, db, storage} from './DatabaseConnect.js';

console.log("Processing");
var student = angular.module('studentApp', []);

var tempFname, tempLname, tempId, tempEmail, tempURL;

//checks if the user is logged in then checks if they have created a class. takes them to class creation if not
auth.onAuthStateChanged(function(user) {
  if(user) {
    var id = user.uid;
    tempId = id;
    db.collection("Users").where("user_id", "==", id).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        db.collection('Users').doc(doc.id).get().then((doc) => {
          tempFname = doc.get("FirstName");
          tempLname = doc.get("LastName");
          tempEmail = doc.get("email");
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

student.factory('CurrentUser',function(){

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

student.controller("StudentSide", function($scope) {

  $scope.students = [
    {FirstName: ' ', LastName: ' ', avatar: ' ', email: '', user_id: '', class_id: "-1"}
  ];
  $scope.userData = {FirstName: "", LastName: "", avatar: "", email: "", uid: ""};
  $scope.userData.classes = [];
  $scope.classesData = [];
  $scope.postData = [];
  $scope.CurrentPostData = [];
  $scope.teacherData = [];
  $scope.currentAvatar = "";
  $scope.CurrentTeacherData = {FirstName: " ", LastName: "", email: " "};

  $scope.HideBlocks = false;
  $scope.ShowClass = false;

  $scope.ViewedClass = {class_name: "---Choose a class---", credentials: " ", class_id: "-1", phone: " "};

  setTimeout(function() {
    $scope.$apply(function(){
      $scope.userData.FirstName = tempFname;
      $scope.userData.LastName = tempLname;
      $scope.userData.uid = tempId;
      $scope.currentAvatar = tempURL;

      var currentClassId, element, currentTeacherId;
      
      db.collection('Enrollment').where('user_id', '==', $scope.userData.uid).get().then((snapshot) => 
      {
        snapshot.docs.forEach(doc => 
        {
          $scope.userData.classes.push(doc.get("class_id"));
          currentClassId = doc.get("class_id");

          db.collection('Class').where('class_id', '==', currentClassId).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              $scope.$apply(function()
              {
                $scope.classesData.push({class_name: doc.get("class_name"), credentials: doc.get("credentials"), class_id: doc.get("class_id"), phone: doc.get("phone_number"), firestore_id: doc.id, teacher_id: doc.get("user_id")});
                currentTeacherId = doc.get("user_id");
              });
              element = document.createElement("span");
              element.innerHTML = doc.get("class_name");  
              element.setAttribute("class", "classBlock");
              document.getElementById("myList").appendChild(element);
            });
          });
          
          db.collection('Posts').where('class_id', '==', currentClassId).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              $scope.$apply(function(){
                $scope.postData.push({class_id: doc.get("class_id"), date: doc.get("date"), desc: doc.get("desc"), title: doc.get("title")})
              });
            });
          });

        })
      });

      setTimeout(function() {
        var c_id;
        var current = 0;
        for(var key in $scope.classesData)
        {
          db.collection('Users').where('user_id', '==', $scope.classesData[key].teacher_id).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              $scope.teacherData.push({teacher_id: $scope.classesData[key].teacher_id, class_id: " ", Fname: doc.get("FirstName"), Lname: doc.get("LastName"), email: doc.get("email")});
            });
          });  
        }
        setTimeout(function() {
          for(var key in $scope.classesData)
          {
            c_id = $scope.classesData[key].class_id;
            $scope.teacherData[current].class_id = c_id;
            current += 1;
          }
        }, 500)
         
      }, 500)

    })
  }, 1500);

  $scope.changeOptions = function() {
    var t0 = performance.now()
    var elementBlocks ,element, elementDesc, elementDate;
    var currentPostCount = 0;
    var currentPostID;
    if ($scope.ViewedClass.class_name != "")
    {
      var currentCID = $scope.ViewedClass.class_id;
      document.getElementById("classTitle").innerHTML = $scope.ViewedClass.class_name;
      $scope.CurrentPostData = [];
      var list = document.getElementById("AllPosts");
      for (var ele = 0; ele <= document.getElementById("AllPosts").childElementCount; ele++)
      {
        list.removeChild(list.childNodes[0]);
      }
      for (var key in $scope.teacherData)
      {
        if (currentCID == $scope.teacherData[key].class_id)
        {
          $scope.CurrentTeacherData = $scope.teacherData[key];
        }
      }
      for (var key in $scope.postData)
      {
        if (currentCID == $scope.postData[key].class_id)
        {
          $scope.CurrentPostData.push($scope.postData[key]);
        }
      }
      for (var key in $scope.CurrentPostData)
      {
        currentPostID = "PostID" + currentPostCount;
        elementBlocks = document.createElement("div");
        elementBlocks.setAttribute("class", "postBlocks");
        elementBlocks.setAttribute("id", currentPostID);
        document.getElementById("AllPosts").appendChild(elementBlocks);

        element = document.createElement("h5");
        elementDesc = document.createElement("div");
        elementDate = document.createElement("p");

        element.innerHTML = $scope.CurrentPostData[key].title;
        elementDesc.innerHTML = $scope.CurrentPostData[key].desc;
        elementDate.innerHTML = $scope.CurrentPostData[key].date;

        document.getElementById(currentPostID).appendChild(element);
        document.getElementById(currentPostID).appendChild(elementDesc);
        document.getElementById(currentPostID).appendChild(elementDate);
        currentPostCount += 1;
      }
      $scope.HideBlocks = true;
      $scope.ShowClass = true;
    }
    else
    {
      $scope.HideBlocks = false;
      $scope.ShowClass = false;
    }
    var t1 = performance.now()
    console.log("Call to choose class took " + (t1 - t0) + " milliseconds.")
    // title.innerHTML += clickValue;
  }

  $scope.searchText = function() {
    var t0 = performance.now()
    var searchData = {class_id: " ", teacher_name: " ", email: " ", phone: " "};
    var idElement, nameElement, emailElement, phoneElement;

    db.collection('Class').where('class_id', '==', Number($scope.SearchClass)).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        searchData.class_id = $scope.SearchClass;
        searchData.phone = doc.get("phone_number");
        var tid = doc.get("user_id");
        db.collection('Users').where('user_id', '==', tid).get().then((snapshot) => {
          snapshot.docs.forEach(doc => {
            searchData.teacher_name = doc.get("FirstName") + doc.get("LastName");
            searchData.email = doc.get("email");
          });
        }); 
      });
    });
    
    var classInfo = document.getElementById("searchInfo");
    while (classInfo.hasChildNodes()) {
      classInfo.removeChild(classInfo.lastChild);
    }

    setTimeout(function() {
      idElement = document.createElement("td");
      nameElement = document.createElement("td");
      emailElement = document.createElement("td");
      phoneElement = document.createElement("td");

      idElement.innerHTML = searchData.class_id;
      nameElement.innerHTML = searchData.teacher_name;
      emailElement.innerHTML = searchData.email;
      phoneElement.innerHTML = searchData.phone;

      if (searchData.class_id != " ")
      {
        document.getElementById("searchInfo").appendChild(idElement);
        document.getElementById("searchInfo").appendChild(nameElement);
        document.getElementById("searchInfo").appendChild(emailElement);
        document.getElementById("searchInfo").appendChild(phoneElement);       
      }     
      idElement.setAttribute("id", "class_id"); 
      var t1 = performance.now()
      console.log("Call to search class took " + (t1 - t0) + " milliseconds.")
    }, 600)

  }

  $scope.apply_class = function() {
    var is_enrolled;
    document.getElementById("enroll_msg").innerHTML = "";
    db.collection('Enrollment').where('class_id', '==', Number(document.getElementById("class_id").innerHTML)).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        console.log(tempId);
        if (doc.get("user_id") == tempId)
        {
          is_enrolled = true;
        }
      });
    })

    setTimeout(function(){
      console.log(is_enrolled);
      if (is_enrolled == true)
      {
        document.getElementById("enroll_msg").innerHTML = "Enroll fail, you have enrolled in this class!!!";
      }
      else
      {
        db.collection('Enrollment').add({
          class_id: Number(document.getElementById("class_id").innerHTML),
          enrolled: false,
          user_id: tempId
        })    
        document.getElementById("enroll_msg").innerHTML = "Enroll success, the teacher will confirm your enrollment soon!!!";   
      }
    }, 900)
  }
});
