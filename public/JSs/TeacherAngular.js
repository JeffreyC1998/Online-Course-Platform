/*
 *  TeacherAngular.js - Teacher's Pet - CS 476 Project
 *  Purpose: Defines all functionality for Teachers Page
 * 
 *  Author: David Lee
 */
import { auth, db, storage } from './DatabaseConnect.js';

var teacher = angular.module('teacher', ['ui.router']);

//checks if the user is logged in then checks if they have created a class. takes them to class creation if not
auth.onAuthStateChanged(function(user) {
  if(user) {
    var id = user.uid;
    db.collection("Users").where("user_id", "==", id).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        db.collection('Users').doc(doc.id).get().then((doc) => {
          if(doc.get('first_class') != true)
          {
            window.location.href = 'firstclass.html';
          }
        });
        
      })
    });


  }
  else{
    window.location.href = 'index.html';
  }
})



//Factory for the grabbing of uid for all other functions to use.
teacher.factory('CurrentUser',function(){

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

//Factory for Current Class
teacher.factory('CurrentClass',function(){
  var Class = {
    class_id: '0'
  }

  return {
    getClass: function() {
      return Class.class_id;
    },
    setClass: function(cid) {
      Class.class_id = cid;
    }
  }

});



teacher.controller("TeacherView", function($scope, CurrentUser, CurrentClass) {

  $scope.students = [
    {FirstName: 'Double Click', LastName: 'To Update', avatar: 'logo.png', email: '', user_id: '', class_id: "-1"}
  ];
  $scope.await = [];


  //starting varaibles for all data used
  $scope.Activator;
  $scope.classesData = [];
  $scope.classNames = [];
  $scope.Cids = [];
  $scope.enrolledData = [];
  $scope.userData = {FirstName: " ", LastName: " ", avatar: " ", email: " ", class_id: ""};
  $scope.ViewedClass = {class_name: "Now loading...", credentials: " ", class_id: "-1", phone: " "};
  $scope.AttendenceDay = {};
  $scope.awaiting = [];
  $scope.posts = [];
  $scope.cPosts = [];
  $scope.items = [];
  $scope.Days = [];
  $scope.DateList = [];
  var Dayhandler = new Date();
  $scope.CurrentDay = Dayhandler.toDateString();
  $scope.isHidden = true;
  $scope.isHiddenAwait = true;
  $scope.isHiddenAtt = true;
  $scope.isHiddenShow = true;

  $scope.ShowHide = function() {
    $scope.isHidden = $scope.isHidden ? false : true;
  }

  $scope.ShowHideAwait = function() {
    $scope.isHiddenAwait = $scope.isHiddenAwait ? false : true;
  }
  
  $scope.ShowHideAtt = function() {
    $scope.isHiddenAtt = $scope.isHiddenAtt ? false : true;
  }

  $scope.ShowHideShow = function() {
    $scope.isHiddenShow = $scope.isHiddenShow ? false : true;
  }

  //grabs User Id when the asynchronous procedure is done
  $scope.$watch(function() { return CurrentUser.getUser(); }, function(newValue, oldValue) {
    if (newValue !== oldValue) 
    {
      $scope.user_id = newValue;

      db.collection('Users').where("user_id", '==', $scope.user_id).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          $scope.userData.FirstName = doc.get("FirstName");
          $scope.userData.LastName = doc.get("LastName");
          $scope.userData.avatar = doc.get("avatar");
          $scope.userData.email = doc.get("email");
          $scope.userData.firestore_id = doc.id;
        })
      }).then(function() {

        //gets all classes and takes the last one as the current class after userdata is stored to avoid promise issues
        db.collection('Class').where('user_id', '==', $scope.user_id).get().then((snapshot) => {
          snapshot.docs.forEach(doc => {
            $scope.classesData.push({class_name: doc.get("class_name"), credentials: doc.get("credentials"), class_id: doc.get("class_id"), phone: doc.get("phone_number"), firestore_id: doc.id});
            $scope.classNames.push([doc.get("class_name")]);
            $scope.ViewedClass = {class_name: doc.get("class_name"), credentials: doc.get("credentials"), class_id: doc.get("class_id"), phone: doc.get("phone_number"), firestore_id: doc.id};
            $scope.Cids.push(doc.get("class_id"));
            CurrentClass.setClass(doc.get("class_id"))
            $scope.Cids.forEach(function(temp) {
              db.collection('Posts').where('class_id', '==', temp).orderBy('date').limit(10).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                  var Plist = false;
                  $scope.posts.forEach(function(post) {
                    if(post.post_id == doc.id)
                    {
                      Plist = true;
                    };
                  });
                  if(Plist == false){
                    $scope.posts.push({class_id: doc.get('class_id'), date: doc.get('date'), desc: doc.get('desc'), title: doc.get('title'), post_id: doc.id});
                  }
                })
              });
            });
          });
        }).then(function() {
          setTimeout(() => {
            $scope.Cids.forEach(function(temp) {
              db.collection('Enrollment').where('class_id', '==', temp).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                  $scope.enrolledData.push({class_id: doc.get('class_id'), enrolled: doc.get('enrolled'), user_id: doc.get('user_id'), doc_id: doc.id});
                });
              })
            });
          }, 1000);
        }).then(function() {
          setTimeout(() => {
            $scope.enrolledData.forEach(function(enroller) {
              if(enroller.enrolled == true){
                db.collection('Users').where('user_id', '==', enroller.user_id).get().then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                      $scope.urltemp = storage.child(doc.get('avatar'));
                      $scope.urltemp.getDownloadURL().then((url) => {
                        $scope.students.push({FirstName: doc.get('FirstName'), LastName: doc.get('LastName'), avatar: url, email: doc.get('email'),
                        class_id: enroller.class_id, user_id: doc.get("user_id"), firestore_id: doc.id, enrolled_id: enroller.doc_id, attended: 'false'});
                      })
                    })
                })
              }
              else if(enroller.enrolled == false){
                db.collection('Users').where('user_id', '==', enroller.user_id).get().then((snapshot) => {
                  snapshot.docs.forEach(doc => {
                    $scope.urltemp = storage.child(doc.get('avatar'));
                    $scope.urltemp.getDownloadURL().then((url) => {
                      $scope.awaiting.push({FirstName: doc.get('FirstName'), LastName: doc.get('LastName'), avatar: url, email: doc.get('email'),
                      class_id: enroller.class_id, user_id: doc.get("user_id"), firestore_id: doc.id, enrolled_id: enroller.doc_id, attended: 'false'});
                    })
                    $scope.tempFname = doc.get('FirstName');
                    $scope.tempLname = doc.get('LastName');
                  })
                });
              }
            })
          }, 2000);
        }).then(function() {
          $scope.Cids.forEach(function(temp){
            db.collection("inventory").where("class_id", '==', temp).get().then((snapshot) => {
              snapshot.docs.forEach(doc => {
                $scope.items.push({item_name: doc.get("item_name"), class_id: doc.get("class_id"), item_id: doc.get("item_id"), amount: doc.get("amount"), firestore_id: doc.id});
              })
            })
          })
        }).then(function() {
          setTimeout(() => {
            $scope.Cids.forEach(function(temp){
              db.collection('Attendance').where('class_id', '==', temp).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                  var a_id = doc.id;
                  $scope.students.forEach(function(student) {
                    var exists = false;
                    $scope.Days.forEach(function(attend) {
                      if(attend.a_id == a_id)
                      {
                        exists = true;
                      }
                    })
                    if(student.user_id == doc.get('student_id') && exists == false)
                    {
                      $scope.Days.push({
                        a_id: doc.id,
                        class_id: doc.get('class_id'),
                        date: doc.get('date'),
                        attended: doc.get('attended'),
                        user_id: doc.get('student_id'),
                        FirstName: student.FirstName,
                        LastName: student.LastName
                      });
                      var inList = false;
                      $scope.DateList.forEach(function(date) {
                        if(date.date == doc.get('date') && date.class_id == doc.get('class_id'))
                        {
                          inList = true;
                        };
                      });
                      if(inList == false)
                      {
                        $scope.DateList.push({
                          class_id: doc.get('class_id'),
                          date: doc.get('date')
                        });
                      };
                    };
                  });
                });
              });
            });
          }, 2500);
        })
      });

    }
  });

  //Watcher for updating data. ViewedClass userdata storage, and list of all classes made.

  $scope.$watch(function($scope) { return $scope.ViewedClass }, function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.ViewedClass = newValue;

    }
  }, true);

  $scope.$watch(function($scope) { return $scope.userData}, function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.userData = newValue;
    }
  }, true);

  $scope.$watch(function($scope) { return $scope.classes}, function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.classes = newValue;
    }
  }, true);

  $scope.$watch(function($scope) { return $scope.await}, function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.await = newValue;
    }
  }, true);

  $scope.$watch(function($scope) { return $scope.AttendenceDay }, function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.AttendenceDay = newValue;
    }
  }, true);

  $scope.$watch(function($scope) { return $scope.Days }, function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.Days = newValue;
    }
  }, true);

//------------------------------------------User data changes------------------------------------

  $scope.Edit = function() {
    var email_v = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

    var verification = true;

    if ($scope.userData.email==null || $scope.userData.email =="" || email_v.test($scope.userData.email) == false)
    {
        verification = false;
    }
    if(verification == false)
    {
      alert('Email is not a valid form')
    }

    var phone_v = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

    if($scope.ViewedClass.phone != null || $scope.ViewedClass.phone !='')
    {
        if(phone_v.test($scope.ViewedClass.phone) == false)
        {
            verification = false;
        }
    }
    if(verification == false)
    {
      alert('Phone Number is not valid')
    }

    if(verification == true)
    {
      var user = auth.currentUser;
      user.updateEmail($scope.userData.email);
      db.collection('Users').doc($scope.userData.firestore_id).update({
        email: $scope.userData.email
      });

      db.collection('Class').doc($scope.ViewedClass.firestore_id).update({
        phone_number: $scope.ViewedClass.phone,
        credentials: $scope.ViewedClass.credentials
      })
    }
  }




  //----------------------------------------------Post submission---------------------------
  const form = document.querySelector('#postForm');

  $scope.Post = function() {
    var t0 = performance.now()
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      var title = form.title.value;
      var desc = form.post.value;
      var id = $scope.ViewedClass.class_id;
      var holder = new Date();
      var date = holder.toDateString();
      var name = $scope.ViewedClass.class_name;
      var verification = true;
      
      if (title==null || title=="")
      {
          verification = false;
          console.log("title error");
      }
      if(desc == null || desc =='')
      {
        verification = false;
        console.log("desc error");
      }
      if(id == null || id == "")
      {
        verification = false;
        console.log("id error");
      }
      if(date == null || date == "")
      {
        verification = false;
        console.log("date error");
      }
      if(name == null || name == "")
      {
        verification = false;
        console.log("name error");
      }
      if (verification == false)
      {
          e.preventDefault();
      }
      if (verification == true)
      { 

        $scope.posts.push({          
          class_name: name,
          class_id: id,
          date: date,
          title: title,
          desc: desc
        });

        db.collection('Posts').add({
          class_name: name,
          class_id: id,
          date: date,
          title: title,
          desc: desc
        }).then(function() {
          document.getElementById("title").value = ""
          document.getElementById("post").value = ""
          alert("Post created successfully");
        })
      }


    });
    var t1 = performance.now()
    console.log("Call to create post took " + (t1 - t0) + " milliseconds.")
  }
//----------------------------------------expelling students-----------------
$scope.expel=function(student){

  db.collection('Enrollment').doc(student.enrolled_id).delete();
  var index = $scope.students.indexOf(student);
  $scope.students.splice(index,1);  
}


//----------------------------------------inventory related functions--------------------
  $scope.Add = function(){
    $scope.items.push({item_name: " ", amount: 0, class_id: $scope.ViewedClass.class_id});
  }

  $scope.remove=function(item){
    if('firestore_id' in item)
    {
      db.collection('inventory').doc(item.firestore_id).delete().then(() => {
      }).catch((error) => {
        console.error(error);
      })
    }
    var index = $scope.items.indexOf(item);
    $scope.items.splice(index,1);    
  }


  $scope.Save = function(){
    var t0 = performance.now()
    var currentID;

    db.collection('inventory').orderBy('item_id').limitToLast(1).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          currentID = doc.data().item_id;
          currentID++;
        })
    }).then(function() {
      $scope.items.forEach(function(item) {
        if('firestore_id' in item || 'item_id' in item)
        {
          db.collection('inventory').doc(item.firestore_id).set({
            item_id: item.item_id,
            class_id: item.class_id,
            item_name: item.item_name,
            amount: item.amount,
          })
        }
        else{
          db.collection('inventory').add({
            item_id: currentID,
            class_id: $scope.ViewedClass.class_id,
            item_name: item.item_name,
            amount: item.amount,
          }).then(function(docRef) {
            item.firestore_id = docRef.id;
          })
          item.item_id = currentID;
          currentID++;
        }
      })
    });
    var t1 = performance.now()
    console.log("Call to save inventory took " + (t1 - t0) + " milliseconds.")
  }


  //------------------------------------------Enrollment functions--------------------------//

  $scope.Accept= function(student){
    db.collection('Enrollment').doc(student.enrolled_id).update({
      enrolled: true
    });

    var index = $scope.awaiting.indexOf(student);
    $scope.awaiting.splice(index,1);

    $scope.students.push(student);

  }

  $scope.reject= function(student){
    db.collection('Enrollment').doc(student.enrolled_id).delete()
    {

    }

    var index = $scope.awaiting.indexOf(student);
    $scope.awaiting.splice(index,1);

  }

  //--------------------------------------------Attendance work-----------------------------

  $scope.Mark = function(){
    var t0 = performance.now()
    db.collection('Attendance').where("class_id", '==', $scope.ViewedClass.class_id).where('date', '==', $scope.CurrentDay).get().then((snapshot) => {
        if(snapshot.empty) {
          $scope.array = $scope.students.filter(function(e) {
            if(e.class_id == $scope.ViewedClass.class_id)
            {
              return true;
            }
            else
            {
              return false;
            }
          });
          $scope.array.forEach(function(object){
            var date = $scope.CurrentDay;
            var class_id = object.class_id;
            var student_id = object.user_id;
            var attended = object.attended;
            db.collection('Attendance').add({
              date: date,
              class_id: class_id,
              student_id: student_id,
              attended: attended
            });
          });
        }    
        else{
          $scope.array = $scope.students.filter(function(e) {
            if(e.class_id == $scope.ViewedClass.class_id)
            {
              return true;
            }
            else
            {
              return false;
            }
          });
          snapshot.docs.forEach((doc) => {
            $scope.array.forEach(function(object){
              var date = $scope.CurrentDay;
              var class_id = object.class_id;
              var student_id = object.user_id;
              var attended = object.attended;
              if(doc.get('student_id') == object.user_id)
              {
                db.collection('Attendance').doc(doc.id).set({
                  date: date,
                  class_id: class_id,
                  student_id: student_id,
                  attended: attended
                });
              }
            });
          })
        }
    })
    var t1 = performance.now()
    console.log("Call to take attendance took " + (t1 - t0) + " milliseconds.")
  }
});


//--------------------------------------------Student info toggle control-----------------

var acc = document.getElementsByClassName("StudentBtn");
var i;

for (i = 0; i< acc.length; i++) {
  acc[i].onclick = function(){
    this.classList.toggle("active");
    this.nextElementSibling.classList.toggle("show");
  }
}
