// ./CometChat/context/BuilderSettingsContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";

// Define the settings that control UI Kit features
type BuilderSettings = {
  showTypingIndicator: boolean;
  enableThreadedMessages: boolean;
  showMediaSharing: boolean;
  setShowTypingIndicator: (val: boolean) => void;
  setEnableThreadedMessages: (val: boolean) => void;
  setShowMediaSharing: (val: boolean) => void;
};

const BuilderSettingsContext = createContext<BuilderSettings | undefined>(undefined);

export const BuilderSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);
  const [enableThreadedMessages, setEnableThreadedMessages] = useState(true);
  const [showMediaSharing, setShowMediaSharing] = useState(true);

  return (
    <BuilderSettingsContext.Provider
      value={{
        showTypingIndicator,
        enableThreadedMessages,
        showMediaSharing,
        setShowTypingIndicator,
        setEnableThreadedMessages,
        setShowMediaSharing,
      }}
    >
      {children}
    </BuilderSettingsContext.Provider>
  );
};

// Hook to use settings inside components
export const useBuilderSettings = () => {
  const context = useContext(BuilderSettingsContext);
  if (!context) {
    throw new Error("useBuilderSettings must be used within a BuilderSettingsProvider");
  }
  return context;
};
