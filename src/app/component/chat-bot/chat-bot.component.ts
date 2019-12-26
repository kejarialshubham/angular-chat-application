import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/service/client-service/chat-service.service';
import { FormGroup, FormControl } from '@angular/forms';
var brain = require('src/app/constant/data.json');


@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {

  userData: any;
  username = this.chatService.username;
  receivername: any;
  PrivateMessages = [];
  chatForm: FormGroup;
  displayMessage = [];
  userToggle:any = { checked : false , name : '' };
  userToggleArray:any = [];
  sentimentScores=[];

  constructor( private chatService: ChatServiceService) {
  }

  ngOnInit() {
    this.chatForm = new FormGroup({
      message: new FormControl()
    })
    this.chatService.currentMessage.subscribe(params => {
      this.userData = params;
      this.receivername = this.userData.name;
      this.displayMessageFunction();
    })
    this.checkboxValue();
    this.chatService.getPrivateMessage().subscribe(data => {
      let checkFlag=0;
      let receivedData = JSON.parse(data);
      this.PrivateMessages = this.chatService.UserMap.get(receivedData.senderName);
      this.PrivateMessages.push(JSON.parse(data));
      this.chatService.UserMap.set(receivedData.senderName, this.PrivateMessages);
      let message = '';

      for(let i=0;i < this.userToggleArray.length;i++){
        if(receivedData.senderName == this.userToggleArray[i].name && this.userToggleArray[i].checked == true){
            checkFlag = 1;
        }
      }

      if(checkFlag == 1){
      }
      else
      {
        if(this.userToggle.name == receivedData.senderName && this.userToggle['checked']==true){

        }
        else if(receivedData.msg in brain){
                if(receivedData.msg == "connect to admin"){
                  this.userToggle = { checked : true , name : receivedData.senderName };
                  alert(receivedData.senderName+' wants you to connect');
                }
               message = brain[receivedData.msg];
              this.sendBotMessage(message,receivedData.senderName);
            }
            else{
              message = 'Cannot Understand';
              this.sendBotMessage(message,receivedData.senderName);
            }
      }
    });
  }
  
  // Bot is giving reply
  sendBotMessage(privateMessage,receiver_name) {
    this.chatForm.reset();
    let message = { senderName: this.chatService.username, receiverName: receiver_name, msg: privateMessage };
    this.PrivateMessages = this.chatService.UserMap.get(receiver_name);
    this.PrivateMessages.push(message);
    this.chatService.sendPrivateMessage(message);
  }

  // Admin can send private message using this function
  sendPrivateMessage(privateMessage) {
    this.chatForm.reset();
    let message = { senderName: this.chatService.username, receiverName: this.receivername, msg: privateMessage };
    this.PrivateMessages = this.chatService.UserMap.get(this.receivername);
    this.PrivateMessages.push(message);
    this.chatService.sendPrivateMessage(message);

  }

  // This is to get the map of the user
  displayMessageFunction() {
    this.displayMessage = this.chatService.UserMap.get(this.userData.name);
  }

  // Check the checkbox value whether it is checked or not
  checkboxValue(){
    this.chatService.checkCurrentValue.subscribe((userToggle:any) => {
          let flag = 0;
          this.userToggle = userToggle;
          if(this.userToggleArray.length == 0){
              this.userToggleArray.push(userToggle);
          }
          
          if(this.userToggleArray.length != 0){
            for(let i=0;i<this.userToggleArray.length;i++){
              if(this.userToggleArray[i].name == userToggle.name){
                  flag = 1;
              }
            }
            if(flag == 1){
              this.userToggleArray.forEach(item => {
                if(userToggle.name === item.name){
                   item.checked = userToggle.checked;
                }
              });
            }
            else{
              this.userToggleArray.push(userToggle);
            }
          }
    });
  }

  
  
}
