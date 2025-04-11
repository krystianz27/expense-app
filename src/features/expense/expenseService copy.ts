/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth, db, storage } from "@fbconfig/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ExpenseFormData } from "@src/features/expense/expenseSchema";

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
      userId: userId,
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      date: expenseData.date,
      receipt: receiptUrl,
    });
  } catch (e) {
    // console.error("Error while adding expense: ", e);
    throw new Error("Error while adding document to Firestore");
  }
};

export const getUserExpenses = async () => {
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

    // const expenses = querySnapshot.docs.map((doc) => doc.data());
    const expenses = querySnapshot.docs.map((doc) => ({
      id: doc.id, // <-- ID dokumentu
      ...doc.data(),
    }));

    return expenses;
  } catch (e) {
    // console.error("Error while fetching expenses: ", e);
    throw new Error("Error while fetching expenses from Firestore");
  }
};
