import {getApps} from 'firebase-admin/app';
const initFirebaseAdmin = ()={
    const apps = getApps();

    if (!apps.length){
        initializeApp({
            crdential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/)
            })
        })
    }

    return {
        auth: getAuth();
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin();