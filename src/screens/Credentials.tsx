import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";
import { MapPin, Globe, Flag } from "lucide-react";

const Credentials = () => {
    const navigate = useNavigate();
    const [region, setRegion] = useState("us");
    const [appId, setAppId] = useState("");
    const [authKey, setAuthKey] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();
        localStorage.setItem("region", region);
        localStorage.setItem("appId", appId);
        localStorage.setItem("authKey", authKey);

        if (appId && region && authKey) {
            const uiKitSettings = new UIKitSettingsBuilder()
                .setAppId(appId)
                .setRegion(region)
                .setAuthKey(authKey)
                .subscribePresenceForAllUsers()
                .build();

            await CometChatUIKit.init(uiKitSettings);
            navigate("/login", { replace: true });
        }
    }

    const regionOptions = [
        { id: "us", label: "US", icon: MapPin },
        { id: "eu", label: "EU", icon: Globe },
        { id: "in", label: "IN", icon: Flag },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 p-8">
                <h1 className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-6 text-center">
                    App Credentials
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Region selector */}
                    <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Region</label>
                        <div className="flex gap-4">
                            {regionOptions.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setRegion(id)}
                                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition
                ${region === id
                                            ? "border-blue-600 bg-blue-100 dark:bg-blue-900 dark:border-blue-400"
                                            : "border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
                                        }`}
                                >
                                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* App ID input */}
                    <div>
                        <label htmlFor="appId" className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                            APP ID
                        </label>
                        <input
                            id="appId"
                            type="text"
                            placeholder="Enter the app ID"
                            value={appId}
                            onChange={(e) => setAppId(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Auth Key input */}
                    <div>
                        <label htmlFor="authKey" className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                            Auth Key
                        </label>
                        <input
                            id="authKey"
                            type="text"
                            placeholder="Enter the auth key"
                            value={authKey}
                            onChange={(e) => setAuthKey(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Credentials;
