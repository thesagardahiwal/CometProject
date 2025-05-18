// ./CometChat/utils/utils.ts
import { CometChatLocalize } from "@cometchat/chat-uikit-react";

/**
 * Initializes localization for CometChat UI Kit.
 * You can extend this to support multiple languages or custom translations.
 */
export function setupLocalization(language: string = "en") {
    CometChatLocalize.init({language});
}
