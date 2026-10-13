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
import { EventFormComponent } from './components/event/event-form/event-form.component';
import { OrganizerGuard } from '../core/guards/organizer.guard';
import { ListDisplayComponent } from './components/calendar/list/list-display/list-display.component';

const routes: Routes = [
  { path: '', component: FrontPageComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'inscription', component: SignInComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'profile/edit', component: UpdateUserComponent },
  { path: 'agenda', component: ListDisplayComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'event-categories', component: EventCategoryListComponent, canActivate: [AdminGuard] },
  { path: 'events/add', component: EventFormComponent, canActivate: [OrganizerGuard] },
  { path: 'events/edit/:id', component: EventFormComponent, canActivate: [OrganizerGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagerRoutingModule { }
