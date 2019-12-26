import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { ClientComponentComponent } from './client-component/client-component.component';
import { AdminComponentComponent } from './admin-component/admin-component.component';



const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
