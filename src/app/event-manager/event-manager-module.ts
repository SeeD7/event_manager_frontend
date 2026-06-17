import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventManagerRoutingModule } from './event-manager-routing-module';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EventManagerRoutingModule
  ],
  providers: [
    UsersService, 
    UsersResolver,
  ]
})
export class EventManagerModule { }
