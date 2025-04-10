import { auth, db } from "@src/firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export interface Category {
  id?: string;
  name: string;
}

const categoriesRef = collection(db, "categories");

export const addCategory = async (category: Omit<Category, "id">) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User is not logged in");
  }

  const docRef = await addDoc(categoriesRef, {
    ...category,
    userId: userId,
  });
  return { id: docRef.id, ...category };
};

export const getUserCategories = async (): Promise<Category[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User is not logged in");
  }

  const q = query(categoriesRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

export const deleteCategory = async (categoryId: string) => {
  await deleteDoc(doc(db, "categories", categoryId));
};

export const updateCategory = async (
  categoryId: string,
  updatedData: Partial<Category>,
) => {
  await updateDoc(doc(db, "categories", categoryId), updatedData);
};
