import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormControl } from '@angular/forms';
import { ChatServiceService } from 'src/app/service/client-service/chat-service.service';
import { Router } from '@angular/router';

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
  constructor(private chatService:ChatServiceService,private router:Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      name : new FormControl(),
    });
  }
  login(name){
      this.chatService.checkUser(name,(value)=> {
        if(value == "success"){
          this.loginSuccess = true;
          this.router.navigateByUrl('client-component');
          console.log("success")
        }
        else if(value == "admin"){
          this.loginSuccess = true;
          this.router.navigateByUrl('admin-component');
        }
        else if(value == "duplicate"){
          this.errorMessage = "User is already ON. "
        }
        else{
          console.log("login attempt failed");
          this.errorMessage = "Wrong Credentials.";
        }
        
      });
  }
}
