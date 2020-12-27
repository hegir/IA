import { Component, OnInit } from "@angular/core";
import { RequestService } from "src/app/core/request.service";
import { InvoiceType } from "src/app/enums/invoiceType";
import { Invoice } from "src/app/models/invoice";
import { InvoicesService } from "src/app/services/invoices.service";
import { EnumValues } from 'enum-values';
import { InvoiceStatus } from "src/app/enums/invoiceStatus";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ValidationService } from "src/app/core/validation.service";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { NotificationsService } from "src/app/core/notifications.service";
import { InvoiceItem } from "src/app/models/invoiceItem";
import { InvoiceAction } from "src/app/enums/invoiceAction";

@Component({
    selector: "app-invoice-details",
    templateUrl: "./invoice-details.component.html",
    providers: [InvoicesService, RequestService, ValidationService, NotificationsService]
})
export class InvoiceDetailsComponent implements OnInit {

    invoice: Invoice = new Invoice();
    invoiceId: string;
    validationErrors: any = {};
    selectedType: InvoiceType;

    invoiceItems: InvoiceItem[] = new Array();
    invoiceItem: InvoiceItem = new InvoiceItem();
    validationErrorsItem: any = {};

    public InvoiceTypes: any[] = EnumValues.getNamesAndValues(InvoiceType);
    public InvoiceStatuses = EnumValues.getNamesAndValues(InvoiceStatus);

    constructor(
        private invoicesService: InvoicesService,
        private route: ActivatedRoute,
        private validationService: ValidationService,
        private location: Location,
        private translateService: TranslateService,
        private notificationService: NotificationsService
    ) {

        this.invoiceId = this.route.snapshot.paramMap.get('id');
        if (this.invoiceId != '0') {
            this.invoicesService.FindById(this.invoiceId).then(inv => {
                if (inv != null) {
                    this.invoice = inv;
                    this.selectedType = this.InvoiceTypes[inv.Type];

                    this.invoicesService.FindItems(this.invoiceId).then(items => {
                        if (items != null) {
                            this.invoiceItems = items;
                            console.log(this.invoiceItems);
                        }
                    })
                }
            })
        }

    }

    ngOnInit() { }

    back() {
        this.location.back();
    }

    saveInvoice(form: FormGroup) {
        this.validationErrors = {};
        if (form.invalid)
            this.validationErrors = this.validationService.PrepareRequiredFieldErrors(form);

        if (this.invoice.Type == null) {
            this.validationErrors["Type"] = new Array();
            this.validationErrors["Type"].push(this.translateService.instant("REQUIRED_FIELD"))
        }

        if (Object.keys(this.validationErrors).length > 0) return;

        if (this.invoiceId != '0') {
            this.invoice.Action = InvoiceAction.Update;
            this.invoicesService.Update(this.invoiceId, this.invoice).then(x => {
                if (x != null) {
                    this.invoice = x;
                    this.notificationService.success("UPDATED_SUCCESS");
                }
            })
        }
        else {

            this.invoicesService.Save(this.invoice).then(x => {
                if (x != null) {
                    this.invoiceId = x.Id.toString();
                    this.invoice = x;
                    this.notificationService.success("SAVED_SUCCESS");
                }
            })
        }
    }

    approveInvoice()
    {
        this.invoice.Action = InvoiceAction.Update;
        this.invoice.Action = InvoiceAction.Approve;
        this.invoicesService.Update(this.invoiceId, this.invoice).then(x => {
            if (x != null) {
                this.invoice = x;
                this.notificationService.success("APPROVED_SUCCESS");
            }
        })
    }

    bindTypeValue(event) {
        this.invoice.Type = event.value.value;
    }

    saveInvoiceItem(form: FormGroup) {
        this.validationErrorsItem = {};
        if (form.invalid) {
            this.validationErrorsItem = this.validationService.PrepareRequiredFieldErrors(form);
            return;
        }

        this.invoicesService.SaveItem(this.invoiceId, this.invoiceItem).then(model => {
            if (model != null) {
                this.invoiceItems.push(model.InvoiceItem);
                this.invoice = model.Invoice;
                this.notificationService.success("ADDED_SUCCESS");
                this.invoiceItem = new InvoiceItem();
            }
        })

    }

    removeItem(itemId: number)
    {
        
    }
}
