import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { ProtectedGuard, PublicGuard } from 'ngx-auth';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
  {
    path: '',
    canActivate: [ProtectedGuard],
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardsModule'
      },
      {
        path:'users',
        loadChildren: './views/users/users.module#UsersModule',
        data : {
          reuseRoute : true,
        }
      },
      {
        path:'cities',
        loadChildren: './views/cities/cities.module#CitiesModule'
      },
      {
        path:'roles',
        loadChildren:'./views/settings/roles/roles.module#RolesModule'
      },
      {
        path: 'mainoffices',
        loadChildren: './views/mainOffices/main-offices.module#MainOfficesModule'
      },

      {
        path: 'insurancecompanies',
        loadChildren : './views/insuranceCompanies/insurance-companies.module#InsuranceCompaniesModule'
      },
      {
        path: 'policynumbers',
        loadChildren : './views/policyNumbers/policy-number/policy-number.module#PolicyNumbersModule'
      },
      {
        path: 'contractedcomissions',
        loadChildren : './views/contractedComissions/contracted-comission/contracted-comission.module#ContractedComissionsModule'
      },
      {
        path: 'policies',
        loadChildren : './views/policies/policy/policy.module#PoliciesModule'
      },
      {
        path: 'policyholders',
        loadChildren : './views/policy-holders/policy-holders.module#PolicyHoldersModule'
      },
      {
        path: 'companies',
        loadChildren : './views/settings/companies/companies.module#CompaniesModule'
      },
      {
        path: 'obligatepolicynumbers',
        loadChildren : './views/policyNumbers/policy-numbers-obligate/policy-numbers-obligate.module#PolicyNumbersObligateModule'
      },
      {
        path: 'specifications',
        loadChildren : './views/reports/specificationsReport/specifications.report.module#SpecificationsReportModule'
      },
      {
        path: 'premium',
        loadChildren : './views/reports/specificationsReport/premium/premium.module#PremiumReportModule'
      },
      {
        path: 'insurancetypes',
        loadChildren : './views/insurance-types/insurance-types.module#InsuranceTypesModule'
      },
      {
        path: 'skadenca',
        loadChildren : './views/reports/skadenca-report/skadenca-report.module#SkadencaReportModule'
      },
      {
        path: 'greencards',
        loadChildren : './views/green-card/green-card.module#GreenCardModule'
      },
      {
        path: 'colors',
        loadChildren: './views/color/color.module#ColorsModule'
      },
      {
        path: 'technicalinspections',
        loadChildren: './views/technical-inspection/technical-inspection.module#TechnicalInspectionModule'
      },
      {
        path: 'obligategreencards',
        loadChildren: './views/green-card/green-cards-obligate/green-cards-obligate.module#GreenCardsObligateModule'
      },
      {
        path: 'vouchers',
        loadChildren: './views/voucher/voucher.module#VoucherModule'
      },
      {
        path: 'obligatevouchers',
        loadChildren: './views/voucher/voucher-obligate/voucher-obligate.module#VoucherObligateModule'
      },
      {
        path: 'partners',
        loadChildren: './views/partner/partner.module#PartnerModule'
      },
      {
        path: 'obligateagentspolicynumbers',
        loadChildren : './views/policyNumbers/policy-numbers-agent-obligate/policy-numbers-agent-obligate.module#PolicyNumbersAgentObligateModule'
      },
      {
        path: 'returnagentspolicynumbers',
        loadChildren : './views/policyNumbers/policy-numbers-agent-returned/policy-numbers-agent-returned.module#PolicyNumbersAgentReturnedModule'
      },
      {
        path: 'discharged',
        loadChildren : './views/policyNumbers/policy-numbers-admin-discharged/policy-numbers-admin-discharged.module#PolicyNumbersAdminDischargedModule'
      },
      {
        path: 'obligateddischarged',
        loadChildren : './views/reports/obligated-discharged-report/obligated-discharged-report.module#ObligatedDischargedReportModule'
      },
      {
        path: 'obligateddischargedadmin',
        loadChildren : './views/reports/obligated-discharged-report-admin/obligated-discharged-report-admin.module#ObligatedDischargedReportAdminModule'
      },
      {
        path: 'premiumanalysis',
        loadChildren : './views/reports/premium-analysis-report/premium-analysis-report.module#PremiumAnalysisReportModule'
      }
    ]
  },
  {
    path: '',
    canActivate: [PublicGuard],
    component: AuthLayoutComponent,
    children: [{
      path: 'pages',
      loadChildren: './pages/pages.module#PagesModule'
    }]
  }
];
