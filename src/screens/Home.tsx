import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import {
    useState,
    useEffect,
    useRef,
    type KeyboardEvent,
    type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";
import { apiKey, appId, region } from "../config/creadentials";
import { CometChat } from "@cometchat-pro/chat";

interface Message {
    from: string; // 'me' or user uid
    text: string;
}

type Messages = {
    [userId: string]: Message[];
};

const initialMessages: Messages = {};

function Home() {
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
    const [users, setUsers] = useState<CometChat.User[]>([]);
    const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(undefined);
    const [messages, setMessages] = useState<Messages>(initialMessages);
    const [inputText, setInputText] = useState<string>("");

    const messagesEndRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const hasCredentials = () => appId && apiKey && region;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedUser]);

    useEffect(() => {
        const initAndFetch = async () => {
            if (!hasCredentials()) {
                navigate("/credentials", { replace: true });
                return;
            }

            try {
                const user = (await CometChatUIKit.getLoggedinUser()) as unknown as CometChat.User;
                if (!user) {
                    navigate("/login", { replace: true });
                    return;
                }

                setLoggedInUser(user);

                if (!CometChat.isInitialized()) {
                    const appSettings = new CometChat.AppSettingsBuilder()
                        .subscribePresenceForAllUsers()
                        .setRegion(region)
                        .build();

                    await CometChat.init(appId, appSettings);
                    console.log("CometChat initialized successfully");
                }

                fetchUsersFromCometChat(user);
            } catch (err) {
                console.error("Initialization or login check failed:", err);
                navigate("/login", { replace: true });
            }
        };

        initAndFetch();
    }, []);

    const fetchUsersFromCometChat = (currentUser: CometChat.User) => {
        const usersRequest = new CometChat.UsersRequestBuilder().setLimit(30).build();

        usersRequest
            .fetchNext()
            .then((userList) => {
                const filteredUsers = userList.filter((u) => u.getUid() !== currentUser.getUid());
                setUsers(filteredUsers);
                if (!selectedUser && filteredUsers.length > 0) {
                    setSelectedUser(filteredUsers[0]);
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    };

    const sendMessage = async () => {
        if (!inputText.trim() || !selectedUser || !loggedInUser) return;

        const receiverID = selectedUser.getUid();
        const messageText = inputText.trim();
        const textMessage = new CometChat.TextMessage(
            receiverID,
            messageText,
            CometChat.RECEIVER_TYPE.USER
        );

        try {
            const sentMessage = await CometChat.sendMessage(textMessage);
            console.log("Message sent", sentMessage);

            setMessages((prev) => {
                const userMsgs = prev[receiverID] || [];
                return {
                    ...prev,
                    [receiverID]: [...userMsgs, { from: "me", text: messageText }],
                };
            });
            setInputText("");
        } catch (error) {
            console.error("Message sending failed:", error);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            fetchPreviousMessages(selectedUser.getUid());
        }
    }, [selectedUser]);

    const fetchPreviousMessages = async (uid: string) => {
        const messageRequest = new CometChat.MessagesRequestBuilder()
            .setUID(uid)
            .setLimit(30)
            .build();

        try {
            const messageList = await messageRequest.fetchPrevious();
            const formattedMessages: Message[] = messageList
                .map((msg) => {
                    if (msg instanceof CometChat.TextMessage) {
                        return {
                            from: msg.getSender().getUid() === loggedInUser?.getUid() ? "me" : msg.getSender().getUid(),
                            text: msg.getText(),
                        };
                    }
                    return null;
                })
                .filter(Boolean) as Message[];

            setMessages((prev) => ({
                ...prev,
                [uid]: formattedMessages,
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (!loggedInUser) return;

        const listenerID = "MESSAGE_LISTENER_" + loggedInUser?.getUid();

        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: (message: CometChat.TextMessage) => {
                    const senderId = message.getSender().getUid();
                    const messageText = message.getText();

                    setMessages((prev) => {
                        const userMsgs = prev[senderId] || [];
                        return {
                            ...prev,
                            [senderId]: [...userMsgs, { from: senderId, text: messageText }],
                        };
                    });
                },
            })
        );

        return () => {
            if (listenerID) CometChat.removeMessageListener(listenerID);
        };
    }, [loggedInUser]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    function handleLogout() {
        CometChatUIKit.logout().then(() => {
            setLoggedInUser(null)
            navigate('/login', { replace: true });
        }).catch((error) => {
            console.log("error", error)
        });
    }


    if (!loggedInUser) return null;

    return (
        <div className="flex flex-col sm:flex-row h-screen font-sans bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <div className="w-full sm:w-80 sm:border-r border-b sm:border-b-0 bg-white overflow-y-auto shadow-sm">
                <h2 className="flex justify-between items-center text-2xl font-bold text-blue-600 px-4 py-4 border-b-2 border-blue-600">
                    <span>Chats</span>
                    <button
                        onClick={handleLogout}
                        className="border border-red-400 text-red-400 font-medium text-lg rounded-xl px-3 py-1 hover:bg-red-50 transition"
                        type="button"
                    >
                        Logout
                    </button>
                </h2>

                {users.length === 0 ? (
                    <p className="text-gray-500 italic px-5 py-4">No users found</p>
                ) : (
                    users.map((user) => {
                        const isSelected = selectedUser?.getUid() === user.getUid();
                        return (
                            <div
                                key={user.getUid()}
                                onClick={() => setSelectedUser(user)}
                                className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-all duration-200 ${isSelected
                                        ? 'bg-blue-100 border-l-4 border-blue-500'
                                        : 'hover:bg-blue-50 border-l-4 border-transparent'
                                    }`}
                            >
                                <img
                                    src={
                                        user.getAvatar() ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            user.getName()
                                        )}&background=0084ff&color=fff&rounded=true`
                                    }
                                    alt={user.getName()}
                                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                                />
                                <div
                                    className={`truncate font-medium ${isSelected ? 'text-blue-800 font-semibold' : 'text-gray-800'
                                        }`}
                                    title={user.getName()}
                                >
                                    {user.getName()}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col bg-white shadow-inner">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-4 bg-blue-600 text-white text-lg font-bold border-b">
                    <img
                        src={
                            selectedUser?.getAvatar() ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                selectedUser?.getName() || ''
                            )}&background=0056b3&color=fff&rounded=true`
                        }
                        alt={selectedUser?.getName()}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-md"
                    />
                    <span>{selectedUser?.getName() || 'Select a user'}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gradient-to-b from-white to-gray-100 space-y-3">
                    {(selectedUser && messages[selectedUser.getUid()]
                        ? messages[selectedUser.getUid()]
                        : []
                    ).map((msg, idx) => {
                        const isMe = msg.from === 'me';
                        return (
                            <div
                                key={idx}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm sm:text-base shadow-md ${isMe
                                            ? 'bg-blue-500 text-white shadow-blue-200'
                                            : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-3 p-4 border-t bg-gray-50">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none focus:border-blue-500 shadow-inner text-sm sm:text-base"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputText.trim()}
                        className={`px-6 py-2 text-sm sm:text-base font-semibold rounded-full shadow-md transition-all ${inputText.trim()
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-blue-200 text-white cursor-not-allowed'
                            }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Home;
