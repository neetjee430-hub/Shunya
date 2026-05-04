import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Collection, Household, CreditWallet, GradeType } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firestoreService = {
  async getHouseholdByAuthId(userId: string): Promise<Household | null> {
    const path = 'households';
    try {
      const q = query(collection(db, path), where('auth_user_id', '==', userId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Household;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async getWallet(householdId: string): Promise<CreditWallet | null> {
    const path = 'credit_wallets';
    try {
      const q = query(collection(db, path), where('household_id', '==', householdId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as CreditWallet;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  subscribeToWallet(householdId: string, callback: (wallet: CreditWallet) => void) {
    const path = 'credit_wallets';
    const q = query(collection(db, path), where('household_id', '==', householdId));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        callback({ id: docData.id, ...docData.data() } as CreditWallet);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  async recordCollection(data: Partial<Collection>) {
    const path = 'collections';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        collected_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};
