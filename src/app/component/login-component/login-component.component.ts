import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormControl } from '@angular/forms';
import { ChatServiceService } from 'src/app/service/client-service/chat-service.service';
var constant = require('src/app/constant/constant.json');

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage:any;
  loginSuccess:Boolean = false;
  activeClients=[];
  role:any;
  
  constructor(private chatService:ChatServiceService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      name : new FormControl(),
    });
  }
  login(name){
      this.chatService.checkUser(name,(value)=> {
        if(value == "success"){
          this.loginSuccess = true;
          this.role = "employee";
        }
        else if(value == "admin"){
          this.loginSuccess = true;
          this.role = "admin";
        }
        else if(value == "duplicate"){
          this.errorMessage = constant.userAlreadyActive ;
        }
        else{
    
          this.errorMessage = constant.wrongCredentials ;
        }
        
      });
  }
}
