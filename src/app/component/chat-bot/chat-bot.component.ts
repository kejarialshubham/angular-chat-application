import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/service/client-service/chat-service.service';
import { FormGroup, FormControl } from '@angular/forms';
//import * as brain from '../../constant/data.json';
var brain = require('src/app/constant/data.json')
@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {

 
  constructor( private chatService: ChatServiceService) {
  }

  userData: any;
  username = this.chatService.username
  receivername: any;
  PrivateMessages = [];
  chatForm: FormGroup;
  displayMessage = [];
  currentUser: any;
  toggleButton = true;
  userToggle:any = { checked : false , name : '' };

  ngOnInit() {
    this.chatForm = new FormGroup({
      message: new FormControl()
    })
    this.chatService.currentMessage.subscribe(params => {
      this.userData = params
      this.receivername = this.userData.name
      this.displayMessageFunction();
    })
    this.checkboxValue();
    this.chatService.getPrivateMessage().subscribe(data => {
      let receivedData = JSON.parse(data)
      this.PrivateMessages = this.chatService.UserMap.get(receivedData.senderName);
      this.PrivateMessages.push(JSON.parse(data));
      this.chatService.UserMap.set(receivedData.senderName, this.PrivateMessages)
      console.log(this.chatService.UserMap)
      let message = '';

      if(receivedData.senderName == this.userToggle['name'] && this.userToggle['checked'] == true){
      }

      else
      {
        if(receivedData.msg in brain){
                if(receivedData.msg == "connect to admin"){
                  alert(receivedData.senderName+' wants you to connect');
                  //checkbox is checked
                }
              message = brain[receivedData.msg];
              this.sendBotMessage(message,receivedData.senderName);
            }
            else{
              message = 'Cannot Understand';
              this.sendBotMessage(message,receivedData.senderName)
            }
      }
    });
  }

  sendBotMessage(privateMessage,receiver_name) {
    this.chatForm.reset();
    let message = { senderName: this.chatService.username, receiverName: receiver_name, msg: privateMessage }
    console.log(message);
    console.log(this.chatService.UserMap);
    this.PrivateMessages = this.chatService.UserMap.get(receiver_name)
    this.PrivateMessages.push(message)
    this.chatService.sendPrivateMessage(message);
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

  checkboxValue(){
    this.chatService.checkCurrentValue.subscribe(userToggle => {
      this.userToggle = userToggle;
    });
  }
  
}
