import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable,  Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  private url = 'http://10.229.118.86:3001';
  private socket;
  activeClients = [];
  username: string;
  UserMap: Map<any, any>;
  socketId: any;
  userDetail: any;
  newActiveClients=[];
  allEmployees=[];
  checkClient=[];

  checkValue = new Subject();
  checkCurrentValue = this.checkValue.asObservable();

  private messageNotification = new Subject();
  currentNotification = this.messageNotification.asObservable();

  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor() {
    this.socket = io.connect(this.url);
    this.UserMap = new Map<any, any>();
  }
  public setDetails(details) {
    this.messageSource.next(details);
  }

  public sendMessage(message: string, username: string) {
    let details = { name: username, msg: message }
    this.socket.emit('chat-message', JSON.stringify(details))
  }

  public getMessage() {
    return Observable.create((observer) => {
      this.socket.on('chat-message', (message: any) => {
        observer.next(message);
      })
    });
  }

  getPrivateMessage() {
    return Observable.create((observer) => {
      this.socket.on('send-private-message', (message: any) => {
        observer.next(message);
      })
    });
  }

  getOldmessages(receiver_name): any {
    let storeArray = []
    storeArray = this.UserMap.get(receiver_name)
    return storeArray
  }


  joinUser(username){
    this.socket.emit('join', username);
  }

  getActiveClients(): Observable<any> {
    this.socket.emit('get-clients');

    return Observable.create((observer) => {
      this.socket.on('get-clients', (data: any) => {

        this.activeClients = JSON.parse(data);
        for (let i = 0; i < this.activeClients.length; i++) {
          if (this.activeClients[i].name == this.username) {
            this.socketId = this.activeClients[i].id;
            this.activeClients.splice(i, 1);
          }
        }
        for (let i = 0; i < this.activeClients.length; i++) {
          if (!(this.UserMap.get(this.activeClients[i].name))) {
            let newArray = [];
            this.UserMap.set(this.activeClients[i].name, newArray)
          }
        }
        observer.next(data);
      })
    });
  }

  sendPrivateMessage(details) {
    this.socket.emit('private-message', JSON.stringify(details))
  }

  deleteMap(): Observable<any>{
    return Observable.create((observer) => {
      this.socket.on('delete-map', (data: any) => {
        observer.next(data);

      })
    });
}

getAllUsers(callback){
   this.socket.emit('get-all-users');
    this.socket.on('received-all-users',(allEmployees) => {
      callback(allEmployees)
    });
  
}

checkUser(username,callback){
  this.username = username;
  let duplicateFlag = false;
  this.getActiveClients().subscribe(activeClients => {
    this.checkClient = JSON.parse(activeClients);
    for(let i=0;i<this.checkClient.length;i++){
      if(this.checkClient[i].name == this.username){
          duplicateFlag = true;
          callback("duplicate");
      }
    }
    if(duplicateFlag == false){
      this.socket.emit('check-user',username);
  
    this.socket.on('success',()=> {
      this.joinUser(username)
      callback("success")
    });
    this.socket.on('failure',()=> {
      callback("failure");
    });
    this.socket.on('admin-success',()=> {
      this.joinUser(username)
      callback("admin")
    })
    }
  });
}

addNewUSer(name,callback){
    this.socket.emit('new-user',name);
    this.socket.on('add-new-user',()=> {
        callback(true)
    });
    this.socket.on('user-exist',()=> {
      callback(false);
    });
}

checkBoxValue(checked,name){
  let userToggle = {checked:checked,name:name}
  this.checkValue.next(userToggle)
}



}
