import { useState } from "react";
import { auth } from "@fbconfig/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => signInWithEmailAndPassword(auth, email, password);
  const handleRegister = () =>
    createUserWithEmailAndPassword(auth, email, password);

  return (
    <div>
      <h2>Login / Register</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Zaloguj się</button>
      <button onClick={handleRegister}>Zarejestruj się</button>
    </div>
  );
}
