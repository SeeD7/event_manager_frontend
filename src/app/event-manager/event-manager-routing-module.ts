import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';

const routes: Routes = [
  { path: '', component: FrontPageComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'inscription', component: SignInComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'profile/edit', component: UpdateUserComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagerRoutingModule { }
