import { auth, db, storage } from "@fbconfig/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ExpenseFormData } from "lib/validation/expenseSchema";

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt?: string | null;
}

export const addExpense = async (expenseData: ExpenseFormData) => {
  try {
    let receiptUrl: string | null = null;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("Użytkownik nie jest zalogowany");
    }

    if (expenseData.receipt && expenseData.receipt[0]) {
      const file = expenseData.receipt[0];
      const storageRef = ref(storage, `receipts/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      receiptUrl = await getDownloadURL(uploadResult.ref);
    }

    await addDoc(collection(db, "expenses"), {
      userId,
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      date: expenseData.date,
      receipt: receiptUrl,
    });
  } catch (e) {
    throw new Error("Error while adding document to Firestore");
  }
};

export const getUserExpenses = async (): Promise<Expense[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const expensesQuery = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(expensesQuery);

    const expenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];

    return expenses;
  } catch (e) {
    throw new Error("Error while fetching expenses from Firestore");
  }
};

export const deleteExpense = async (expenseId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not logged in");

  const docRef = doc(db, "expenses", expenseId);
  const expenseSnap = await getDoc(docRef);

  if (!expenseSnap.exists() || expenseSnap.data().userId !== userId) {
    throw new Error("Not authorized to delete this expense");
  }

  const receiptUrl = expenseSnap.data().receipt;
  if (receiptUrl) {
    try {
      const path = new URL(receiptUrl).pathname;
      const filename = decodeURIComponent(path.split("/").pop()!);
      const storageRef = ref(storage, `receipts/${filename}`);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn("Couldn't delete receipt file from storage:", err);
    }
  }

  await deleteDoc(docRef);
};

export const updateExpense = async (
  expenseId: string,
  updatedData: Partial<Expense & { receipt: FileList | null }>,
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not logged in");

  const docRef = doc(db, "expenses", expenseId);
  const expenseSnap = await getDoc(docRef);

  if (!expenseSnap.exists() || expenseSnap.data().userId !== userId) {
    throw new Error("Not authorized to update this expense");
  }

  const updatePayload: Partial<Expense> = {
    amount: updatedData.amount,
    description: updatedData.description,
    category: updatedData.category,
    date: updatedData.date,
    receipt: updatedData.receipt
      ? updatedData.receipt[0]
      : expenseSnap.data().receipt,
  };

  if (updatedData.receipt && updatedData.receipt.length > 0) {
    const file = updatedData.receipt[0];

    if (file && file.constructor.name === "File") {
      const storageRef = ref(storage, `receipts/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const receiptUrl = await getDownloadURL(uploadResult.ref);
      updatePayload.receipt = receiptUrl;
    } else {
      throw new Error("Invalid file type for receipt");
    }
  }

  await updateDoc(docRef, updatePayload);
};
