import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DxVectorMapModule } from "devextreme-angular";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";

import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [CommonModule,HttpClientModule,
    SharedModule,
     RouterModule, FormsModule, JwBootstrapSwitchNg2Module, NgbModule, DxVectorMapModule],
  declarations: [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
  ]
})
export class ComponentsModule {}
