import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { ProtectedGuard, PublicGuard } from 'ngx-auth';

export const AppRoutes: Routes = [
  {
    path: "",
    canActivate: [ProtectedGuard],
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "",
    canActivate: [ProtectedGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: "./views/dashboard/dashboard.module#DashboardModule"
      },
      {
        path: "invoices",
        loadChildren:
          "./views/invoices/invoices.module#InvoicesModule"
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    canActivate: [PublicGuard],
    children: [
      {
        path: "pages",
        loadChildren: "./pages/pages/pages.module#PagesModule"
      }
    ]
  }
];
