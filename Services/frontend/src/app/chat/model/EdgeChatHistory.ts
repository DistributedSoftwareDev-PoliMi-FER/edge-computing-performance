
export interface EdgeChatHistory {
    users: ChatHistoryUser[],
    history: ChatHistoryMessage[]
}

export interface ChatHistoryUser {
    userId: string;
    id: number;
    username: string;
}

export interface ChatHistoryMessage {
    senderPos: number;
    timeAndData: Date;
    message: string
}

