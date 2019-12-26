import { Component, OnInit} from '@angular/core';
import { ChatServiceService } from 'src/app/service/client-service/chat-service.service';
import { FormGroup, FormControl } from '@angular/forms';
var constant = require('src/app/constant/constant.json');

@Component({
  selector: 'app-admin-component',
  templateUrl: './admin-component.component.html',
  styleUrls: ['./admin-component.component.css']
})
export class AdminComponentComponent implements OnInit {

 
  searchedUser: any;
  message: any;
  errorMessage: any;
  messages = [];
  socketId: any;
  temp = 0;
  newActiveClients=[];
  public broadcast_form: FormGroup;
  dataArray=[];
  allEmployees=[];
  activeClients=[];
  username:any;
  
  
  constructor(private chatService:ChatServiceService) {
    this.chatService.getAllUsers((data)=> {
      this.allEmployees = JSON.parse(data);
      console.log(this.allEmployees)
    });
    this.getActiveUsers();
    this.deleteDisconnected();
   }
 
  ngOnInit() {
    this.broadcast_form = new FormGroup({
      inputText: new FormControl()
  });
    
    this.username = this.chatService.username;
   
   
    
    this.chatService.getMessage().subscribe((message: any) => {
      this.messages.push(JSON.parse(message));
  });

  this.chatService.getPrivateMessage().subscribe(data => {
      let message = JSON.parse(data);
      for(let i = 0;i<this.activeClients.length;i++){
          if(this.activeClients[i].name==message.senderName){
            this.activeClients[i].count++;
          }
        }
  });

  this.chatService.deleteMap().subscribe();
  }
  
  checkFunction(checked,name){
    this.chatService.checkBoxValue(checked,name);
  }
  
  sendMessage() {
      this.chatService.sendMessage(this.message, this.username);
      this.message = '';
  }
  gotoPrivateChat(userDetails,index) {
      this.temp = 1;
      this.activeClients[index].count=0;
      this.chatService.setDetails(userDetails);
  }

  getActiveUsers() {
      this.chatService.getActiveClients().subscribe(data => {
        this.dataArray = JSON.parse(data)
        let j=0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
          if (this.dataArray[i].name == this.username) {
            this.socketId = this.dataArray[i].id;
            this.dataArray.splice(i, 1);
          }
        }
        j = this.dataArray.length-1;
        // if fresh start
        if(this.activeClients.length == 0){
          for (let i = 0; i < this.dataArray.length; i++) {
            this.activeClients.push({name:this.dataArray[i].name,id:this.dataArray[i].id,count:0});
          }
        }  
        //if already started
        else if(this.activeClients.length == this.dataArray.length-1){
          this.activeClients.push({name:this.dataArray[j].name,id:this.dataArray[j].id,count:0});
        }
        console.log(this.activeClients,"active clients")
        console.log(this.allEmployees,"employees")
        for(let i=0;i<this.activeClients.length;i++){
          for(let j=0;j<this.allEmployees.length;j++){
            if(this.activeClients[i].name == this.allEmployees[j].name ){
              console.log(this.allEmployees)
              this.allEmployees.splice(j,1);
            }
          }
        }
      });
    }

  searchUserName(username) {
      for (let i = 0; i < this.chatService.activeClients.length; i++) {
          if (this.chatService.activeClients[i].name === username) {
              this.searchedUser = this.chatService.activeClients[i];
              this.errorMessage = '';
          }
      }
      if (this.searchedUser == null) {
          this.errorMessage = constant.userNotFound;
      }
  }
  deleteDisconnected(){
      this.chatService.deleteMap().subscribe(user =>{
         for (let i = 0; i < this.activeClients.length; i++) {
          if (this.activeClients[i].name == user) {
            this.activeClients.splice(i, 1);
            this.allEmployees.push({name:user});
            this.chatService.UserMap.delete(user)
          }
        }
      }) 
    }


}
