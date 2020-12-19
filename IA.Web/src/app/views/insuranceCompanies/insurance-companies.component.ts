import { Component, OnInit } from '@angular/core';
import { InsuranceCompanyService } from '../../services/insurance-companies.service';
import { Insurance } from '../../models/insuranceCompany';
import { NotificationsService } from '../../core/notifications.service';
import { Router } from '@angular/router';
import { CompaniesInsurancesService } from '../../services/companies-insurances';
import { CompanyInsurance } from '../../models/companyInsurance';
import { TokenStorage } from '../../core/tokenstorage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-insurance-company',
  templateUrl: './insurance-companies.component.html',
  providers: [InsuranceCompanyService, CompaniesInsurancesService]
})
export class InsuranceCompanyComponent implements OnInit {
  insurances: Insurance[] = new Array();
  companyInsurance: CompanyInsurance = new CompanyInsurance();
  constructor(private insuranceCompanyService: InsuranceCompanyService,
    private notificationService: NotificationsService,
    private router: Router,
    private companyInsuranceService: CompaniesInsurancesService,
    private tokenStorage: TokenStorage) {
    this.insuranceCompanyService.FindAllActive().then(x => {
      if (x != null) {
        this.insurances = x.sort((a,b)=>{
          return(a.Name.localeCompare(b.Name,environment.defaultLanguage))
        });
      }
    })
  }

  ngOnInit() {
  }
  onDelete(event) {
    if (event != null) {
      let item = this.insurances.find(x => x.Id == event);
      item.IsActive = false;
      this.insuranceCompanyService.Update(item).then(x => {
        if (x != null) {
          this.companyInsurance.CompanyId = this.tokenStorage.getCompanyId();
          this.companyInsurance.InsuranceId = item.Id;
          this.companyInsurance.IsActive = false;
          this.companyInsuranceService.UpdateCompanyInsurance(this.companyInsurance.CompanyId.toString(), this.companyInsurance).then(y => {
            if (y != null) {
              let index = this.insurances.findIndex(z => z.Id == event);
              this.insurances.splice(index, 1);
              this.notificationService.success("INSURANCE_COMPANIES", "DELETED_SUCCESSFULY");
            }
          })
        }
      })
    }
  }

  editInsuranceCompany(id: string) {
    this.router.navigate(['insurancecompanies/', id])
  }

}
