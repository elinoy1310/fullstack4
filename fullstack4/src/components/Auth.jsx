import { useState } from "react";

// קומפוננטת התחברות/הרשמה - מנהלת משתמשים בצד לקוח בלבד
function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // מצב: "login" או "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    // בדיקה שהשדות לא ריקים
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    // טעינת כל המשתמשים הקיימים מה-localStorage
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem("users") || "{}");
    } catch {
      users = {}; // אם ה-JSON פגום - מתחילים מאובייקט ריק
    }

    if (mode === "register") {
      // הרשמה - בודקים שהשם לא תפוס
      if (users[username]) {
        setError("Username already exists");
        return;
      }
      // שמירת המשתמש החדש ב-localStorage וכניסה אוטומטית
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);
      onLogin(username);

    } else {
      // התחברות - בדיקת שם משתמש וסיסמה
      if (!users[username]) {
        setError("Username does not exist");
        return;
      }
      if (users[username] !== password) {
        setError("Incorrect password");
        return;
      }
      // שמירת המשתמש המחובר וכניסה
      localStorage.setItem("currentUser", username);
      onLogin(username);
    }
  };

  // מעבר בין מצב התחברות להרשמה - מנקה שדות ושגיאות
  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setUsername("");
    setPassword("");
  };

  return (
    <div id="auth-container">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()} // Enter = שלח
      />

      {/* הצגת שגיאה אם יש */}
      {error && <p className="auth-error">{error}</p>}

      <button onClick={handleSubmit}>
        {mode === "login" ? "Login" : "Register"}
      </button>

      {/* קישור מעבר בין מצבים */}
      <p>
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <span className="auth-toggle" onClick={switchMode}>
          {mode === "login" ? "Register here" : "Login"}
        </span>
      </p>
    </div>
  );
}

export default Auth;