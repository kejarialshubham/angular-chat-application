import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatServiceService } from '../../service/client-service/chat-service.service';
import { scan } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-client-component',
  templateUrl: './client-component.component.html',
  styleUrls: ['./client-component.component.css']
})
export class ClientComponentComponent implements OnInit {

  username: any;
  highlightName: any;
  searchedUser: any;
  message: any;
  errorMessage: any;
  messages: string[] = [];
  activeClients: any;
  socketId: any;
  temp = 0;
  public broadcast_form: FormGroup

  constructor(private chatService: ChatServiceService, private route: Router) {
    this.setName();
  }

  ngOnInit() {
    this.broadcast_form = new FormGroup({
      inputText: new FormControl()
    });

   this.getActiveUsers();
    this.chatService.getMessage().subscribe((message: any) => {
      this.messages.push(JSON.parse(message))
    })

    this.chatService.getPrivateMessage().subscribe(data => {
      let message = JSON.parse(data)
    });
    this.chatService.deleteMap().subscribe();

    this.chatService.currentNotification.subscribe(data => {
      this.highlightName = data;
    });

  }

  

  setName(){
    this.username = prompt("Enter Name");
    while(this.username==null || this.username==" "){
      this.username = prompt("Please Enter a Name");
    }
     this.chatService.sendUserDetails(this.username);
  
  }

  sendMessage() {
    this.chatService.sendMessage(this.message, this.username);
    this.message = '';

  }
  gotoPrivateChat(userDetails) {
    this.temp = 1;
    this.highlightName = ""
    this.chatService.setDetails(userDetails);
  }

  getActiveUsers() {
    this.chatService.getActiveClients().subscribe(data => {
      this.activeClients = JSON.parse(data)
      console.log(this.activeClients)
      for (let i = 0; i < this.activeClients.length; i++) {
        if (this.activeClients[i].name == this.username) {
          console.log('inside if')
          this.socketId = this.activeClients[i].id;
          this.activeClients.splice(i, 1);
        }
      }
    });
  }
  searchUserName(username) {
    for (let i = 0; i < this.chatService.activeClients.length; i++) {
      if (this.chatService.activeClients[i].name == username) {
        this.searchedUser = this.chatService.activeClients[i]
        this.errorMessage = ""
      }
    }
    if (this.searchedUser == null) {
      this.errorMessage = "User Not Found"
    }


  }
}
