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
  constructor(private chatService:ChatServiceService,private router:Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      name : new FormControl(),
    });
  }
  login(name){
      this.chatService.checkUser(name,(value)=> {
        if(value == "success"){
          //go to client or admin component
          this.loginSuccess = true;
          this.router.navigateByUrl('client-component');
          console.log("success")
        }
        else if(value == "admin"){
          //go to admin component
          this.loginSuccess = true;
          this.router.navigateByUrl('admin-component');
        }
        else{
          console.log("login attempt failed");
          this.errorMessage = "Enter Credentials again";
        }
        
      });
  }
}
