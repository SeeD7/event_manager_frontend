import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersResolver } from './resolvers/users.resolver';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: FrontPageComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'inscription', component: SignInComponent },
  { path: 'users', component: UserListComponent, resolve: { users: UsersResolver }, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagerRoutingModule { }
