import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../../../services/companies.service';
import { Company } from '../../../models/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  providers : [CompaniesService]
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = new Array();
  constructor(private companiesService: CompaniesService,
    private router: Router) {
    this.companiesService.Find().then(x => {
      if (x != null) {
        this.companies = x;
      }
    })
   }

  ngOnInit() {
  }

  editCompany(id : string){
this.router.navigate(["companies/",id])
  }

}
