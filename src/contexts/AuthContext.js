import React, { useState, useContext, useEffect } from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

export default function useAuth() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
    console.log(user)
  });

  //gmail is enabled will have to figure that outt
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
    } catch (err) {
      console.err(err.message);
    }
  };

  const googleLogin = async () =>{
    try{
      const user = await signInWithPopup(auth, new GoogleAuthProvider())
      .then((result)=>{
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("credential:" + credential)
        const token = credential.accessToken
        console.log("token:" + credential.accessToken)
        const user = result.user
        console.log("user:" + result.user)
      })
    } catch (err){
      console.log(err.message)
    }
  }

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log("Welcome" + user);
    } catch (err) {
      console.err(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <div>
        <h3>Register User</h3>
        <input
        type="email"
          placeholder="Enter your email"
          onChange={(e) => {
            setRegisterEmail(e.target.value);
          }}
        />

        <input
          type="password"
          placeholder="Create a password"
          onChange={(e) => {
            setRegisterPassword(e.target.value);
          }}
        />
        <button onClick={register}> Create User</button>
      </div>
      <div>
        <h3></h3>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => {
            setLoginEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
        />
        <button onClick={login}>Login</button>
      </div>
      <h4>User Logged In</h4>
      {user?.email}
      <button onClick={logout}>Sign Out</button>
      <button onClick={googleLogin}> Sign in with Google </button>

    </>
  );
}
