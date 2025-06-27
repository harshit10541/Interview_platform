'use server'; //doing this server side to make it more secure as if we do it 
// on client side the id token can be downloaded by the user and exploited

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60*60*24*7;

export async function signUp(params: SignUpParams){
    const {uid, name, email} = params; //these are the params we are using

    try{ //sign user up
        const userRecord = await db.collection('users').doc(uid).get(); //fetch user record, heading into users collection, getting a doc with user id
        if (userRecord.exists){ // check if it exists
            return {
                success: false, 
                message: 'user already exists sign in instead'
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })
        return {
            success: true,
            message: "account created successfully"
        }
    }catch(e: any){ //any so we dont have to do typescript validation
        console.error('Error creating a user', e);
        if (e.code ==='auth/email-already-exists'){ //firebase specific errors, can comment out
            return{
                success: false,
                message: 'this email is already in use'
            } 
        }
        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}
//creating sign in functionality
export async function signIn(params: SignInParams){
    const {email, idToken} = params;
    try{
        //make sure to import it from admin, if it's from client you won't get access
        const userRecord = await auth.getUserByEmail(email);
        
        if (!userRecord){
            return {
                success: false,
                message: "user doesn't exist"
            }
        }
        await setSessionCookie(idToken);

    }catch(e){
        console.log(e);

        return {
            success: false, 
            message: 'Failed to log into acc'
        }
    }
}
export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies(); //getting cookies from store

    const sessionCookie = await auth.createSessionCookie(idToken, { //setting session cookie
        expiresIn: ONE_WEEK*1000,
    })

    cookieStore.set('session', sessionCookie,{ //setting to cookie store
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax' //got it from documentation
    })
}

export async function getCurrentUser(): Promise<User | null>{
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null; //user doesn't exist

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); //passing true to check if we have revoked the session
        const userRecord = await db
                                    .collection('users')
                                    .doc(decodedClaims.uid)
                                    .get();
        
        if(!userRecord.exists) return null;
        return {
            ... userRecord.data(),
            id: userRecord.id,
        } as User;
    }catch(e){
        console.log(e)
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user; //convert truth false value to boolean variable
}