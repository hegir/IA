import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Gender } from "../../../enums/gender";
import { EnumValues } from "enum-values";
import { Local } from "protractor/built/driverProviders";
import { Location } from "@angular/common";
import { User } from "../../../models/user";
import { UsersService } from "../../../services/users.service";
import { RolesService } from "../../../services/roles.service";
import { Role } from "../../../models/role";
import { NotificationsService } from "../../../core/notifications.service";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { CitiesService } from "../../../services/cities.service";
import { City } from "../../../models/city";
import { isObject } from "util";
import { ViewChild } from '@angular/core'
import { ValidationService } from "../../../core/validation.service";
import { TranslateService } from "@ngx-translate/core";
import { UserStatus } from "../../../enums/userStatus";
import { CompaniesService } from "../../../services/companies.service";
import { Company } from "../../../models/company";
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS } from "@angular/material";
import { TokenStorage } from "../../../core/tokenstorage.service";
import { MainOfficesService } from "../../../services/main-offices.service";
import { id } from "@swimlane/ngx-datatable/release/utils";
import { MainOffice } from "../../../models/mainOffice";
import { UserMainOffice } from "../../../models/userMainOffice";
import { UsersMainOfficesService } from "../../../services/users-main-office.service.";
import { environment } from "../../../../environments/environment";
import { DialogService } from "primeng/api";
import { UserChangePasswordComponent } from "../changePassword/user-change-password/user-change-password.component";
import { ArniAutoCompleteComponent } from "../../../autocomplete/autocomplete.component";
import { Table } from "primeng/table";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { Moment } from "moment";
import * as moment from 'moment';
import { TechnicalInspection } from "../../../models/technicalInspection";
import { UserTechnicalInspection } from "../../../models/userTechnicalInspection";
import { UserTechnicalInspectionsService } from "../../../services/user-technical-inspections.service";
import { Insurance } from "../../../models/insuranceCompany";
import { InsuranceCompanyService } from "../../../services/insurance-companies.service";
import { TechnicalInspectionService } from "../../../services/technical-inspection.service";
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY.',
  },
  display: {
    dateInput: 'DD.MM.YYYY.',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: "app-users-details",
  templateUrl: "./users-details.component.html",
  providers: [UsersService, RolesService, InsuranceCompanyService, TechnicalInspectionService, CitiesService, ValidationService, CompaniesService, MainOfficesService, UsersMainOfficesService,UserTechnicalInspectionsService ,DialogService,
    { provide: DateAdapter, useClass: MomentDateAdapter }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class UsersDetailsComponent implements OnInit {
  @ViewChild('form') form;
  @ViewChild('formMainOffice') formMainOffice;
  @ViewChild('formTechnicalInspection') formTechnicalInspection;
  @ViewChild('citiesComponent') citiesComponent: ArniAutoCompleteComponent<City>
  @ViewChild('dt1') table : Table;
  @ViewChild('dt2') table2 : Table;

  validationErrors: any;
  userTechnicalInspectionId:number;
  userMainOfficeId: number;
  isNewUser: boolean = false;
  hide = true;
  user: User = new User();
  users: User[] = new Array();
  userId: string;
  roles: Role[] = new Array();
  role: Role = new Role();
  filteredCities: Observable<User[]>;
  cities: City[] = new Array();
  city: City = null;
  resuls: any[];
  selectedCompany: Company;
  companies: Company[] = new Array();
  technicalInspections:TechnicalInspection[]=new Array();
  technicalInspection:TechnicalInspection=null;
  userTechnicalInspection:UserTechnicalInspection=new UserTechnicalInspection();
  userTechnicalInspections:UserTechnicalInspection[]=new Array();
  mainOffices: MainOffice[] = new Array();
  mainOffice: MainOffice = null;
  mainOfficesCopy: MainOffice[] = new Array();
  userMainOffice: UserMainOffice = new UserMainOffice();
  userMainOffices: UserMainOffice[] = new Array();
  showMainOffices: boolean = false;
  isAgent: boolean = false;
  selectedCity: City = null;
  passValue : string;
  insurances:Insurance[]=new Array();
  insuranceId:number;
  price:number;

  @ViewChild('picker') picker: MatDatepicker<Date>;

  public Genders = EnumValues.getNamesAndValues(Gender);
  public userStatus = EnumValues.getNamesAndValues(UserStatus);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private usersService: UsersService,
    private rolesService: RolesService,
    private notificationService: NotificationsService,
    private citiesService: CitiesService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router,
    private technicalInspectionService:TechnicalInspectionService,
    private insuranceCompanyService:InsuranceCompanyService,
    private mainOfficesService: MainOfficesService,
    private usersMainOfficesService: UsersMainOfficesService,
    private userTechnicalInspectionService:UserTechnicalInspectionsService,
    private companiesService: CompaniesService,
    private tokenStorage: TokenStorage,
    private dialogService: DialogService,
  ) {
    this.isAgent = this.tokenStorage.getUserPermissions().find(x => x == 'P_AGENT_PROFILE') == 'P_AGENT_PROFILE';
    this.userId = this.route.snapshot.paramMap.get("id");
    this.isNewUser = this.userId == "0";
    if (!this.isNewUser) {
      this.usersService.FindById(this.userId).then((x => {
        this.user = x;
        this.citiesService.Find().then(y => {
          if (y != null) {
            this.cities = y.sort((a, b) => {
              return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
            });
            this.selectedCity = this.cities.find(z => z.Id == x.CityId);
          }
          this.rolesService.Find().then((x) => {
            if (x != null) {
              this.roles = x;
            }

            this.insuranceCompanyService.Find().then(ins=>{
              if(ins!=null){
                this.insurances=ins;
              }
            });

            this.technicalInspectionService.Find().then(tc=>{
              if(tc!=null){
                this.technicalInspections=tc;
              }
            });

            this.mainOfficesService.FindAllActive().then(u => {
              if (u != null) {
                this.mainOffices = u.sort((a, b) => {
                  return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
                });
                this.mainOfficesCopy = Object.assign([], this.mainOffices);
              }
              this.usersMainOfficesService.FindAllMainOffices(this.user.Id.toString()).then(k => {
                if (k != null) {
                  this.userMainOffices = k.sort((a,b) => {
                    return (a.MainOfficeName.localeCompare(b.MainOfficeName,environment.defaultLanguage))
                  });;
                  if (this.userMainOffices.length > 0) {
                    this.refreshLists(this.mainOffices, this.userMainOffices);
                  }
                }
              });
              this.usersService.FindAllTechnicalInspectionsInsurancesForUser(this.user.Id.toString()).then(k => {
                if (k != null) {
                  this.userTechnicalInspections = k.sort((a,b) => {
                    return (a.TechnicalInspection.localeCompare(b.TechnicalInspection,environment.defaultLanguage))
                  });
                }
              });
            });
          });
        });
      }));
      this.showMainOffices = true;
    }
    else {
      this.citiesService.Find().then(x => {
        if (x != null) {
          this.cities = x.sort((a, b) => {
            return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
          });
        }

        this.rolesService.Find().then((x) => {
          if (x != null) {
            this.roles = x;
          }
          this.insuranceCompanyService.Find().then(ins=>{
            if(ins!=null){
              this.insurances=ins;
            }
          });

          this.technicalInspectionService.Find().then(tc=>{
            if(tc!=null){
              this.technicalInspections=tc;
            }
          });

          this.mainOfficesService.FindAllActive().then(u => {
            if (u != null) {
              this.mainOffices = u.sort((a, b) => {
                return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
              });
              this.mainOfficesCopy = Object.assign([], this.mainOffices);
            }
          })
        });
      })
    }
  }

  ngOnInit() {
  }
  showPicker(): void {
    this.picker.open();
  }
  onSelectedCityChanged(event) {
    if (event == null || event == '')
      return;
    if (isObject(event)) {
      this.selectedCity = event;
      this.user.CityId = this.selectedCity.Id;
    }
    else {
      this.selectedCity = null;
      this.user.CityId = null;
    }
  }


  refreshLists(activeItemsList, existitemsList) {
    existitemsList.forEach(element => {
      activeItemsList.splice(activeItemsList.findIndex(x => x.Id == element.MainOfficeId), 1);
    });
  }

  generatePassword() {
    let password = '';
    var  charsetAlphabet = "abcdefghijklmnopqrstuvwxyz";
    password += charsetAlphabet.charAt(Math.floor(Math.random() * charsetAlphabet.length));
    password += charsetAlphabet.charAt(Math.floor(Math.random() * charsetAlphabet.length)).toUpperCase();
    var charsetNumbers = "0123456789";
    password += charsetNumbers.charAt(Math.floor(Math.random() * charsetNumbers.length));
    var charsetSpecialCharacter = "!@#$%^&*()-_=+{};:,.>";
    password += charsetSpecialCharacter.charAt(Math.floor(Math.random() * charsetSpecialCharacter.length));

    var length = 5,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+{};:,.>";
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    this.user.Password=password;
  }

  back() {
    this.location.back();
  }
  changePassword() {
    const ref = this.dialogService.open(UserChangePasswordComponent, {
      header: this.translateService.instant("CHANGE_PASSWORD"),
      styleClass: 'popup-change-password',
      dismissableMask: true,
      data: {}
    });

    ref.onClose.subscribe(() => {
    });
  }

  save(form: FormGroup) {
    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);
    }
    if (this.citiesComponent.autocompleteControl.value == null || this.citiesComponent.autocompleteControl.value == "") {
      this.validationErrors["CityId"] = new Array();
      this.validationErrors["CityId"].push(this.translateService.instant("REQUIRED_FIELD"));
    } else if (!isObject(<City>this.citiesComponent.autocompleteControl.value)) {
      this.validationErrors["CityId"] = new Array();
      this.validationErrors["CityId"].push(this.translateService.instant("NOT_VALID_FIELD"));
    }
    if (Object.keys(this.validationErrors).length > 0)
      return;
    this.user.CompanyId = this.tokenStorage.getCompanyId();
    this.usersService.Save(this.user).then((x) => {
      if (x != null) {
        this.user = x;
        this.showMainOffices = true;
        if(this.showMainOffices && this.isNewUser){
          this.mainOffices.forEach(office => {
            this.userMainOffice = new UserMainOffice();
            this.userMainOffice.UserId = this.user.Id;
            this.userMainOffice.MainOfficeId = office.Id;
            this.userMainOffice.MainOfficeName = office.Name;
            this.usersMainOfficesService.PostUserMainOffice(this.user.Id.toString(), this.userMainOffice).then(x => {
              if (x != null) {
                this.userMainOffices.push(x);
                if (this.userMainOffices.length > 0) {
                  this.refreshLists(this.mainOffices, this.userMainOffices);
                  this.table.reset();
                }
              }
            })
          })
        }
        if (this.isNewUser){
          this.notificationService.success("MAIN_OFFICE", "ADDED_SUCCESSFULLY");
          this.notificationService.success("USERS", "ADDED_SUCCESSFULLY");
        }
        else
          this.notificationService.success("USERS", "UPDATED_SUCCESSFULLY");
        this.showMainOffices = true;
      }
    });
  }

  addMainOffice(formMainOffice: FormGroup) {
    this.validationErrors = {};
    if (formMainOffice.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(formMainOffice);
    }
    else {
      this.userMainOffice.UserId = this.user.Id;
      this.userMainOffice.MainOfficeId = this.userMainOfficeId;
      this.usersMainOfficesService.PostUserMainOffice(this.user.Id.toString(), this.userMainOffice).then(x => {
        if (x != null) {
          this.userMainOffices.push(x);
          this.mainOffices.splice(this.mainOffices.findIndex(y => y.Id == x.MainOfficeId), 1);
          this.notificationService.success("MAIN_OFFICE_INFO", "ADDED_SUCCESSFULY");
        }
        this.formMainOffice.resetForm();
      })
    }
  }

  addTechnicalInspection(formTechnicalInspection: FormGroup) {
    this.validationErrors = {};
    if (formTechnicalInspection.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(formTechnicalInspection);
    }
    else {
      this.userTechnicalInspection.UserId = this.user.Id;
      this.userTechnicalInspection.TechnicalInspectionId = this.userTechnicalInspectionId;
      this.userTechnicalInspection.InsuranceId=this.insuranceId;
      this.userTechnicalInspection.Price=this.price;
      this.insuranceCompanyService.FindById(this.insuranceId.toString()).then(ins=>{
        if(ins!=null){
          this.userTechnicalInspection.Insurance=ins.Name;
        }
      });
      this.technicalInspectionService.FindById(this.userTechnicalInspectionId.toString()).then(ti=>{
        if(ti!=null){
          this.userTechnicalInspection.TechnicalInspection=ti.Name;
        }
      });
      this.userTechnicalInspectionService.PostUserTechnicalInspection(this.user.Id.toString(),this.userTechnicalInspectionId.toString(),this.insuranceId.toString(), this.userTechnicalInspection).then(x => {
        if (x != null) {
          this.userTechnicalInspections.push(x);
          this.table2.reset();
          this.notificationService.success("TECHNICAL_INSPECTION_WITHOUT_BAM", "ADDED_SUCCESSFULY");
        }
        this.formTechnicalInspection.resetForm();
      });
    }
  }

  onDelete(event) {
    if (event != null) {
      let item = this.userMainOffices.find(x => x.MainOfficeId == event);
      this.usersMainOfficesService.DeleteMainOffice(item.UserId.toString(), item.MainOfficeId.toString()).then(x => {
        if (x != null) {
          this.userMainOffices.splice(this.userMainOffices.findIndex(y => y.MainOfficeId == event), 1);
          this.mainOffices.push(this.mainOfficesCopy.find(z => z.Id == item.MainOfficeId));
          this.mainOffices.sort((a, b) => {
            return (a.Name.localeCompare(b.Name, environment.defaultLanguage));
          })
          this.notificationService.success("MAIN_OFFICE", "DELETED_SUCCESSFULY");
        }
      })
    }
  }
  chosenMonthHandler(datepicker: MatDatepicker<Moment>) {
    this.user.BirthDate = moment(this.user.BirthDate).toDate();
    datepicker.close()
  }
  showDatePicker(picker : MatDatepicker<Moment>){
    picker.open();
  }
}
