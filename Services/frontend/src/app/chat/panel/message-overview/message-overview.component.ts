import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {ChatOverviewMessage} from "../../model/ChatOverviewMessage";

@Component({
  selector: 'edge-message-overview',
  templateUrl: './message-overview.component.html',
  styleUrls: ['./message-overview.component.scss']
})
export class MessageOverviewComponent {

  @Input() overview!: ChatOverviewMessage;
  @Output() participantClicked: EventEmitter<ChatOverviewMessage> = new EventEmitter<ChatOverviewMessage>();

  private readonly MAX_MESSAGE_LENGTH = 100;

  constructor() { }

  emitUserClicked(): void {
    this.participantClicked.emit(this.overview);
  }

  getFormattedMessage() {
    if (this.overview.lastMessage.length > this.MAX_MESSAGE_LENGTH) {
      return this.overview.lastMessage.slice(0, this.MAX_MESSAGE_LENGTH) + '(...)';
    } else {
      return this.overview.lastMessage;
    }
  }
}
