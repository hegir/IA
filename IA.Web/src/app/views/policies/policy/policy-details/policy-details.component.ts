import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Location, formatDate } from "@angular/common";
import { PolicyService } from "../../../../services/policy.service";
import { ValidationService } from "../../../../core/validation.service";
import { TranslateService } from "@ngx-translate/core";
import { NotificationsService } from "../../../../core/notifications.service";
import { Policy } from "../../../../models/policy";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { VehicleService } from "../../../../services/vehicle.service";
import { EnumValues } from "enum-values";
import { VehicleType } from "../../../../enums/vehicleType";
import { DateFormatPipe } from "../../../../shared/pipes/dateformat.pipe";
import { DateAdapter, MatDatepicker, MatSelectChange, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import {
  MatStepper
} from "@angular/material";
import { PolicyVehicle } from "../../../../models/vehicle";
import { InsuranceTypes } from "../../../../enums/insuranceType";
import { GreenCard } from "../../../../models/greenCard";
import { GreenCardService } from "../../../../services/green-card.service";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../../../dateformat/format-datepicker";
import { User } from "../../../../models/user";
import { PolicyHolder } from "../../../../models/policyHolder";
import { PolicyHolderService } from "../../../../services/policy-holder.service";
import { ArniAutoCompleteComponent } from "../../../../autocomplete/autocomplete.component";
import { isObject } from "util";
import { CitiesService } from "../../../../services/cities.service";
import { City } from "../../../../models/city";
import { InsuranceCompanyService } from "../../../../services/insurance-companies.service";
import { UsersService } from "../../../../services/users.service";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { MomentUtcDateAdapter } from "../../../../dateformat/momentutcdateformat";
import { PolicyNumber } from "../../../../models/policyNumber";
import { PolicyNumberService } from "../../../../services/policy-number.service";
import { Insurance } from "../../../../models/insuranceCompany";
import { TokenStorage } from "../../../../core/tokenstorage.service";
import { VehicleTypeModelService } from "../../../../services/vehicle-type-model.service";
import { VehicleTypeModel } from "../../../../models/vehicleTypeModel";
import { VehicleTypeModelComponent } from "../../../vehicle-type-model/vehicle-type-model.component";
import { DialogService } from "primeng/api";
import { GreenCardLogService } from "../../../../services/green-card-logs.service";
import { GreenCardLog } from "../../../../models/greenCardLog";
import { GreenCardComponent } from "../../../green-card/green-card.component";
import { UsersMainOfficesService } from "../../../../services/users-main-office.service.";
import { MainOffice } from "../../../../models/mainOffice";
import { UserMainOffice } from "../../../../models/userMainOffice";
import { environment } from "../../../../../environments/environment";
import { InsuranceTypesService } from "../../../../services/insurance-types.service";
import { InsuranceType } from "../../../../models/insuranceTypes";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { MainOfficesService } from "../../../../services/main-offices.service";
import { PolicyHolderLog } from "../../../../models/policyHolderLog";
import { PolicyHolderLogService } from "../../../../services/policy-holder-logs.service";
import { TechnicalInspectionComponent } from "../../../technical-inspection/technical-inspection.component";
import { TechnicalInspectionService } from "../../../../services/technical-inspection.service";
import { ColorService } from "../../../../services/colors.service";
import { Color } from "../../../../models/color";
import { TechnicalInspection } from "../../../../models/technicalInspection";
import { FuelType } from "../../../../enums/fuelType";
import { RegistrationType } from "../../../../enums/registrationType";
import { Voucher } from "../../../../models/voucher";
import { Partner } from "../../../../models/partner";
import { PartnerService } from "../../../../services/partners.service";
import { VoucherService } from "../../../../services/vouchers.service";
import { Moment } from "moment";
import * as moment from 'moment';
import { NewColorComponent } from "../../../new-color/new-color.component";
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
import { PolicyLog } from "../../../../models/policyLog";
import { PolicyLogService } from "../../../../services/policy-logs.service";
import { NgxPermissionsService } from "ngx-permissions";
import { LazyLoadEvent } from 'primeng/api';
import { PolicyLogDataDto } from "../../../../dtos/policyLogDataDto";
import { UserTechnicalInspectionsService } from "../../../../services/user-technical-inspections.service";
import { UserTechnicalInspection } from "../../../../models/userTechnicalInspection";
import { PolicyHolderType } from "../../../../enums/policyHolderType";


@Component({
  selector: "app-policy-details",
  templateUrl: "./policy-details.component.html",
  providers: [
    PolicyService,
    GreenCardService,
    GreenCardLogService,
    UsersService,
    VehicleService,
    PolicyHolderService,
    PolicyNumberService,
    DateFormatPipe,
    ValidationService,
    CitiesService,
    DialogService,
    PolicyHolderLogService,
    InsuranceTypesService,
    UsersMainOfficesService,
    VehicleTypeModelService,
    MainOfficesService,
    TechnicalInspectionService,
    ColorService,
    PartnerService,
    VoucherService,
    UserTechnicalInspectionsService,
    InsuranceCompanyService,
     { provide: MAT_DATE_LOCALE, useValue: environment.datePickerLocale },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
})
export class PolicyDetailsComponent implements OnInit {
  policy: Policy = new Policy();
  greenCard: GreenCard = new GreenCard();
  vehicle: PolicyVehicle = new PolicyVehicle();
  id: string;
  action: string;
  users: User[] = new Array();
  validationErrors: any;
  cities: City[] = new Array();
  isNewType: boolean = true;
  policyNumbers: PolicyNumber[] = new Array();
  policyNumber: PolicyNumber = null;
  policyHolder: PolicyHolder = new PolicyHolder();
  isCarInsurance: boolean = false;
  selectedPolicyHolder: PolicyHolder = null;
  selected: boolean = false;
  fullName: string;
  policyHolders: PolicyHolder[] = new Array();
  insuranceCompanies: Insurance[] = new Array();
  actionDate: Date = new Date();
  user: User = new User();
  activePolicyNumbers: PolicyNumber[] = new Array();
  editGreenCard: User[] = new Array();
  isNewGreenCard: boolean = false;
  historyOfGreenCards: GreenCardLog[] = new Array();
  greenCardNumber: string;
  noGreenCard: boolean = false;
  selectedPolicyNumber: PolicyNumber = new PolicyNumber();
  selectedInsurance: Insurance = new Insurance();
  vehicleInsurance: boolean = false;
  copyVehicle: PolicyVehicle = new PolicyVehicle();
  copyGreenCard: GreenCard = new GreenCard();
  vehicleTypesModels: VehicleTypeModel[] = new Array();
  selectedVehicleTypeModel: VehicleTypeModel = new VehicleTypeModel();
  existingVehiclesOfPolicyHolder: PolicyVehicle[] = new Array();
  allVehicles:PolicyVehicle[]=new Array();
  allVehiclesInInsurance: PolicyVehicle[] = new Array();
  existVehicle: boolean = false;
  changeVehicle: boolean = false;
  existingVehicle: PolicyVehicle = null;
  disableFieldsForVehicle: boolean = false;
  oldNumber: string;
  greenCardLog: GreenCardLog = new GreenCardLog();
  disablePolicyHolderFields: boolean = false;
  greenCardHistoryView: boolean = false;
  userForLogs: User = new User();
  failedAdd: boolean = false;
  showPercent: boolean = false;
  greenCardsHistory: GreenCard[] = new Array();
  disableInsurance: boolean = false;
  selectedCity: City = new City();
  greenCards: GreenCard[] = new Array();
  updatedGreenCard: boolean = false;
  disableVehicleFields: boolean = false;
  policies: Policy[] = new Array();
  year: number;
  rateControl: FormControl = null;
  selectedValue: PolicyVehicle = null;
  userMainOffices: UserMainOffice[] = new Array();
  userId: string;
  insuranceTypes: InsuranceType[] = new Array();
  selectedInsuranceType: InsuranceType = new InsuranceType();
  isAdmin: boolean = false;
  mainOffice: MainOffice = new MainOffice();
  completedStep: boolean = false;
  policyHolderLog: PolicyHolderLog = new PolicyHolderLog();
  selectedTechnicalInspection: TechnicalInspection = new TechnicalInspection();
  technicalInspections: TechnicalInspection[] = new Array();
  selectedColor: Color = null;
  colors: Color[] = new Array();
  selectedSupplier: User = null;
  agents: User[] = new Array();
  greenCardsForAgent: GreenCard[] = new Array();
  selectedGreenCard: GreenCard = new GreenCard();
  adminTechnicalInspection: TechnicalInspection = new TechnicalInspection();
  defaultSelectedGreenCard: GreenCard = new GreenCard();
  defaultSelectedTechnicalInspection:TechnicalInspection=new TechnicalInspection();
  disablePolicyNumbers:boolean=true;
  haveVehicles:boolean=false;
  vouchers:Voucher[]=new Array();
  partners:Partner[]=new Array();
  selectedPartner:Partner=new Partner();
  disableVouchers:boolean=true;
  selectedVoucher:Voucher=new Voucher();
  step1:boolean=false;
  step2:boolean=false;
  step3:boolean=false;
  step4:boolean=false;
  step5:boolean=false;
  paymentMethods:Array<string>=['BON','GOTOVINA'];
  selectedPaymentMethod:string;
  showVoucher:boolean=false;
  showTotal:boolean=false;
  linear:boolean=false;
  showDunavInsuranceNumbers:boolean=false;
  todayDate:Date;
  haveProblem:boolean=true;
  voucherNumber:string;
  policyLog:PolicyLog=new PolicyLog();
  policyLogs:PolicyLog[]=new Array();
  enableFieldsForUpdate:boolean=false;
  policyLogExpand:PolicyLog=new PolicyLog();
  oldValues:PolicyLogDataDto=new PolicyLogDataDto();
  newValues:PolicyLogDataDto=new PolicyLogDataDto();
  policyLogsForDetails:PolicyLogDataDto[]=new Array();
  policyLogExpandData:PolicyLogDataDto=new PolicyLogDataDto();
  oldDataExpand:PolicyLogDataDto=new PolicyLogDataDto();
  sameDateBeg:boolean=false;
  sameDateEx:boolean=false;
  dataView:boolean=false;
  userTechnicalInspection:UserTechnicalInspection=new UserTechnicalInspection();



  @ViewChild("form") form;

  @ViewChild("createdDatePicker") createdDatePicker: MatDatepicker<Date>;
  @ViewChild("beginPicker") beginPicker: MatDatepicker<Date>;
  @ViewChild("expirationDatePicker") expirationDatePicker: MatDatepicker<Date>;


  @ViewChild("policyHoldersComponent")
  PolicyHoldersComponent: ArniAutoCompleteComponent<PolicyHolder>;
  @ViewChild("insuranceTypesComponent")
  InsuranceTypesComponent: ArniAutoCompleteComponent<InsuranceType>;
  @ViewChild("vehicleTypeModelComponent")
  VehicleTypeModelComponent: ArniAutoCompleteComponent<VehicleTypeModel>;
  @ViewChild("cityComponent")
  CitiesComponent: ArniAutoCompleteComponent<City>;
  @ViewChild("vehiclesComponent")
  PolicyVehiclesComponent: ArniAutoCompleteComponent<PolicyVehicle>;
  @ViewChild("technicalInspectionComponent")
  TechnicalInspectionComponent: ArniAutoCompleteComponent<TechnicalInspectionComponent>;
  @ViewChild("adminTechnicalInspectionComponent")
  AdminTechnicalInspectionComponent: ArniAutoCompleteComponent<TechnicalInspectionComponent>;
  @ViewChild("colorComponent")
  ColorComponent: ArniAutoCompleteComponent<Color>;
  @ViewChild("userComponent")
  UserComponent: ArniAutoCompleteComponent<User>;
  @ViewChild("greenCardComponent")
  GreenCardComponent: ArniAutoCompleteComponent<GreenCard>;
  @ViewChild("partnerComponent")
  PartnerComponent: ArniAutoCompleteComponent<Partner>;
  @ViewChild("voucherComponent")
  VoucherComponent: ArniAutoCompleteComponent<Voucher>;
  @ViewChild("stepper")
  stepper: MatStepper;

  public VehicleTypes = EnumValues.getNamesAndValues(VehicleType);
  public InsuranceTypes = EnumValues.getNamesAndValues(InsuranceTypes);
  public RegistrationTypes = EnumValues.getNamesAndValues(RegistrationType);
  public FuelTypes = EnumValues.getNamesAndValues(FuelType);
  public policyHolderType = EnumValues.getNamesAndValues(PolicyHolderType);

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private insuranceTypeService: InsuranceTypesService,
    private policyService: PolicyService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private policyNumberService: PolicyNumberService,
    private notificationService: NotificationsService,
    private vehicleService: VehicleService,
    private greenCardsService: GreenCardService,
    private citiesService: CitiesService,
    private policyHolderService: PolicyHolderService,
    private vehicleTypeModelService: VehicleTypeModelService,
    private insuranceCompanyService: InsuranceCompanyService,
    private greenCardLogService: GreenCardLogService,
    private userService: UsersService,
    private tokenStorage: TokenStorage,
    private technicalInspectionService: TechnicalInspectionService,
    private colorService: ColorService,
    private mainOfficeService: MainOfficesService,
    private dialogService: DialogService,
    private partnerService:PartnerService,
    private voucherService:VoucherService,
    private policyHolderLogService: PolicyHolderLogService,
    private usersMainOfficesService: UsersMainOfficesService,
    private policyLogService:PolicyLogService,
    private userTechnicalInspectionService:UserTechnicalInspectionsService,
    private permissionService : NgxPermissionsService,
    private dateFormat: DateFormatPipe
  ) {
    this.id = this.route.snapshot.paramMap.get("id");
    this.isNewType = this.id == "0";

    if(this.isNewType)
      this.enableFieldsForUpdate=true;
    else
      this.enableFieldsForUpdate=false;

    this.todayDate=new Date();
    this.isAdmin = this.tokenStorage.getUserPermissions().find((x) => x == "P_POLICIES_ALL") == "P_POLICIES_ALL";

    var today = new Date();
    if(this.isNewType)
     this.policy.Created=today;

    this.year = today.getFullYear();
    this.rateControl = new FormControl("", Validators.max(this.year));

    if (!this.isAdmin) {
      var userId = this.tokenStorage.getUserId();
      this.usersMainOfficesService.FindAllMainOffices(userId).then((x) => {
        if (x != null) {
          this.userMainOffices = x.sort((a, b) => {
            return a.MainOfficeName.localeCompare(
              b.MainOfficeName,
              environment.defaultLanguage
            );
          });
          if (x.length > 0) {
            this.disableInsurance = false;
          } else this.disableInsurance = true;
        }
      });
    }
    this.greenCardsService.FindGreenCardsForAgent().then((gca) => {
      if (gca != null) {
        this.greenCardsForAgent = gca.sort((a, b) => {
          return a.Number.localeCompare(b.Number, environment.defaultLanguage);
        });
        this.defaultSelectedGreenCard.Id = 0;
        this.defaultSelectedGreenCard.Number = this.translateService.instant("NO_GRENN_CARD");
        this.defaultSelectedGreenCard.Price = 0;
        this.greenCardsForAgent.unshift(this.defaultSelectedGreenCard);
      }
    });

    this.citiesService.Find().then((y) => {
      if (y != null) {
        this.cities = y;
      }
    });

    this.insuranceTypeService.Find().then((it) => {
      if (it != null) {
        this.insuranceTypes = it.sort((a, b) => {
          return a.Label.localeCompare(b.Label, environment.defaultLanguage);
        });
      }
    });

    this.userService.Find().then((us) => {
      if (us != null) {
        this.agents = us.sort((a, b) => {
          return a.FirstName.localeCompare(
            b.FirstName,
            environment.defaultLanguage
          );
        });
      }
    });

    this.insuranceCompanyService.FindAllInsurancesWithActivePolicyNumbers().then((c) => {
        if (c != null) {
          this.insuranceCompanies = c;
          if (c.length > 0) {
            this.disableInsurance = false;
          } else this.disableInsurance = true;
        }
      });

      this.vehicleService.FindAllVehicles().then(veh=>{
        if(veh!=null){
          this.allVehiclesInInsurance=veh;
          if(this.allVehiclesInInsurance.length>0)
          this.haveVehicles=true;
          else
          this.haveVehicles=false;
        }
      });

    this.colorService.Find().then((col) => {
      if (col != null) {
        this.colors = col;
      }
    });

    this.technicalInspectionService.Find().then((ti) => {
      if (ti != null) {
        this.technicalInspections = ti.sort((a, b) => {
          return a.Name.toUpperCase().localeCompare(
            b.Name.toUpperCase(),
            environment.defaultLanguage
          );
        });
        this.defaultSelectedTechnicalInspection.Id=0;
        this.defaultSelectedTechnicalInspection.Name="Bez tehničkog pregleda";
        this.defaultSelectedTechnicalInspection.CityId=null;
        this.technicalInspections.unshift(this.defaultSelectedTechnicalInspection);
      }
    });

    this.policyNumberService.Find().then((pn) => {
      if (pn != null) {
        this.policyNumbers = pn;
      }
    });

    this.vehicleTypeModelService.Find().then((vtm) => {
      if (vtm != null) {
        this.vehicleTypesModels = vtm;
      }
    });

    if (!this.isNewType) {
      this.policyService.FindById(this.id).then((x) => {
        if (x != null) {
          this.policy = x;

          if (this.policy.Percent != null && this.policy.Percent > 0)
            this.showPercent = true;

          this.policyLogService.FindAllPolicyLogs(this.policy.Id).then(plp=>{
            if(plp!=null){
              this.policyLogs=plp;
            }
          });

          this.oldValues.Created=this.policy.Created;
          this.oldValues.PolicyExpiration=this.policy.PolicyExpiration;
          this.oldValues.PolicyBegin=this.policy.PolicyBegin;
          this.oldValues.Percent=this.policy.Percent;
          this.oldValues.PaymentMethod=this.policy.PaymentMethod;
          this.oldValues.CarAccidentCompensation=this.policy.CarAccidentCompensation;
          this.oldValues.Price=this.policy.Price;
          this.oldValues.TotalPremium=this.policy.TotalPremium;
          this.oldValues.Other=this.policy.Other;

          if (this.isAdmin) {
            this.mainOfficeService.FindById(this.policy.MainOfficeId.toString()).then((mo) => {
                if (mo != null) {
                  this.mainOffice = mo;
                }
              });
              if(this.policy.TechnicalInspectionId!=0){
                console.log(this.policy.UserId,this.policy.TechnicalInspectionId,this.policy.InsuranceId);
                this.userTechnicalInspectionService.FindById(this.policy.UserId.toString(),
                this.policy.TechnicalInspectionId.toString(),this.policy.InsuranceId.toString()).then(uti=>{
                  if(uti!=null){
                    this.userTechnicalInspection=uti;
                    this.policy.SecondMainTotal=this.userTechnicalInspection.Price;
                    var secondPercent=(this.policy.SecondMainTotal/this.policy.TotalPremium) * 100;
                    this.policy.SecondPercent = parseFloat(secondPercent.toFixed(2));
                    this.userService.FindById(this.userTechnicalInspection.UserId.toString()).then(usr=>{
                      if(usr!=null){
                        this.selectedSupplier=usr;
                        console.log(this.selectedSupplier);
                      }
                    });
                    this.technicalInspectionService.FindById(this.userTechnicalInspection.TechnicalInspectionId.toString()).then(tech=>{
                      if(tech!=null){
                        this.adminTechnicalInspection=this.technicalInspections.find(t=>t.Id==tech.Id);
                        console.log(this.adminTechnicalInspection);
                      }
                    });
                  }
                });
              }

              if(this.selectedSupplier==null){
                this.oldValues.Agent="BEZ PRIBAVLJAČA";
              }
            if (this.isAdmin && this.policy.SupplierId != null && this.policy.SupplierId != 0)
            {
              this.userService.FindById(this.policy.SupplierId.toString()).then((sup) => {
                  if (sup != null) {
                    this.selectedSupplier = sup;
                    this.selectedSupplier.FullName =
                      sup.FirstName + " " + sup.LastName;
                      this.oldValues.Agent=this.selectedSupplier.FirstName+" "+this.selectedSupplier.LastName;
                  }
                });
            }
          }

          this.insuranceCompanyService.Find().then((insu) => {
            if (insu != null) {
              this.insuranceCompanies = insu;
              this.policyNumberService.Find().then((ac) => {
                if (ac != null) {
                  this.activePolicyNumbers = ac;
                  this.selectedInsurance = this.insuranceCompanies.find((x) => x.Id == this.policy.InsuranceId);
                  this.insuranceTypeService.FindById(this.policy.InsuranceTypeId.toString()).then((it) => {
                      if (it != null) {
                        this.selectedInsuranceType = it;
                        this.oldValues.InsuranceType=this.selectedInsuranceType.Label+' '+this.selectedInsuranceType.Name;

                        if (this.selectedInsuranceType.Label === "10" || this.selectedInsuranceType.Label === "03")
                          this.isCarInsurance = true;
                        else
                          this.isCarInsurance = false;

                        if (this.selectedInsurance != null) {
                          if(this.selectedInsurance.Label=="DO")
                            this.showDunavInsuranceNumbers=true;
                          else
                            this.showDunavInsuranceNumbers=false;

                          this.selectedPolicyNumber = this.activePolicyNumbers.find((z) => z.Id == this.policy.PolicyNumberId);

                          if (this.isCarInsurance) {
                            this.vehicleService.FindById(this.policy.Id.toString()).then((v) => {
                                if (v != null) {
                                  this.vehicle = v;
                                  this.oldValues.VehicleType=this.vehicle.VehicleType;
                                  this.oldValues.LicensePlate=this.vehicle.LicensePlate;
                                  this.oldValues.ProductionYear=this.vehicle.ProductionYear.toString();
                                  this.oldValues.EngineDisplacement=this.vehicle.EngineDisplacement;
                                  this.oldValues.EnginePower=this.vehicle.EnginePower;
                                  this.oldValues.EngineNumber=this.vehicle.EngineNumber;
                                  this.oldValues.ChassisNumber=this.vehicle.ChassisNumber;
                                  this.oldValues.SeatsNumber=this.vehicle.SeatsNumber;
                                  this.oldValues.Fuel=this.vehicle.FuelType;

                          if(this.vehicle.MaxPermissibleMass!=null && this.vehicle.LoadCapacity!=null){
                                  this.oldValues.LoadCapacity=this.vehicle.LoadCapacity;
                                  this.oldValues.MaxPermissibleMass=this.vehicle.MaxPermissibleMass;
                                 }

                                  this.vehicleTypeModelService.FindById(this.vehicle.VehicleTypeModelId.toString()).then((vs) => {
                                      if (vs != null) {
                                        this.selectedVehicleTypeModel = vs;
                                        this.oldValues.VehicleTypeModel=this.selectedVehicleTypeModel.Type+' '+this.selectedVehicleTypeModel.Model;
                                      }
                                    });
                                  this.colorService.FindById(this.vehicle.ColorId.toString()).then((col) => {
                                      if (col != null) {
                                        this.selectedColor = col;
                                        this.selectedColor.Name = col.Name;
                                        this.oldValues.Color=this.selectedColor.Name;
                                      }
                                    });
                                }
                              });
                          }
                        }
                      }
                    });
                }
              });
            }
          });

          this.greenCardsService.FindGreenCardsForDetails().then((g) => {
            if (g != null) {
              this.greenCardsForAgent = g;
              this.defaultSelectedGreenCard.Id = 0;
              this.defaultSelectedGreenCard.Number = "Bez zelenog kartona";
              this.defaultSelectedGreenCard.Price = 0;
              this.greenCardsForAgent.unshift(this.defaultSelectedGreenCard);
              this.selectedGreenCard = this.greenCardsForAgent.find(
                (x) => x.Id == this.policy.GreenCardId
              );
              this.oldValues.GreenCard=this.selectedGreenCard.Number;
            }
          });
          this.technicalInspectionService.Find().then((tc) => {
            if (tc != null) {
              this.technicalInspections = tc;
              this.defaultSelectedTechnicalInspection.Id=0;
              this.defaultSelectedTechnicalInspection.Name="Bez tehničkog pregleda";
              this.defaultSelectedTechnicalInspection.CityId=null;
              this.technicalInspections.unshift(this.defaultSelectedTechnicalInspection);
              this.selectedTechnicalInspection = this.technicalInspections.find(
                (x) => x.Id == this.policy.TechnicalInspectionId
              );
              this.oldValues.TechnicalInspection=this.selectedTechnicalInspection.Name;
              if(this.policy.AdminTechnicalInspectionId==null){
                this.oldValues.AdminTechnicalInspection="BEZ TEHNIČKOG PREGLEDA";
              }
              if (
                this.isAdmin &&
                this.policy.AdminTechnicalInspectionId != null
              ) {
                this.adminTechnicalInspection = this.technicalInspections.find(
                  (y) => y.Id == this.policy.AdminTechnicalInspectionId
                );
                this.oldValues.AdminTechnicalInspection=this.adminTechnicalInspection.Name;
              }
            }
          });
          this.policyHolderLogService.FindById(this.policy.PolicyHolderLogId.toString()).then((phl) => {
              if (phl != null) {
                this.policyHolderLog = phl;

                this.policyHolderService.FindById(this.policy.PolicyHolderId.toString()).then((y) => {
                    if (y != null) {
                      this.policyHolder = y;
                      this.policyHolder.FirstName = phl.FirstName;
                      this.policyHolder.LastName = phl.LastName;
                      this.policyHolder.Address = phl.Address;
                      this.policyHolder.PersonalIdentificationNumber =phl.PersonalIdentificationNumber;
                      this.oldValues.FirstName=this.policyHolder.FirstName;
                      this.oldValues.LastName=this.policyHolder.LastName;
                      this.oldValues.Address=this.policyHolder.Address;
                      this.oldValues.CompanyName = this.policyHolder.CompanyName;
                      this.oldValues.PersonalIdentificationNumber=this.policyHolder.PersonalIdentificationNumber;
                      this.policyHolder.PersonalIdentificationNumber = phl.PersonalIdentificationNumber;
                      this.policyHolder.CityId = phl.CityId;
                      this.policyHolder.CompanyName = phl.CompanyName;
                      this.citiesService
                        .FindById(this.policyHolder.CityId.toString())
                        .then((c) => {
                          if (c != null) {
                            this.selectedCity = c;
                            this.selectedCity.CityNameMunicipalityCode =
                              c.Name + "" + "(" + c.MunicipalityCode + ")";
                              this.oldValues.City=this.selectedCity.CityNameMunicipalityCode;
                            this.selectedPolicyHolder = this.policyHolder;
                            this.selectedPolicyHolder.FullNameCityPIN =
                              this.selectedPolicyHolder.FirstName +
                              " " +
                              this.selectedPolicyHolder.LastName +
                              "-" +
                              "(" +
                              c.Name +
                              ")" +
                              "-" +
                              this.selectedPolicyHolder
                                .PersonalIdentificationNumber;

                            this.policy.PolicyHolderId = this.selectedPolicyHolder.Id;
                            this.policy.PolicyHolder = this.selectedPolicyHolder.FullNameCity;
                          }
                        });
                    }
                  });
              }
            });
        }
        if (this.policy.Percent != null && this.policy.Percent > 0)
        this.showPercent = true;

        if(this.policy.PaymentMethod!=null){
          for(let i=0;i<this.paymentMethods.length;i++){
            if(this.policy.PaymentMethod==this.paymentMethods[i]){
              this.selectedPaymentMethod=this.paymentMethods[i];
            }
          }
          if(this.policy.PaymentMethod=="BON"){
            this.showVoucher=true;
            this.partnerService.FindById(this.policy.PartnerId.toString()).then(prt=>{
              if(prt!=null){
                this.selectedPartner=prt;
                this.selectedPartner.Name=prt.Name;
              }
            });

            this.voucherService.FindById(this.policy.VoucherId.toString()).then(v=>{
              if(v!=null){
                this.selectedVoucher=v;
                this.voucherNumber=v.Number;
              }
            });
          }else
          this.showVoucher=false;

          if(this.policy.Percent==null)
          this.oldValues.Percent=0;
        else
          this.oldValues.Percent=this.policy.Percent;

        if(this.policy.MainTotal==null)
          this.oldValues.Total=0;
        else
          this.oldValues.Total=this.policy.MainTotal;

          if(this.policy.PaymentMethod=="GOTOVINA"){
            this.showTotal=true;

            if(this.policy.Percent==null)
              this.oldValues.Percent=0;
            else
              this.oldValues.Percent=this.policy.Percent;

            if(this.policy.MainTotal==null)
              this.oldValues.Total=0;
            else
              this.oldValues.Total=this.policy.MainTotal;
          }
          else
          this.showTotal=false;
        }
      });
    }
  }

  ngOnInit() {

  }

  back() {
    this.location.back();
  }

  rowExpand(event){
    this.policyLogService.FindById(event.data.Id).then(x=>{
      if(x != null){
        this.policyLogExpand = x;
        this.oldDataExpand=JSON.parse(this.policyLogExpand.OldValues);
        this.policyLogExpandData=JSON.parse(this.policyLogExpand.NewValues);
        console.log('row',this.policyLogExpandData);
      }
    });
  }

  validatePolicy() {
    if (!this.isNewType) {
      this.step1=true;
      this.stepper.selected.completed = true;
      this.stepper.next();
      return;
    }
    this.step1=false;
    this.stepper.selected.completed = false;
    this.validationErrors = {};

    if (this.policy.MainOfficeId == null) {
      this.validationErrors["MainOffice"] = new Array();
      this.validationErrors["MainOffice"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.selectedInsurance.Id == null || this.policy.InsuranceId == null) {
      this.validationErrors["Insurance"] = new Array();
      this.validationErrors["Insurance"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (this.selectedPolicyNumber.Id == null) {
      this.validationErrors["Number"] = new Array();
      this.validationErrors["Number"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.policy.InsuranceTypeId == null) {
      this.validationErrors["InsuranceType"] = new Array();
      this.validationErrors["InsuranceType"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.policy.GreenCardId == null) {
      this.validationErrors["GreenCard"] = new Array();
      this.validationErrors["GreenCard"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.policy.Created == null) {
      this.validationErrors["CreatedDate"] = new Array();
      this.validationErrors["CreatedDate"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.policy.Created>this.todayDate) {
      this.validationErrors["CreatedDate"] = new Array();
      this.validationErrors["CreatedDate"].push(
        this.translateService.instant("CREATED_DATE_BIGGER_THEN_DATE_NOW")
      );
    }

    if (this.policy.PolicyExpiration == null) {
      this.validationErrors["PolicyExpiration"] = new Array();
      this.validationErrors["PolicyExpiration"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (Object.keys(this.validationErrors).length > 0) {
      this.stepper.selected.completed = false;
      this.stepper.previous();
      return;
    }
    this.step1=true;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  validatePolicyHolder() {
    if (!this.isNewType) {
      this.step2=true;
      this.stepper.selected.completed = this.step2;
      this.stepper.next();
      return;
    }
    this.stepper.selected.completed=false;
    this.step2=false;
    this.stepper.selected.completed = false;
    this.validationErrors = {};

    if (this.selectedPolicyHolder == null) {
      if (
        this.policyHolder.Address == null ||
        this.policyHolder.Address == ""
      ) {
        this.validationErrors["Address"] = new Array();
        this.validationErrors["Address"].push(
          this.translateService.instant("REQUIRED_FIELD")
        );
      }
      if (this.CitiesComponent.autocompleteControl.value == null) {
        this.validationErrors["City"] = new Array();
        this.validationErrors["City"].push(
          this.translateService.instant("REQUIRED_FIELD")
        );
      } else if (
        !isObject(<City>this.CitiesComponent.autocompleteControl.value)
      ) {
        this.validationErrors["City"] = new Array();
        this.validationErrors["City"].push(
          this.translateService.instant("INVALID")
        );
      }
      if (
        this.policyHolder.PersonalIdentificationNumber == null ||
        this.policyHolder.PersonalIdentificationNumber == ""
      ) {
        this.validationErrors["PersonalIdentificationNumber"] = new Array();
        this.validationErrors["PersonalIdentificationNumber"].push(
          this.translateService.instant("REQUIRED_FIELD")
        );
      }
      if (this.policyHolder.PersonalIdentificationNumber.length !== 13) {
        this.validationErrors["PersonalIdentificationNumber"] = new Array();
        this.validationErrors["PersonalIdentificationNumber"].push(
          this.translateService.instant("INVALID_FORMAT")
        );
      }
    } else {
      if (
        this.policyHolder.Address == null ||
        this.policyHolder.Address == ""
      ) {
        this.validationErrors["Address"] = new Array();
        this.validationErrors["Address"].push(
          this.translateService.instant("REQUIRED_FIELD")
        );
      }
      if (this.CitiesComponent.autocompleteControl.value == null) {
        this.validationErrors["City"] = new Array();
        this.validationErrors["City"].push(
          this.translateService.instant("REQUIRED_FIELD")
        );
      } else if (
        !isObject(<City>this.CitiesComponent.autocompleteControl.value)
      ) {
        this.validationErrors["City"] = new Array();
        this.validationErrors["City"].push(
          this.translateService.instant("INVALID")
        );
      }
    }

    if (Object.keys(this.validationErrors).length > 0) {
      this.stepper.selected.completed = false;
      return;
    }
    this.step2=true;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  validateVehiclePolicy() {
    if (!this.isNewType) {
      this.step3=true;
      this.stepper.selected.completed = this.step3;
      this.stepper.next();
      return;
    }
    this.step3=false;
    this.stepper.selected.completed = false;

    this.validationErrors = {};

    if (this.vehicle.VehicleType == null) {
      this.validationErrors["VehicleType"] = new Array();
      this.validationErrors["VehicleType"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.VehicleTypeModelComponent.autocompleteControl.value == null) {
      this.validationErrors["VehicleTypeModel"] = new Array();
      this.validationErrors["VehicleTypeModel"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    } else if (
      !isObject(
        <VehicleTypeModel>(
          this.VehicleTypeModelComponent.autocompleteControl.value
        )
      )
    ) {
      this.validationErrors["VehicleTypeModel"] = new Array();
      this.validationErrors["VehicleTypeModel"].push(
        this.translateService.instant("INVALID_FORMAT")
      );
    }

    if (this.vehicle.LicensePlate == null) {
      this.validationErrors["LicensePlate"] = new Array();
      this.validationErrors["LicensePlate"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (this.vehicle.ProductionYear == null) {
      this.validationErrors["ProductionYear"] = new Array();
      this.validationErrors["ProductionYear"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    } else if (this.vehicle.ProductionYear > this.year.toString()) {
      this.validationErrors["ProductionYear"] = new Array();
      this.validationErrors["ProductionYear"].push(
        this.translateService.instant("INVALID_YEAR")
      );
    }
    if (this.vehicle.EnginePower == null) {
      this.validationErrors["EnginePower"] = new Array();
      this.validationErrors["EnginePower"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (this.vehicle.EngineDisplacement == null) {
      this.validationErrors["EngineDisplacement"] = new Array();
      this.validationErrors["EngineDisplacement"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (this.vehicle.SeatsNumber == null) {
      this.validationErrors["SeatsNumber"] = new Array();
      this.validationErrors["SeatsNumber"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (this.vehicle.ChassisNumber == null) {
      this.validationErrors["ChassisNumber"] = new Array();
      this.validationErrors["ChassisNumber"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (this.vehicle.EngineNumber == null) {
      this.validationErrors["EngineNumber"] = new Array();
      this.validationErrors["EngineNumber"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }

    if (Object.keys(this.validationErrors).length > 0) {
      this.stepper.selected.completed = false;
      return;
    }
    this.step3=true;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  validateFinancialExpenses() {
    if (!this.isNewType) {
      this.step4=true;
      this.stepper.selected.completed = true;
      this.stepper.next();
      return;
    }
    this.step4=false;
    this.stepper.selected.completed = false;

    this.validationErrors = {};
    if (this.policy.CarAccidentCompensation == null) {
      this.validationErrors["CarAccidentCompensation"] = new Array();
      this.validationErrors["CarAccidentCompensation"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (this.policy.Price == null) {
      this.validationErrors["Price"] = new Array();
      this.validationErrors["Price"].push(
        this.translateService.instant("REQUIRED_FIELD")
      );
    }
    if (Object.keys(this.validationErrors).length > 0) {
      this.stepper.selected.completed = false;
      return;
    }
    this.step4=true;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  validateFinalStep(){
    this.validationErrors={};


    if(this.PartnerComponent.autocompleteControl.value==null){
      this.validationErrors["Partner"] = new Array();
      this.validationErrors["Partner"].push(this.translateService.instant("REQUIRED_FIELD"));
    }
    else if (!isObject(<Partner>(this.PartnerComponent.autocompleteControl.value)))
    {
      this.validationErrors["Partner"] = new Array();
      this.validationErrors["Partner"].push(this.translateService.instant("INVALID_FORMAT"));
    }

    if(Object.keys(this.selectedVoucher).length==0){
      this.validationErrors["Voucher"] = new Array();
      this.validationErrors["Voucher"].push(this.translateService.instant("REQUIRED_FIELD"));
    }

    if (Object.keys(this.validationErrors).length > 0)
      return true;
    return false;
  }


  add(form: FormGroup) {
    if(this.policy.PaymentMethod=="BON"){
      if(this.validateFinalStep())
      return;
    }

    this.validationErrors = {};
    if (form.invalid) {
      this.validationErrors = this.validationService.PrepareRequiredFieldErrors(
        form
      );
      if (this.policy.PolicyExpiration <= this.policy.PolicyBegin)
        this.notificationService.info("DATES", "ERROR_DATE");
    } else {
      this.createPolicyHolder();
      this.location.back();
    }
  }

  stepChanged(event: StepperSelectionEvent) {
    if (event.previouslySelectedIndex > event.selectedIndex) {
      event.previouslySelectedStep.interacted = false;
    }
  }
  enableFieldsUpdate(){
    if(this.enableFieldsForUpdate==false)
     this.enableFieldsForUpdate=true;
    else
     this.enableFieldsForUpdate=false;
  }

  createPolicyHolder() {
    if (this.selectedCity != null) {
      if (this.isNewType) {
        if (this.selectedPolicyHolder == null) {
          this.disablePolicyHolderFields = false;
          this.policyHolderService.Save(this.policyHolder).then((p) => {
            if (p != null) {
              this.policyHolder = p;
              this.policy.PolicyHolderId = p.Id;
              this.createPolicyHolderLog();
            }
          });
        } else {
          this.policy.PolicyHolderId = this.selectedPolicyHolder.Id;
          this.policyHolderService.Save(this.policyHolder).then((pp) => {
            if (pp != null) {
              this.policyHolder = pp;
              this.selectedPolicyHolder = this.policyHolder;
              this.policy.PolicyHolderId = pp.Id;
              this.createPolicyHolderLog();
            }
          });
        }
      } else {
        this.policyHolderService.Save(this.policyHolder).then((ph) => {
          if (ph != null) {
            this.policyHolder = ph;
            this.policy.PolicyHolderId = ph.Id;
            this.createPolicyHolderLog();
          }
        });
      }
    }
  }


createPolicyHolderLog(){
  this.policyHolderLog.FirstName = this.policyHolder.FirstName;
  this.policyHolderLog.LastName = this.policyHolder.LastName;
  this.policyHolderLog.PersonalIdentificationNumber = this.policyHolder.PersonalIdentificationNumber;
  this.policyHolderLog.Address = this.policyHolder.Address;
  this.policyHolderLog.CityId = this.policyHolder.CityId;
  this.policyHolderLog.CompanyName = this.policyHolder.CompanyName;
  this.policyHolderLogService
    .PostWithReturningId(this.policyHolderLog)
    .then(ph => {
      if (ph != null) {
        this.policy.PolicyHolderLogId=ph;
        this.createPolicy();
      }
    });
  }

  createPolicy() {
    if (this.isNewType) {
      if (this.selectedPolicyNumber != null) {
        this.policy.PolicyNumberId = this.selectedPolicyNumber.Id;
        this.policy.PolicyNumber = this.selectedPolicyNumber.Number;

        this.policyService.Save(this.policy).then((p) => {
          if (p != null) {
            this.policy = p;

            if (this.isCarInsurance) {
              if (this.selectedVehicleTypeModel != null) {
                this.vehicle.VehicleTypeModelId = this.selectedVehicleTypeModel.Id;
                if (this.existingVehicle != null) {
                  this.vehicle = this.existingVehicle;
                  this.createVehicle();
                } else {
                  this.createVehicle();
                }
              }
            }
            this.notificationService.success("POLICIES", "ADDED_SUCCESSFULY");
          }
        });
      }
    } else {
      this.policyNumberService
        .FindById(this.policy.PolicyNumberId.toString())
        .then((pn) => {
          if (pn != null) {
            this.selectedPolicyNumber = pn;
            this.policy.PolicyNumberId = this.selectedPolicyNumber.Id;

            this.policyService.Save(this.policy).then((y) => {
              if (y != null) {
                this.policy = y;
                this.selectedPolicyNumber = pn;
                if (this.isCarInsurance) {
                  if (this.selectedVehicleTypeModel != null) {
                    this.vehicle.VehicleTypeModelId = this.selectedVehicleTypeModel.Id;
                    if (this.existingVehicle != null) {
                      this.vehicle = this.existingVehicle;
                      this.createVehicle();
                    } else {
                      this.createVehicle();
                    }
                  }
                }
              }
              this.notificationService.success(
                "POLICIES",
                "UPDATED_SUCCESSFULY"
              );
             this.createPolicyLog();
            });
          }
        });
    }
  }

  updatePolicy() {
    this.policyService.Update(this.policy).then((p) => {
      if (p != null) {
        this.policy = p;
        this.notificationService.success("POLICIES", "UPDATED_SUCCESSFULY");
      }
    });
  }

  createVehicle() {
    this.vehicle.Id = this.policy.Id;
    this.vehicle.PolicyExpiration = this.policy.PolicyExpiration;
    this.vehicle.Created = this.policy.Created;
    this.vehicle.Price = this.policy.Price;
    this.vehicle.PolicyBegin = this.policy.PolicyBegin;
    this.vehicle.InsuranceId = this.policy.InsuranceId;
    this.vehicle.PolicyHolderId = this.policy.PolicyHolderId;
    this.vehicle.PolicyNumberId = this.policy.PolicyNumberId;
    this.vehicle.InsuranceTypeId = this.policy.InsuranceTypeId;
    this.vehicle.UserId = this.policy.UserId;
    this.vehicle.TotalPremium = this.policy.TotalPremium;
    this.vehicle.MainTotal = this.policy.MainTotal;
    this.vehicle.RegistrationType=this.policy.RegistrationType;
    this.vehicle.SecondMainTotal = this.policy.SecondMainTotal;
    this.vehicle.SecondPercent = this.policy.SecondPercent;
    this.vehicle.Percent = this.policy.Percent;
    this.vehicle.Other = this.policy.Other;
    this.vehicle.PolicyNumberFormData=this.policy.PolicyNumberFormData;
    this.vehicle.DirectReverse=this.policy.DirectReverse;
    this.vehicle.VoucherId=this.policy.VoucherId;
    this.vehicle.PartnerId=this.policy.PartnerId;
    this.vehicle.PaymentMethod=this.policy.PaymentMethod;
    this.vehicle.SupplierId = this.policy.SupplierId;
    this.vehicle.AdminTechnicalInspectionId = this.policy.AdminTechnicalInspectionId;
    this.vehicle.GreenCardId = this.policy.GreenCardId;
    this.vehicleService.Save(this.vehicle).then((v) => {
      if (v != null) {
        this.vehicle = v;
      }
    });
  }

  updateVehicle() {
    this.vehicle.Id = this.policy.Id;
    this.vehicle.PolicyExpiration = this.policy.PolicyExpiration;
    this.vehicle.Created = this.policy.Created;
    this.vehicle.Price = this.policy.Price;
    this.vehicle.PolicyBegin = this.policy.PolicyBegin;
    this.vehicle.InsuranceId = this.policy.InsuranceId;
    this.vehicle.PolicyHolderId = this.policy.PolicyHolderId;
    this.vehicle.PolicyNumberId = this.policy.PolicyNumberId;
    this.vehicle.InsuranceTypeId = this.policy.InsuranceTypeId;
    this.vehicle.TotalPremium = this.policy.TotalPremium;
    this.vehicle.MainTotal = this.policy.MainTotal;
    this.vehicle.RegistrationType=this.policy.RegistrationType;
    this.vehicle.Percent = this.policy.Percent;
    this.vehicle.SecondMainTotal = this.policy.SecondMainTotal;
    this.vehicle.SecondPercent = this.policy.SecondPercent;
    this.vehicle.Other = this.policy.Other;
    this.vehicle.PolicyNumberFormData=this.policy.PolicyNumberFormData;
    this.vehicle.DirectReverse=this.policy.DirectReverse;
    this.vehicle.VoucherId=this.policy.VoucherId;
    this.vehicle.PartnerId=this.policy.PartnerId;
    this.vehicle.PaymentMethod=this.policy.PaymentMethod;
    this.vehicle.SupplierId = this.policy.SupplierId;
    this.vehicle.AdminTechnicalInspectionId = this.policy.AdminTechnicalInspectionId;
    this.vehicle.UserId = this.policy.UserId;
    this.vehicle.GreenCardId = this.policy.GreenCardId;
    this.vehicleService.Update(this.vehicle).then((v) => {
      if (v != null) {
        this.vehicle = v;
      }
    });
  }

  createPolicyLog(){
    if(!this.isNewType){
      var dateCrOld=this.dateFormat.transform(this.oldValues.Created.toString(),'dd/MM/yyyy');
      var dateCr=this.dateFormat.transform(this.policy.Created.toString(),'dd/MM/yyyy');
      var dateBegOld=this.dateFormat.transform(this.oldValues.PolicyBegin.toString(),'dd/MM/yyyy');
      var dateBeg=this.dateFormat.transform(this.policy.PolicyBegin.toString(),'dd/MM/yyyy');
      var dateExOld=this.dateFormat.transform(this.oldValues.PolicyExpiration.toString(),'dd/MM/yyyy');
      var dateEx=this.dateFormat.transform(this.policy.PolicyExpiration.toString(),'dd/MM/yyyy');

      if(dateCrOld!=dateCr){
        this.newValues.Created=this.policy.Created;
      }else
      this.newValues.Created=null;

      if(dateBegOld!=dateBeg){
        this.sameDateBeg=false;
        this.newValues.PolicyBegin=this.policy.PolicyBegin;
      }
      else{
        this.sameDateBeg=true;
        this.newValues.PolicyBegin=null;
      }

      if(dateExOld!=dateEx){
        let dateExpiration=new Date(this.policy.PolicyExpiration);
        var d=dateExpiration.getDate();
        var m=dateExpiration.getMonth();
        var y=dateExpiration.getFullYear();

        let newDate = new Date(y,m,d-1);
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);

        this.policy.PolicyExpiration=newDate;
        this.newValues.PolicyExpiration=moment(this.policy.PolicyExpiration).toDate();
        this.sameDateEx=false;
      }
      else{
        this.newValues.PolicyExpiration=null;
        this.sameDateEx=true;
      }

      if(this.oldValues.GreenCard!=this.selectedGreenCard.Number)
        this.newValues.GreenCard=this.selectedGreenCard.Number;
      else
        this.newValues.GreenCard=null;

      if(this.selectedSupplier!=null || this.selectedSupplier!=undefined){
        if(this.oldValues.Agent!=this.selectedSupplier.FirstName+" "+this.selectedSupplier.LastName){
          this.newValues.Agent=this.selectedSupplier.FirstName+" "+this.selectedSupplier.LastName;
        }else
          this.newValues.Agent=null;
      }

      if(Object.keys(this.adminTechnicalInspection).length>0){
        if(this.oldValues.AdminTechnicalInspection!=this.adminTechnicalInspection.Name){
          this.newValues.AdminTechnicalInspection=this.adminTechnicalInspection.Name;
        } else
        this.newValues.AdminTechnicalInspection=null;
      }

      if(this.oldValues.InsuranceType!=this.selectedInsuranceType.Label+" "+this.selectedInsuranceType.Name){
        this.newValues.InsuranceType=this.selectedInsuranceType.Label+" "+this.selectedInsuranceType.Name;
      }else
      this.newValues.InsuranceType=null;



      if(this.newValues.InsuranceType!=null || this.newValues.GreenCard!=null || !this.sameDateBeg || !this.sameDateEx)
        this.dataView=true;
      else
        this.dataView=false;

      if(Object.keys(this.selectedPartner).length>0){
        if(this.oldValues.Partner!=this.selectedPartner.Name)
        this.newValues.Partner=this.selectedPartner.Name;
      else
        this.newValues.Partner=null;
      }

      if(Object.keys(this.selectedVoucher).length>0){
        if(this.oldValues.Voucher!=this.selectedVoucher.Number)
        this.newValues.Voucher=this.selectedVoucher.Number;
      else
        this.newValues.Voucher=null;
      }

      if(this.oldValues.CompanyName !=this.policyHolder.CompanyName)
      this.newValues.CompanyName=this.policyHolder.CompanyName;
    else
      this.newValues.CompanyName=null;

        if(this.oldValues.FirstName!=this.policyHolder.FirstName)
        this.newValues.FirstName=this.policyHolder.FirstName;
      else
        this.newValues.FirstName=null;

        if(this.oldValues.LastName!=this.policyHolder.LastName)
        this.newValues.LastName=this.policyHolder.LastName;
      else
        this.newValues.LastName=null;

        if(this.oldValues.Address!=this.policyHolder.Address)
        this.newValues.Address=this.policyHolder.Address;
      else
        this.newValues.Address=null;

        if(this.oldValues.PersonalIdentificationNumber!=this.policyHolder.PersonalIdentificationNumber)
        this.newValues.PersonalIdentificationNumber=this.policyHolder.PersonalIdentificationNumber;
      else
        this.newValues.PersonalIdentificationNumber=null;

        if(this.oldValues.City!=this.selectedCity.CityNameMunicipalityCode)
        this.newValues.City=this.selectedCity.CityNameMunicipalityCode;
      else
        this.newValues.City=null;

        if(Object.keys(this.selectedTechnicalInspection).length>0){
          if(this.oldValues.TechnicalInspection!=this.selectedTechnicalInspection.Name)
       this.newValues.TechnicalInspection=this.selectedTechnicalInspection.Name;
       else
       this.newValues.TechnicalInspection=null;
        }
        console.log('old',this.oldValues.TechnicalInspection);
        console.log('new',this.newValues.TechnicalInspection);
        console.log('selected',this.selectedTechnicalInspection.Name);


       if(this.oldValues.Price!=this.policy.Price)
       this.newValues.Price=this.policy.Price;
       else
       this.newValues.Price=null;

       if(this.oldValues.Percent==null && this.policy.MainTotal==null)
       this.newValues.Percent=null;
       else if(this.policy.Percent!=null && this.oldValues.Percent==null){
        this.newValues.Percent=this.policy.Percent;
        this.oldValues.Percent=0;
       }else if((this.policy.Percent!=null && this.oldValues.Percent!=null) && (this.policy.MainTotal!=this.oldValues.Total)){
          this.newValues.Percent=this.policy.Percent;
       }

       if(this.oldValues.Total==null && this.policy.MainTotal==null)
        this.newValues.Total=null;
       else if(this.policy.MainTotal!=null && this.oldValues.Total==null){
        this.oldValues.Total=0;
        this.newValues.Total=this.policy.MainTotal;
       }else if((this.policy.MainTotal!=null && this.oldValues.Total!=null) && (this.policy.MainTotal!=this.oldValues.Total))
       {
         this.newValues.Total=this.policy.MainTotal;
       }

       if(this.oldValues.CarAccidentCompensation!=this.policy.CarAccidentCompensation)
       this.newValues.CarAccidentCompensation=this.policy.CarAccidentCompensation;
       else
       this.newValues.CarAccidentCompensation=null;

       if(this.oldValues.TotalPremium!=this.policy.TotalPremium)
       this.newValues.TotalPremium=this.policy.TotalPremium;
       else
       this.newValues.TotalPremium=null;

       if(this.oldValues.Other!=this.policy.Other)
       this.newValues.Other=this.policy.Other;
       else
       this.newValues.Other=null;

       if(Object.keys(this.vehicle).length>0){
        if(this.oldValues.VehicleType!=this.vehicle.VehicleType)
        this.newValues.VehicleType=this.vehicle.VehicleType;
        else
        this.newValues.VehicleType=null;

        if(this.oldValues.VehicleTypeModel!=this.selectedVehicleTypeModel.Type+' '+this.selectedVehicleTypeModel.Model)
       this.newValues.VehicleTypeModel=this.selectedVehicleTypeModel.Type+' '+this.selectedVehicleTypeModel.Model;
       else
       this.newValues.VehicleTypeModel=null;

       if(this.oldValues.LicensePlate!=this.vehicle.LicensePlate)
       this.newValues.LicensePlate=this.vehicle.LicensePlate;
       else
       this.newValues.LicensePlate=null;

       if(this.oldValues.ProductionYear!=this.vehicle.ProductionYear)
       this.newValues.ProductionYear=this.vehicle.ProductionYear;
       else
       this.newValues.ProductionYear=null;

       if(this.oldValues.EnginePower!=this.vehicle.EnginePower)
       this.newValues.EnginePower=this.vehicle.EnginePower;
       else
       this.newValues.EnginePower=null;

       if(this.oldValues.EngineDisplacement!=this.vehicle.EngineDisplacement)
       this.newValues.EngineDisplacement=this.vehicle.EngineDisplacement;
       else
       this.newValues.EngineDisplacement=null;

       if(this.oldValues.SeatsNumber!=this.vehicle.SeatsNumber)
       this.newValues.SeatsNumber=this.vehicle.SeatsNumber;
       else
       this.newValues.SeatsNumber=null;

       if(this.oldValues.Fuel!=this.vehicle.FuelType)
       this.newValues.Fuel=this.vehicle.FuelType;
       else
       this.newValues.Fuel=null;

       this.colorService.FindById(this.vehicle.ColorId.toString()).then(c=>{
         if(c!=null){
           if(this.oldValues.Color!=c.Name){
             this.newValues.Color=c.Name
           }else
           {
             this.newValues.Color=null;
           }
         }
       });
       if(this.oldValues.Color!=this.selectedColor.Name)
       this.newValues.Color=this.selectedColor.Name;
       else
       this.newValues.Color=null;

       if(this.oldValues.ChassisNumber!=this.vehicle.ChassisNumber)
       this.newValues.ChassisNumber=this.vehicle.ChassisNumber;
       else
       this.newValues.ChassisNumber=null;

       if(this.oldValues.EngineNumber!=this.vehicle.EngineNumber)
       this.newValues.EngineNumber=this.vehicle.EngineNumber;
       else
       this.newValues.EngineNumber=null;

       if(this.vehicle.MaxPermissibleMass!=null && this.vehicle.LoadCapacity!=null){
         if(this.oldValues.MaxPermissibleMass!=this.vehicle.MaxPermissibleMass)
           this.newValues.MaxPermissibleMass=this.vehicle.MaxPermissibleMass;
         else
         this.newValues.MaxPermissibleMass=null;

         if(this.oldValues.MaxPermissibleMass!=this.vehicle.MaxPermissibleMass)
          this.newValues.LoadCapacity=this.vehicle.LoadCapacity;
         else
          this.newValues.LoadCapacity=null;
        	}
       }else{
        this.newValues.LoadCapacity=null;
        this.newValues.MaxPermissibleMass=null;
        this.newValues.EngineNumber=null;
        this.newValues.ChassisNumber=null;
        this.newValues.Color=null;
        this.newValues.Fuel=null;
        this.newValues.SeatsNumber=null;
        this.newValues.EngineDisplacement=null;
        this.newValues.EnginePower=null;
        this.newValues.ProductionYear=null;
        this.newValues.LicensePlate=null;
        this.newValues.VehicleTypeModel=null;
        this.newValues.VehicleType=null;
       }

       if(this.oldValues.Other!=this.policy.Other)
       this.newValues.Other=this.policy.Other;
       else
       this.newValues.Other=null;

       if(this.oldValues.PaymentMethod!=this.policy.PaymentMethod)
        this.newValues.PaymentMethod=this.policy.PaymentMethod;
      else
      this.newValues.PaymentMethod=null;

       var newValueOfPolicyLog=JSON.stringify(this.newValues);
       var oldValueOfPolicyLog=JSON.stringify(this.oldValues);

      this.policyLog.PolicyId=this.policy.Id;
      this.policyLog.OldValues=oldValueOfPolicyLog;
      this.policyLog.NewValues=newValueOfPolicyLog;
      this.policyLog.TotalPremium=this.policy.TotalPremium;
      this.policyLog.PolicyHolderFullName=this.policyHolder.FirstName+" "+this.policyHolder.LastName;
      this.policyLog.InsuranceType=this.selectedInsuranceType.Label;
      this.policyLog.Insurance=this.selectedInsurance.Name;
      this.policyLog.MainOffice=this.mainOffice.Name;
      if(this.policy.PolicyNumberFormData!=null)
        this.policyLog.PolicyNumberFormData=this.policy.PolicyNumberFormData;
      else
        this.policyLog.PolicyNumberFormData=null;
      this.policyLog.PolicyNumber=this.selectedPolicyNumber.Number;


      this.policyLogService.Save(this.policyLog).then(pl=>{
        if(pl!=null){
          this.policyLog=pl;
        }
      });
    }
  }

  handleDOBChange(e) {
    if (e.value != null) {
      let expirationDate = new Date();
      expirationDate = e.value;
      var ex=moment(expirationDate).toDate();
      let date = new Date(ex);
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      let newDate = new Date(y + 1, m, d+1);

      this.policy.PolicyExpiration = newDate;
    } else {
      this.policy.PolicyExpiration = null;
    }
  }

  onInsuranceTypeChange(e) {
    if (e == null || e == "") return;

    if (isObject(e)) {
      this.selectedInsuranceType = e;

      this.policy.InsuranceTypeId = this.selectedInsuranceType.Id;
      if (
        this.selectedInsuranceType.Label === "10" ||
        this.selectedInsuranceType.Label === "03"
      )
        this.isCarInsurance = true;
      else this.isCarInsurance = false;
    } else {
      this.selectedInsuranceType = null;
    }
  }

  onVehicleTypeChange(e) {
    let vehicleType = e.value;
    if (vehicleType === 1 || vehicleType === 3 || vehicleType === 4)
      this.vehicleInsurance = true;
    else this.vehicleInsurance = false;
  }

  onSelectedInsuranceChange(e) {
    if (e == null || e == "") return;
    if (isObject(e)) {
      this.selectedInsurance = e.value;
      if(this.selectedInsurance.Label=="DO")
        this.showDunavInsuranceNumbers=true;
      else
        this.showDunavInsuranceNumbers=false;

      this.policy.InsuranceId = this.selectedInsurance.Id;
      this.policy.InsuranceName = this.selectedInsurance.Name;
      this.disablePolicyNumbers=false;
      if (this.isNewType) {
        this.insuranceCompanyService
          .FindAllActivePolicyNumbers(this.policy.InsuranceId)
          .then((x) => {
            if (x != null) {
              this.activePolicyNumbers = x;
            }
          });
      }
    } else {
      this.selectedInsurance = null;
      this.disablePolicyNumbers=true;
    }
  }
  onSelectedCityChanged(e) {
    if (e == null || e == "") return;
    if (isObject(e)) {
      this.selectedCity = e;
      this.policyHolder.CityId = this.selectedCity.Id;
    } else {
      this.selectedCity = null;
    }
  }
  onSelectedVehicleTypeModel(e) {
    if (e == null || e == "" || !isObject(e)) {
      this.selectedVehicleTypeModel = null;
      return;
    }
    if (isObject(e)) {
      this.selectedVehicleTypeModel = e;
      this.vehicle.VehicleTypeModelId = this.selectedVehicleTypeModel.Id;
    } else {
      this.selectedVehicleTypeModel = null;
    }
  }
  clear() {
    this.selectedValue = null;
    this.vehicle = new PolicyVehicle();
    this.disableFieldsForVehicle = false;
    this.selectedVehicleTypeModel = null;
    this.selectedColor=null;
  }
  onSelectedVehicle(e) {
    if (e == null || e == "") return;

    if (isObject(e)) {
      this.selectedValue = e;
      this.disableFieldsForVehicle = true;
      this.vehicleTypeModelService
        .FindById(this.selectedValue.VehicleTypeModelId.toString())
        .then((vtm) => {
          if (vtm != null) {
            this.selectedVehicleTypeModel = vtm;
            this.vehicle = this.selectedValue;
            this.colorService.FindById(this.vehicle.ColorId.toString()).then(c=>{
              if(c!=null){
                this.selectedColor=c;
                this.selectedColor.Name=c.Name;
              }
            });
          } else {
            this.selectedVehicleTypeModel = null;
            this.selectedColor=null;
          }
        });

    } else {
      this.clear();
    }
  }

  onSelectedPolicyHolderChanged(e) {
    if (e == null || e == "") {
      this.selectedPolicyHolder = null;
      this.allVehiclesInInsurance = null;
      this.clear();
      return;
    }
    if (isObject(e)) {
      this.disablePolicyHolderFields = true;

      this.selectedPolicyHolder = e;

      this.policyHolderService
        .VehiclesOfPolicyHolder(this.selectedPolicyHolder.Id)
        .then((po) => {
          if (po != null) {
            this.allVehicles = po;

          }
          if (this.allVehicles.length > 0) {
            this.existVehicle = true;
            this.policyHolderService
              .VehiclesDontBelongToPolicyHolder(this.selectedPolicyHolder.Id)
              .then((v) => {
                if (v != null) {
                  this.existingVehiclesOfPolicyHolder = v;
                  if (this.existingVehiclesOfPolicyHolder.length > 0) {
                    this.allVehiclesInInsurance=null;
                    this.allVehiclesInInsurance=this.allVehicles.concat(this.existingVehiclesOfPolicyHolder);
                    if(this.allVehiclesInInsurance.length>0)
                    this.haveVehicles=true;
                    else
                    this.haveVehicles=false;
                  }
                }
              });
          } else{
            this.policyHolderService
              .VehiclesDontBelongToPolicyHolder(this.selectedPolicyHolder.Id)
              .then((v) => {
                if (v != null) {
                  this.existingVehiclesOfPolicyHolder = v;
                  if (this.existingVehiclesOfPolicyHolder.length > 0) {
                    this.allVehiclesInInsurance=this.existingVehiclesOfPolicyHolder;
                    if(this.allVehiclesInInsurance.length>0)
                    this.haveVehicles=true;
                    else
                    this.haveVehicles=false;
                  }
                }
              });
            this.existVehicle = false;
          }
        });
      if (this.selectedPolicyHolder != null) {
        this.citiesService
          .FindById(this.selectedPolicyHolder.CityId.toString())
          .then((c) => {
            if (c != null) {
              this.selectedCity = c;
              this.selectedCity.CityNameMunicipalityCode =
                c.Name + "" + "(" + c.MunicipalityCode + ")";
              this.policyHolder.Id = this.selectedPolicyHolder.Id;
              this.policyHolder.FirstName = this.selectedPolicyHolder.FirstName;
              this.policyHolder.LastName = this.selectedPolicyHolder.LastName;
              this.policyHolder.PersonalIdentificationNumber = this.selectedPolicyHolder.PersonalIdentificationNumber;
              this.policyHolder.Address = this.selectedPolicyHolder.Address;
              this.policyHolder.CityId = this.selectedCity.Id;
              this.policyHolder.CompanyName = this.selectedPolicyHolder.CompanyName;
              this.selected = true;
            }
          });
      }
    } else {
      this.selectedCity = null;
      this.disablePolicyHolderFields = false;
      this.selectedPolicyHolder = null;
      this.selected = false;
      this.policyHolder.CompanyName = null;
      this.policyHolder.PersonalIdentificationNumber = null;
      this.policyHolder.Address = null;
    }
  }

  addFullName(e) {
    this.fullName = e.target.value;
    var str = this.fullName.split(" ");
    this.policyHolder.FirstName = str[0];
    this.policyHolder.LastName = str[1];
  }

  showPicker(picker:MatDatepicker<Moment>){
    picker.open();
  }

  addNewVehicleTypeAndModel() {
    const ref = this.dialogService.open(VehicleTypeModelComponent, {
      header: this.translateService.instant("NEW_TYPE_AND_MODEL_OF_VEHICLE"),
      data: {},
    });

    ref.onClose.subscribe((x: any) => {
      if (x != null) {
        console.log(x);
        this.vehicleTypesModels.push(x);
        this.selectedVehicleTypeModel = x;
      }
    });
  }

  addNewColor() {
    const ref = this.dialogService.open(NewColorComponent, {
      header: this.translateService.instant("NEW_COLOR_OF_VEHICLE"),
      data: {},
    });

    ref.onClose.subscribe((c: any) => {
      if (c != null) {
        this.colors.push(c);
        console.log(c);
        this.selectedColor = c;
      }
    });
  }

  goToPrevious(stepper: MatStepper) {
    stepper.previous();
    this.validationErrors = {};
  }
  calculateTotalPremium() {
    if (
      this.policy.CarAccidentCompensation != null &&
      this.policy.Price != null
    ) {
      var totalPremium=this.policy.Price+this.policy.CarAccidentCompensation;
      this.policy.TotalPremium = parseFloat(totalPremium.toFixed(2));
    }else{
      this.policy.TotalPremium=null;
    }
  }
  clearFieldsForPartner(e){
    if(e.key=="Backspace"){
      this.selectedPartner=null;
    }
  }
clearFields(e){
  if(e.key=="Backspace"){
    this.policy.Percent=null;
    this.policy.MainTotal=null;
  }
}

  calcualteMainTotal() {
    if (this.policy.Percent != null) {
      var mainTotal=(this.policy.Percent / 100) * this.policy.TotalPremium;
      this.policy.MainTotal=parseFloat(mainTotal.toFixed(2));
    }
  }

  calculatePercent(){
    if(this.policy.MainTotal!=null){
      var percent=(this.policy.MainTotal/this.policy.TotalPremium)*100;
      this.policy.Percent=parseFloat(percent.toFixed(2));
    }
  }
  secondClearFields(e){
    if(e.key=="Backspace"){
      this.policy.SecondMainTotal=null;
      this.policy.SecondPercent=null;
    }
  }
  calcualteSecondMainTotal() {
    if (this.policy.SecondPercent != null) {
      var secondMainTotal=(this.policy.SecondPercent / 100) * this.policy.TotalPremium;
      this.policy.SecondMainTotal=parseFloat(secondMainTotal.toFixed(2));
    } else {
      this.policy.SecondMainTotal = null;
    }
  }
  calculateSecondPercent() {
    if (this.policy.SecondMainTotal != null) {
      var secondPercent=(this.policy.SecondMainTotal/this.policy.TotalPremium) * 100;
      this.policy.SecondPercent = parseFloat(secondPercent.toFixed(2));
    } else this.policy.SecondPercent = null;
  }
  showPercentField(e) {
    if (e.checked) {
      this.showPercent = true;
      this.policy.DirectReverse = this.showPercent;
    } else {
      this.showPercent = false;
      this.policy.DirectReverse = this.showPercent;
      this.policy.MainTotal=null;
      this.policy.Percent=null;
      this.selectedVoucher=null;
      this.selectedPartner=null;
    }
  }
  onSelectedColor(e) {
    if (e == null || e == "" || !isObject(e)) {
      this.selectedColor = null;
      return;
    }
    if (isObject(e)) {
      this.selectedColor = e;
      this.vehicle.ColorId = this.selectedColor.Id;
    } else {
      this.selectedColor = null;
    }
  }
  onSelectedPaymentMethod(e){
    if(e.value!=null || e.value!=""){
      this.selectedPaymentMethod=e.value;
      this.policy.PaymentMethod=this.selectedPaymentMethod;
      if(this.selectedPaymentMethod=="BON")
      {
        this.showVoucher=true;
        this.partnerService.FindAllPartnersWithActiveVouchers().then(p=>{
          if(p!=null){
            this.partners=p;
          }
        });
      }
      else
        this.showVoucher=false;

      if(this.selectedPaymentMethod=="GOTOVINA")
        this.showTotal=true;
      else
        this.showTotal=false;
    }
    else{
      this.selectedPaymentMethod=null;
      this.policy.PaymentMethod=null;
    }
  }
  onSelectedGreenCard(e) {
    if (e.value != null) {
      this.selectedGreenCard = e.value;
      this.policy.GreenCardId = this.selectedGreenCard.Id;
    } else {
      this.selectedGreenCard = null;
    }
  }
  onSelectedPartner(e){
    if (!isObject(e)){
      this.selectedPartner=null;
      return;
    }


    if (isObject(e)) {
      this.selectedPartner = e;
      this.disableVouchers = false;
      this.policy.PartnerId=this.selectedPartner.Id;
      this.voucherService.FindAllVouchersOfPartner(this.selectedPartner.Id).then(v=>{
        if(v!=null){
          this.vouchers=v;
        }
      });
    } else {
      e=null;
      this.vouchers=null;
      this.selectedVoucher=null;
      this.policy.PartnerId=null;
      this.selectedPartner=null;
      this.disableVouchers = true;
    }
  }

  onSelectedVoucher(e) {
    if (e.value != null) {
      this.selectedVoucher = e.value;
      this.policy.VoucherId = this.selectedVoucher.Id;
    } else {
      this.policy.VoucherId=null;
      this.selectedVoucher = null;
    }
  }
  onSelectedSupplier(e) {
    if (e == null || e == "" || !isObject(e)) {
      this.selectedSupplier = null;
      return;
    }
    if (isObject(e)) {
      this.selectedSupplier = e;
      this.policy.SupplierId = this.selectedSupplier.Id;
    } else {
      this.selectedSupplier = null;
    }
  }
  onSelectedTechnicalInspection(e) {
    if (e == null || e == "" || !isObject(e)) {
      this.selectedTechnicalInspection = null;
      return;
    }
    if (isObject(e.value)) {
      this.selectedTechnicalInspection = e.value;
      this.policy.TechnicalInspectionId = this.selectedTechnicalInspection.Id;
    } else {
      this.selectedTechnicalInspection = null;
    }
  }
  onSelectedAdminTechnicalInspection(e) {
    if (e == null || e == "" || !isObject(e)) {
      this.adminTechnicalInspection = null;
      return;
    }
    if (isObject(e.value)) {
      this.adminTechnicalInspection = e.value;
      this.policy.AdminTechnicalInspectionId = this.adminTechnicalInspection.Id;
    } else {
      this.adminTechnicalInspection = null;
    }
  }

  chosenMonthHandlerBegin(datepicker: MatDatepicker<Moment>){
    this.policy.PolicyBegin = moment(this.policy.PolicyBegin).toDate();

    datepicker.close()
  }
  chosenMonthHandlerExpiration(datepicker: MatDatepicker<Moment>){
    this.policy.PolicyExpiration = moment(this.policy.PolicyExpiration).toDate();

    datepicker.close()
  }
  chosenMonthHandlerCreated(datepicker: MatDatepicker<Moment>){
    this.policy.Created = moment(this.policy.Created).toDate();
    datepicker.close()
  }
  getPolicyHolders(e : MatSelectChange){
    this.selectedCity = null;
    this.policyHolder = new PolicyHolder();
    this.policyHolder.PolicyHolderType = e.value;
      this.policyHolderService.FindAllPolicyHolders(e.value).then(x=>{
        if(x != null){
          this.policyHolders = x;
        }
      })
    }
}
