import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/service/client-service/chat-service.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private chatService:ChatServiceService) { }

  ngOnInit() {
  }

  register(name){
    this.chatService.addNewUSer(name, (data)=> {
      if(data){
          //new user added , go to client component
      }
      else{
        //user exist. please enter name again.
      }
    });
  }
}
