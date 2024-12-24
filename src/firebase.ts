import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FB_API_KEY,
  authDomain: import.meta.env.VITE_APP_FB_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FB_DB_URL,
  projectId: import.meta.env.VITE_APP_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FB_MSG_SENDER_ID,
  appId: import.meta.env.VITE_APP_FB_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)

//console.log(import.meta.env.VITE_APP_AUTH_EMULATOR_URL);

if (import.meta.env.VITE_APP_AUTH_EMULATOR_URL) {
  connectAuthEmulator(auth, import.meta.env.VITE_APP_AUTH_EMULATOR_URL)
}

// export utils/refs
export default auth
