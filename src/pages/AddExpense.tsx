// src/pages/AddExpense.tsx
import { useState } from "react";
import { db, storage } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleSubmit = async () => {
    let imageUrl = "";

    if (receipt) {
      const storageRef = ref(storage, `receipts/${receipt.name}`);
      await uploadBytes(storageRef, receipt);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "expenses"), {
      amount,
      description,
      receiptUrl: imageUrl,
      createdAt: new Date(),
    });

    setAmount("");
    setDescription("");
    setReceipt(null);
  };

  return (
    <div>
      <h2>Dodaj wydatek</h2>
      <input
        placeholder="Kwota"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
      />
      <button onClick={handleSubmit}>Zapisz</button>
    </div>
  );
}
