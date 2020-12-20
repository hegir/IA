import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { PagesRoutes } from "./pages.routing";
import { RegisterComponent } from "./register/register.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(PagesRoutes), SharedModule],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ]
})
export class PagesModule {}
