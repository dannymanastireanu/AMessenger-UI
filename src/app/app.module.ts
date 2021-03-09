import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { MessengerComponent } from './messenger/messenger.component';
import { AuthGuardService as AuthGuard } from './auth/AuthGuardService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tmes', component: MessengerComponent},
    {
      path: 'messenger',
      component: MessengerComponent,
      canActivate: [AuthGuard],
    },
];

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    MessengerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    FormsModule,
  ],
  exports: [RouterModule],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
