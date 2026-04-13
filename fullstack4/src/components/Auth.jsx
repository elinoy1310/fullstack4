import { useState } from "react";

// Authentication/Register component - manages users on client side only
function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // state: "login" or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    // check that fields are not empty
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    // load all existing users from localStorage
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem("users") || "{}");
    } catch {
      users = {}; // if JSON is corrupted - start with empty object
    }

    if (mode === "register") {
      // register - check that username is not taken
      if (users[username]) {
        setError("Username already exists");
        return;
      }
      // save new user in localStorage and auto login
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);
      onLogin(username);

    } else {
      // login - check username and password
      if (!users[username]) {
        setError("Username does not exist");
        return;
      }
      if (users[username] !== password) {
        setError("Incorrect password");
        return;
      }
      // save logged-in user and continue
      localStorage.setItem("currentUser", username);
      onLogin(username);
    }
  };

  // switch between login/register mode - clears fields and errors
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
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()} // Enter = submit
      />

      {/* show error if exists */}
      {error && <p className="auth-error">{error}</p>}

      <button onClick={handleSubmit}>
        {mode === "login" ? "Login" : "Register"}
      </button>

      {/* toggle between modes */}
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