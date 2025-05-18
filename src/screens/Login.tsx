import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { CometChatUIKit, CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";
import { apiKey, appId, region } from "../config/creadentials";

export default function Login() {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
      const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
      if (loggedInUser) {
          navigate("/", { replace: true });
        }
        
    const hasCredentials = appId && region && apiKey;
    if (!hasCredentials) {
      navigate("/credentials");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await CometChatUIKit.login(uid);
      navigate("/home");
    } catch (err) {
      setError("Login failed. Please check your UID.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Let’s Connect
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter UID
            </label>
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="e.g., superhero1"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
