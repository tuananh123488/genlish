// Import the functions you need from the SDKs you need
import { TypeHTTP, api } from "@/utils/api";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// const firebaseConfig = {
//     apiKey: "AIzaSyChvmqLd33FWUcCWK4Rtos-ZP1U16_Q3Ko",
//     authDomain: "genlish-b8da2.firebaseapp.com",
//     projectId: "genlish-b8da2",
//     storageBucket: "genlish-b8da2.appspot.com",
//     messagingSenderId: "775866118203",
//     appId: "1:775866118203:web:7ba9a2c2a0bdf5ee1cac1e",
//     measurementId: "G-KW0XQS2J58"
// };

// const firebaseConfig = {
//     apiKey: "AIzaSyC30TN_4w_Mlza2Ai8VpqLzaFF2L5vUrtI",
//     authDomain: "genlish-82212.firebaseapp.com",
//     projectId: "genlish-82212",
//     storageBucket: "genlish-82212.appspot.com",
//     messagingSenderId: "321536514856",
//     appId: "1:321536514856:web:632ef6d48e206360dc8e1d",
//     measurementId: "G-73H5E8VCEV"
// };

// const firebaseConfig = {
//     apiKey: "AIzaSyBDEELUjcxImDDzFCnBgj8aWQNMSo2wW7U",
//     authDomain: "genlish-a9054.firebaseapp.com",
//     projectId: "genlish-a9054",
//     storageBucket: "genlish-a9054.appspot.com",
//     messagingSenderId: "423036501386",
//     appId: "1:423036501386:web:e9efeb29ee2bd26cc45c73",
//     measurementId: "G-S9J2E3H96N"
// };

// const firebaseConfig = {
//     apiKey: "AIzaSyDROVWxMdW3k4GytVEZEZZbXoJKGstLFlU",
//     authDomain: "healthhaven-ba506.firebaseapp.com",
//     projectId: "healthhaven-ba506",
//     storageBucket: "healthhaven-ba506.appspot.com",
//     messagingSenderId: "446064924415",
//     appId: "1:446064924415:web:3931f260034e7c99e59eca",
//     measurementId: "G-VSDN2BRSE5"
// };
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASiGI7WJ_kRYm-uUBNAI0op5UwtI2gQJc",
    authDomain: "genlish-de314.firebaseapp.com",
    projectId: "genlish-de314",
    storageBucket: "genlish-de314.appspot.com",
    messagingSenderId: "517532600559",
    appId: "1:517532600559:web:e707721c95fdfd66f8731a",
    measurementId: "G-T25WFYY2J6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()
export const signWithGoogle = (type) => new Promise((rejects, resolve) => {
    signInWithPopup(auth, provider)
        .then(result => {
            const { email, photoURL } = result.user
            if (type === 'sign-up') {
                api({ body: { email, avatar: photoURL }, path: '/sign-up-with-google', type: TypeHTTP.POST, sendToken: false })
                    .then(user => {
                        rejects(user)
                    })
                    .catch(error => {
                        resolve(error)
                    })
            } else if (type === 'sign-in') {
                api({ body: { email }, path: '/sign-in-with-google', type: TypeHTTP.POST, sendToken: false })
                    .then(user => {
                        rejects(user)
                    })
                    .catch(error => {
                        resolve(error)
                    })
            }
        })
        .catch(error => {
            resolve(error)
        })
})
export const connectToGoogle = (type) => new Promise((resolve, rejects) => {
    signInWithPopup(auth, provider)
        .then(result => {
            const { email } = result.user
            resolve(email)
        })
        .catch(error => {
            rejects(error)
        })
})