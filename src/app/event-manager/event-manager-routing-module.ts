import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignInComponent } from './components/user/sign-in/sign-in.component';
import { ProfilePageComponent } from './components/user/profile-page/profile-page.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { EventCategoryListComponent } from './components/event-category/event-category-list/event-category-list.component';

const routes: Routes = [
  { path: '', component: FrontPageComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'inscription', component: SignInComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'profile/edit', component: UpdateUserComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'event-categories', component: EventCategoryListComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagerRoutingModule { }
