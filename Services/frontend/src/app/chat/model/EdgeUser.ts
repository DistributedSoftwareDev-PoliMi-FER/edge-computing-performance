import {ChatParticipantStatus, ChatParticipantType, User} from "ng-chat";

// wrapper class to adjust to ng-chat api
export class EdgeUser extends User {
    override readonly participantType: ChatParticipantType = ChatParticipantType.User;
    override status: ChatParticipantStatus = ChatParticipantStatus.Online;
    override avatar: string = '';

    constructor(username: string, id: string) {
        super();
        this.displayName = username;
        this.id = id;
    }

    public static of(username: string, id: string) {
        return new EdgeUser(username, id)
    }
}
