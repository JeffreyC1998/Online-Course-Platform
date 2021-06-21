/*
 *  Validate.js - Teacher's Pet - CS 476 Project
 *  Purpose: Defines several forms of validation
 * 
 *  Author: Junhao Zheng
 *  Co-Author: David Lee
 */
function SignUpForm(event){ 
    var elements = event.currentTarget;
    var a = elements[0].value;
    var b = elements[1].value;
    var c = elements[2].value;
    var d = elements[3].value;
	var e = elements[4].value;
	var f = elements[5].value;
	var ext = e.substring(e.lastIndexOf('.') + 1);
	
    var result = true;
    var email_v = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
	var name_v = /^[a-z,.'-]+$/i;
	var pswd_v = /(?=.*\d)(?=.*[a-zA-Z0-9]).{8}/;
	
	
  // initialize email_msg, uname_msg, password_msg and pswdr_msg

    document.getElementById("email_msg").innerHTML ="";
	document.getElementById("fname_msg").innerHTML ="";
	document.getElementById("lname_msg").innerHTML ="";
	document.getElementById("pswd_msg").innerHTML ="";
	document.getElementById("pswdr_msg").innerHTML ="";
	document.getElementById("photo_msg").innerHTML ="";	
	document.getElementById("select_msg").innerHTML ="";
	document.getElementById("email").style.borderColor = "";
	document.getElementById("fname").style.borderColor = "";
	document.getElementById("lname").style.borderColor = "";
	document.getElementById("password").style.borderColor = "";	
	
  
   	// if email is left empty or email format is wrong, error message displays above email field in red color   
	if (a==null || a =="" || email_v.test(a) == false)
	{		
		document.getElementById("email_msg").innerHTML="Email address empty or wrong format. \n";
		document.getElementById("email").style.borderColor = "red";
		result = false;
	}
		
	// add code here to validate firstname
	if (b==null || b=="" || name_v.test(b) == false)
	{  
		document.getElementById("fname_msg").innerHTML="Please enter the correct first name \n";
		document.getElementById("fname").style.borderColor = "red";
	    result = false;
    }
	
	if (c==null || c=="" || name_v.test(c) == false)
	{  
		document.getElementById("lname_msg").innerHTML="Please enter the correct last name \n";
		document.getElementById("lname").style.borderColor = "red";
	    result = false;
    }
	
	//add code here to validate password
	
	if (d==null || d=="" || pswd_v.test(d) == false)
	{
		document.getElementById("pswd_msg").innerHTML="Password should be 8 charcters long and at least one non-letter character \n";
		document.getElementById("password").style.borderColor = "red";
	    result = false;
    }	


	// add code here to confirm password
	
	if (d!=e)
	{
	    document.getElementById("pswdr_msg").innerHTML ="The confirmed password should be the same as the password above \n";
		result = false;
	}

	if (f==null || f=="")
	{
		document.getElementById("photo_msg").innerHTML="Please select a image \n";
		result = false;
	}	
	if(document.getElementById('student').checked == false && document.getElementById('teacher').checked == false) 
	{
		document.getElementById("select_msg").innerHTML="Please select an option \n";
		result = false;
	}
	
	if(result == false )
    {    
        event.preventDefault();
    }														
}

function SignUpResetForm(event)
{
    document.getElementById("email_msg").innerHTML ="";
    document.getElementById("fname_msg").innerHTML ="";
	document.getElementById("lname_msg").innerHTML ="";
    document.getElementById("pswd_msg").innerHTML ="";
    document.getElementById("pswdr_msg").innerHTML ="";
	document.getElementById("photo_msg").innerHTML ="";
	document.getElementById("select_msg").innerHTML ="";
	document.getElementById("email").style.borderColor = "";
	document.getElementById("fname").style.borderColor = "";
	document.getElementById("lname").style.borderColor = "";
	document.getElementById("password").style.borderColor = "";
}

function LoginForm(event){ 

    var elements = event.currentTarget;
    var a = elements[0].value;
    var b = elements[1].value;
 
    var result = true;    

    var email_v = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var pswd_v = /(?=.*\d)(?=.*[a-zA-Z0-9]).{8}/;
   
    document.getElementById("email_msg").innerHTML = "";
    document.getElementById("pswd_msg").innerHTML = "";

    if (a==null || a==""|| uid_v.test(a) == false)
    {	   
		document.getElementById("email_msg").innerHTML="Please enter a valid email. \n";
        result = false;
    }
	
    if (b==null || b=="" || pswd_v.test(b) == false)
    {
        document.getElementById("pswd_msg").innerHTML="Please enter the correct password. \n";
        result = false;
	}

	if (result==false)
	{
		event.preventDefault();
	}
}

function Classform(event){ 
    var elements = event.currentTarget;
    var a = elements[0].value;
    var b = elements[1].value;

    var result = true;
	var phone_v = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
	var Cred = elements[2].value;
	var Phone = elements[1].value;

	
  // initialize email_msg, uname_msg, password_msg and pswdr_msg

    document.getElementById("class_msg").innerHTML ="";
	document.getElementById("phone_msg").innerHTML ="";

	
  
   	// if email is left empty or email format is wrong, error message displays above email field in red color   
	if (a==null || a =="")
	{		
		document.getElementById("class_msg").innerHTML="Please name your class\n";
		document.getElementById("Cname").style.borderColor = "red";
		result = false;
	}
		
	if (b !=null || b !="")
	{  
		if(phone_v.test(b) == false)
		{
			document.getElementById("phone_msg").innerHTML="Phone number must be in the form XXX-XXX-XXXX \n";
			document.getElementById("Pnum").style.borderColor = "red";
			result = false;
		}

    }
	if(b ==null || b == "")
	{
		Phone = " X";
	}

	if(Cred == null || Cred == "")
	{
		Cred = " ";
	}


	if(result == false )
    {    
        event.preventDefault();
    }														
}

function ClassResetForm(event)
{
    document.getElementById("class_msg").innerHTML ="";
    document.getElementById("phone_msg").innerHTML ="";
	document.getElementById("Pnum").style.borderColor = "none";


}

function EditInformationForm(event){
	var elements = event.currentTarget;
    var a = elements[1].value;

	var result = true;
    var email_v = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

	if (a==null || a =="" || email_v.test(a) == false)
	{		
		document.getElementById("email_msg").innerHTML="Email address empty or wrong format. \n";
		result = false;
	}
	if(result == false )
    {    
        event.preventDefault();
    }	
}

function ChangePasswordForm(event){
	var elements = event.currentTarget;
    var a = elements[0].value;
    var b = elements[1].value;
	
	var result = true;
	var pswd_v = /(?=.*\d)(?=.*[a-zA-Z0-9]).{8}/;

	if (a==null || a=="" || pswd_v.test(a) == false)
	{
		document.getElementById("pswd_msg").innerHTML="Password should be 8 charcters long and at least one non-letter character \n";
	    result = false;
    }	
	if (a!=b)
	{
	    document.getElementById("pswdr_msg").innerHTML ="The confirmed password should be the same as the password above \n";
		result = false;
	}
	if(result == false )
    {    
        event.preventDefault();
    }	
}
