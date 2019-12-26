import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatServiceService } from '../../service/client-service/chat-service.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit {

  constructor(private chatService: ChatServiceService) {
  }

  userData: any;
  username = this.chatService.username
  receivername: any;
  PrivateMessages = [];
  chatForm: FormGroup;
  displayMessage = [];
  currentUser: any;
  ngOnInit() {
    this.chatForm = new FormGroup({
      message: new FormControl()
    })

    this.chatService.currentMessage.subscribe(params => {
      this.userData = params
      this.receivername = this.userData.name
      this.displayMessageFunction();
    })

    this.chatService.getPrivateMessage().subscribe(data => {
      let receivedData = JSON.parse(data)
      this.PrivateMessages = this.chatService.UserMap.get(receivedData.senderName);
      this.PrivateMessages.push(JSON.parse(data));
      this.chatService.UserMap.set(receivedData.senderName, this.PrivateMessages)
      console.log(this.chatService.UserMap)

    });
  }

  sendPrivateMessage(privateMessage) {
    this.chatForm.reset();
    let message = { senderName: this.chatService.username, receiverName: this.receivername, msg: privateMessage }
    console.log(message);
    console.log(this.chatService.UserMap);
    this.PrivateMessages = this.chatService.UserMap.get(this.receivername)
    this.PrivateMessages.push(message)
    this.chatService.sendPrivateMessage(message);

  }

  displayMessageFunction() {
    this.displayMessage = this.chatService.UserMap.get(this.userData.name)
  }
}
