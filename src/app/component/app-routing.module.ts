import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { filter } from 'rxjs/operators';


const routes: Routes = [
 {path:'private-chat',component:PrivateChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
