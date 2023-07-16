import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component'; // Import this
import { LoginComponent } from './login/login.component';
import { AboutBionComponent } from './about-bion/about-bion.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProductsComponent } from './admin/products/products.component';
import { ManageProductComponent } from './admin/manage-product/manage-product.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'aboutbion', component: AboutBionComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'admin/products', component: ProductsComponent },
  { path: 'admin/manageProduct', component: ManageProductComponent },
  { path: '**', redirectTo: '' }, // Redirect all unknown paths to homepage
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
