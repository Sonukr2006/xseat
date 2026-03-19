const admin = require("firebase-admin");
const env = require("../config/env");

let firebaseApp;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;
  if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
    return null;
  }
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey.replace(/\\n/g, "\n"),
    }),
  });
  return firebaseApp;
};

const sendPush = async ({ tokens, title, body, data }) => {
  if (!tokens || tokens.length === 0) return null;
  const app = initFirebase();
  if (!app) return null;
  return admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : undefined,
  });
};

module.exports = { initFirebase, sendPush };
