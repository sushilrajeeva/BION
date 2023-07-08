import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component'; // Import this
import { LoginComponent } from './login/login.component';
import { AboutBionComponent } from './about-bion/about-bion.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'aboutbion', component: AboutBionComponent },
  { path: '**', redirectTo: '' }, // Redirect all unknown paths to homepage
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
