import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, of, Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  private url = 'http://10.229.118.86:3001';
  private socket;
  activeClients = [];
  username: string;
  userDetails: Observable<any>;
  UserMap: Map<any, any>;
  socketId: any;
  userDetail: any;


  private messageNotification = new Subject();
  currentNotification = this.messageNotification.asObservable();


  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
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
        let highlight = JSON.parse(message)
        this.messageNotification.next(highlight.senderName);
        observer.next(message);
      })
    });
  }

  getOldmessages(receiver_name): any {
    let storeArray = []
    storeArray = this.UserMap.get(receiver_name)
    return storeArray
  }

  public sendUserDetails(username: string) {
    this.username = username;
    this.socket.emit('get-details', username)
    this.socket.emit('join', username);
  }

  getAllClients():Observable<any>{
      this.socket.emit('get-clients');
      return Observable.create((observer) => {
        this.socket.on('get-clients',data => {
          observer.next(data);
        });
      });
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
        console.log(this.UserMap)
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


  deleteMap(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('delete-map', (data: any) => {
        this.UserMap.delete(data)
        observer.next(data);
      })
    });

  }

}
