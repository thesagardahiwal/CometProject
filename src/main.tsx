import { createRoot } from "react-dom/client";
import {
  UIKitSettingsBuilder,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { BuilderSettingsProvider } from "./CometChat/context/BuilderSettingsContext.tsx";
import { setupLocalization } from "./CometChat/utils/utils.ts";
import App from "./App.tsx";
import { apiKey, appId, region } from "./config/creadentials.ts";


export const COMETCHAT_CONSTANTS = {
  APP_ID: appId, // Replace with your App ID
  REGION: region, // Replace with your App Region
  AUTH_KEY: apiKey, // Replace with your Auth Key or leave blank if you are authenticating using Auth Token
};

const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

CometChatUIKit.init(uiKitSettings)?.then(() => {
  setupLocalization();
  createRoot(document.getElementById("root")!).render(
    <BuilderSettingsProvider>
      <App />
    </BuilderSettingsProvider>
  );
});