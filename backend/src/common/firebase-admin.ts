import { Logger } from "@nestjs/common";
import firebaseAdmin, { ServiceAccount } from "firebase-admin";

const logger = new Logger("FirebaseAdmin");

export function initializeFirebaseAdmin(): void {
  if (firebaseAdmin.apps.length > 0) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credentialsPath) {
    logger.warn("GOOGLE_APPLICATION_CREDENTIALS not set; Firebase verification will fail unless DEV_AUTH_USER_ID is used.");
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(credentialsPath) as ServiceAccount;
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      projectId: projectId ?? serviceAccount.projectId,
    });
    logger.log("Firebase Admin SDK initialized.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to initialize Firebase Admin SDK: ${message}`);
  }
}

export { firebaseAdmin };
