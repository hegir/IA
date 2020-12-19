import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InsuranceCompanyService } from '../../../services/insurance-companies.service';
import { Insurance } from '../../../models/insuranceCompany';
import { Location } from '@angular/common';
import { CompaniesService } from '../../../services/companies.service';
import { Company } from '../../../models/company';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../../core/validation.service';
import { NotificationsService } from '../../../core/notifications.service';
import { MainOffice } from '../../../models/mainOffice';
import { MainOfficesService } from '../../../services/main-offices.service';
import { CompanyInsuranceMainOffice } from '../../../models/companyInsuranceMainOffice'
import { CompaniesInsurancesMainOfficeService } from '../../../services/companies-insurances-main-offices';
import { TokenStorage } from '../../../core/tokenstorage.service';
import { CompaniesInsurancesService } from '../../../services/companies-insurances';
import { CompanyInsurance } from '../../../models/companyInsurance';
import { environment } from '../../../../environments/environment';
import { env } from 'process';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-insurance-company-details',
  templateUrl: './insurance-company-details.component.html',
  providers: [InsuranceCompanyService, CompaniesService, ValidationService, MainOfficesService, CompaniesInsurancesMainOfficeService, CompaniesInsurancesService]
})
export class InsuranceCompanyDetailsComponent implements OnInit {
  @ViewChild('form') form;
  @ViewChild('formMainOffice') formMainOffice;
  @ViewChild('dt') table : Table;
  insuranceId: string;
  isNewInsurance: boolean;
  insurance: Insurance = new Insurance();
  mainOffices: MainOffice[] = new Array();
  mainOffice: MainOffice = null;
  companyInsuranceMainOffice: CompanyInsuranceMainOffice = new CompanyInsuranceMainOffice();
  companyInsuranceMainOffices: CompanyInsuranceMainOffice[] = new Array();
  companyInsurance: CompanyInsurance = null;
  public validationErrors: any;
  companyId: number;
  showTable: boolean;
  showForm: boolean;
  mainOfficesCopy: MainOffice[] = new Array();
  companyInsuranceMainOfficeEdited: CompanyInsuranceMainOffice = new CompanyInsuranceMainOffice();
  constructor(private route: ActivatedRoute,
    private insuranceCompanyService: InsuranceCompanyService,
    private location: Location,
    private validationService: ValidationService,
    private notificationService: NotificationsService,
    private mainOfficeService: MainOfficesService,
    private companiesInsurancesMainOfficesService: CompaniesInsurancesMainOfficeService,
    private tokenStorage: TokenStorage,
    private companyInsuranceService: CompaniesInsurancesService,
    private router : Router) {
    this.companyId = this.tokenStorage.getCompanyId();
    this.insuranceId = this.route.snapshot.paramMap.get("id");
    this.isNewInsurance = this.insuranceId == "0";

    if (!this.isNewInsurance) {
      this.insuranceCompanyService.FindById(this.insuranceId).then(x => {
        if (x != null) {
          this.insurance = x;
          this.companiesInsurancesMainOfficesService.FindActiveMainOffices(this.companyId.toString(), this.insurance.Id.toString()).then(z => {
            if (z != null) {
              this.companyInsuranceMainOffices = z.sort((a,b)=>{
                return (a.MainOfficeName.localeCompare(b.MainOfficeName,environment.defaultLanguage));
              });
            }
            this.mainOfficeService.FindAllActive().then(y => {
              if (y != null) {
                this.mainOffices = y.sort((a,b)=>{
                  return (a.Name.localeCompare(b.Name,environment.defaultLanguage));
                });
                this.mainOfficesCopy = Object.assign([], this.mainOffices);
                if (this.companyInsuranceMainOffices.length != 0)
                  this.refreshLists(this.mainOffices, this.companyInsuranceMainOffices);
              }

            })
          })
        }
        this.showTable = true;
        this.showForm = true;
      })
    }
    else {
      this.mainOfficeService.FindAllActive().then(y => {
        if (y != null) {
          this.mainOffices = y;
          this.mainOfficesCopy = Object.assign([], this.mainOffices);
        }
      })
    }
  }
  ngOnInit() { }

  refreshLists(activeItemsList, existitemsList) {
    existitemsList.forEach(element => {
      activeItemsList.splice(activeItemsList.findIndex(x => x.Id == element.MainOfficeId), 1);
    });
  }

  back() {
    this.location.back();
  }

  add(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    else {
      this.insurance.IsActive = true;
      this.insuranceCompanyService.Save(this.insurance).then(x => {
        if (x != null) {
          this.insurance = x;
          if (this.isNewInsurance) {
            let companyInsurance = new CompanyInsurance();
            companyInsurance.CompanyId = this.companyId;
            companyInsurance.InsuranceId = this.insurance.Id;
            companyInsurance.IsActive = true;
            this.companyInsuranceService.PostCompanyInsurance(this.companyId.toString(), companyInsurance).then(y => {
              if (y != null) {
                this.companyInsurance = companyInsurance;
                this.showTable = true;
                this.showForm = true;
              }
            })
            this.notificationService.success("INSURANCE_COMPANY_INFO", "ADDED_SUCCESSFULLY");
          }
          else {
            this.notificationService.success("INSURANCE_COMPANY_INFO", "UPDATED_SUCCESSFULLY");
          }
        }
      })
    }
  }

  addMainOffice(formMainOffice: FormGroup) {
    this.validationErrors = {}
    if (formMainOffice.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(formMainOffice);
    }
    else {
      this.companyInsuranceMainOffice.CompanyId = this.tokenStorage.getCompanyId();
      this.companyInsuranceMainOffice.InsuranceId = this.insurance.Id;
      this.companyInsuranceMainOffice.IsActive = true;
      this.companiesInsurancesMainOfficesService
        .PostMainOffice(this.companyInsuranceMainOffice.CompanyId.toString(), this.companyInsuranceMainOffice.InsuranceId.toString(), this.companyInsuranceMainOffice)
        .then(x => {
          if (x != null) {
            this.companyInsuranceMainOffices.push(x);
            this.mainOffices.splice(this.mainOffices.findIndex(y => y.Id == x.MainOfficeId), 1);
            this.notificationService.success("MAIN_OFFICE_INFO", "ADDED_SUCCESSFULY");
            this.table.reset();
          }
          this.formMainOffice.resetForm();
        })

    }

  }
  onDelete(event) {
    if (event != null) {
      let item = this.companyInsuranceMainOffices.find(x => x.MainOfficeId == event);
      item.IsActive = false;
      this.companiesInsurancesMainOfficesService.UpdateMainOffice(this.companyId.toString(), this.insurance.Id, item).then(x => {
        this.companyInsuranceMainOffices.splice(this.companyInsuranceMainOffices.findIndex(z => z.MainOfficeId == event), 1);
        this.mainOffices.push(this.mainOfficesCopy.find(y => y.Id == x.MainOfficeId));
        this.mainOffices.sort((a, b) => {
          return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
        })
        this.notificationService.success("INSURANCE_COMPANIES", "DELETED_SUCCESSFULY");
        this.table.reset();
      })
    }
  }
  addAllMainOffices(){
      this.mainOffices.forEach(main=>{
        let companyInsuranceMainOffice = new CompanyInsuranceMainOffice();
        companyInsuranceMainOffice.CompanyId = this.tokenStorage.getCompanyId();
        companyInsuranceMainOffice.InsuranceId = this.insurance.Id;
        companyInsuranceMainOffice.IsActive = true;
        companyInsuranceMainOffice.MainOfficeId = main.Id;
        this.companiesInsurancesMainOfficesService.PostMainOffice(companyInsuranceMainOffice.CompanyId.toString(),
        companyInsuranceMainOffice.InsuranceId.toString(),companyInsuranceMainOffice).then(x=>{
          if(x!=null){
            this.companyInsuranceMainOffices.push(x);
            this.mainOffices.splice(this.mainOffices.findIndex(y => y.Id == x.MainOfficeId), 1);
            this.table.reset();
          }
        })
      })
      this.notificationService.success("MAIN_OFFICE_INFO", "ADDED_SUCCESSFULY");
  }

  editMainOfficeNetto(x : CompanyInsuranceMainOffice){
  let mainOffice = new CompanyInsuranceMainOffice();
  mainOffice.CompanyId = x.CompanyId;
  mainOffice.InsuranceId = x.InsuranceId;
  mainOffice.MainOfficeId = x.MainOfficeId;
  mainOffice.Netto = x.Netto;
  this.companiesInsurancesMainOfficesService.UpdateMainOfficeDetails(mainOffice.CompanyId.toString(),mainOffice.InsuranceId.toString(),mainOffice.MainOfficeId.toString(),mainOffice).then(x=>{
    if(x != null){
      this.companyInsuranceMainOfficeEdited =x;
      return;
    }
  })
  }
}

