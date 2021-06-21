/*
 *  firstclass.js - Teacher's Pet - CS 476 Project
 *  Purpose: check for any ilegal data before sending to database
 * 
 *  Author: David Lee
 */
import {auth, db} from "../JSs/DatabaseConnect.js"

const form = document.querySelector('#firstClassData');

auth.onAuthStateChanged(user => {
    if(user) {
        var id = user.uid;
        var phone_v = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

        var currentID;
        db.collection('Class').orderBy('class_id').limitToLast(1).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              currentID = doc.data().class_id;
              currentID++;
            })
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            var className = form.Cname.value;
            var phone = form.Pnum.value;
            var credentials = form.credent.value;
            var verification = true;

            
            if (className==null || className=="")
            {
                verification = false;
            }
            if(phone != null || phone !='')
            {
                if(phone_v.test(phone) == false)
                {
                    verification = false;
                }
            }
            if(credentials == null || credentials=='')
            {
                credentials= " ";
            }
            if (verification == false)
            {
                e.preventDefault();
            }
            if (verification == true)
            {     
                e.preventDefault();

                console.log(currentID);


                db.collection("Users").where("user_id", "==", user.uid).get().then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        db.collection('Users').doc(doc.id).update({
                            first_class: true
                        });
                    })
                }).then(
                    db.collection('Class').add({
                        user_id: id,
                        class_name: form.Cname.value,
                        class_id: currentID,
                        phone_number: form.Pnum.value,
                        credentials: form.credent.value
                    }).then(
                            setTimeout(function(){
                                window.location.href = 'TeacherView.html'
                            }, 500)
                        )
                );
            } 
        });
    }

    else{
        window.location.href = 'index.html';
      }
});
