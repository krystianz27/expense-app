import { auth, db } from "@fbconfig/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export interface Budget {
  id?: string;
  userId: string;
  amount: number;
  month: number; // 1–12
  year: number; // np. 2025
}

export const addBudget = async (budgetData: Omit<Budget, "id" | "userId">) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not logged in");

  await addDoc(collection(db, "budgets"), {
    userId,
    amount: budgetData.amount,
    month: budgetData.month,
    year: budgetData.year,
  });
};

export const getUserBudgets = async (): Promise<Budget[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not logged in");

  const budgetsQuery = query(
    collection(db, "budgets"),
    where("userId", "==", userId),
  );
  const snapshot = await getDocs(budgetsQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Budget[];
};

export const updateBudget = async (
  budgetId: string,
  updatedData: Partial<Budget>,
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not logged in");

  const docRef = doc(db, "budgets", budgetId);
  const budgetSnap = await getDoc(docRef);

  if (!budgetSnap.exists() || budgetSnap.data().userId !== userId) {
    throw new Error("Not authorized to update this budget");
  }

  await updateDoc(docRef, updatedData);
};

export const deleteBudget = async (budgetId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not logged in");

  const docRef = doc(db, "budgets", budgetId);
  const budgetSnap = await getDoc(docRef);

  if (!budgetSnap.exists() || budgetSnap.data().userId !== userId) {
    throw new Error("Not authorized to delete this budget");
  }

  await deleteDoc(docRef);
};
