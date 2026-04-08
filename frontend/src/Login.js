import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Login () {

    const [password, setPasswordValue] = useState("");
    const [userId, setUserIdValue] = useState("");

    const setPassword = (e) => {
        setPasswordValue(e.target.value);
    }

    const setUserId = (e) => {
        setUserIdValue(e.target.value);
    }

    const handleSubmit = async (e) => {
        //prevent default
        e.preventDefault();

        //api call
        console.log("this is our data "+ userId +"   "+ password )
        
        //create an object with userId and password for passing the api
        const data = {
            "userId": userId,
            "password": password
        }

        try{
            const response = await axios.post("http://localhost:8082/loginUser", data);

            console.log("this is the response " + response.data);
            if(!response.data) {
                alert("Invalid User Id or Password");
            }
            else {
                alert("Login Successfull");

            }
            
        } catch(error) {
            console.error(error);
        }




    }

    return (
        <><h1> this is login page</h1>
        <div className="container">
           <form onSubmit={handleSubmit}>

            <label>User ID:</label>
            <input type="email" placeholder="Enter your user id" value={userId} onChange={setUserId}/>
            <br></br>
            <br></br>
            <label>Password:</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={setPassword}/>
            <br></br>
            <br></br>

            <Link to="/register">don't have an account</Link>
            <button type="submit">Login</button>
           </form>

        </div></>
    )
}

export default Login;