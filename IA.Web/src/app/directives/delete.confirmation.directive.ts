import { Directive, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import 'sweetalert2/src/sweetalert2.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'



@Directive({
    selector: '[deleteConfirmation]'
})
export class DeleteConfirmationDirective {
    @Input() deleteItemId: number;
    @Input() itemStatus: any = null;
    @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();
    constructor(event: ElementRef, private translateService: TranslateService) {
    }

    @HostListener('click') click() {
        if(this.itemStatus != 0)
        this.openPopUp();
        else
        this.onDelete.emit(this.deleteItemId);
    }
    public async openPopUp() {
        Swal.fire({
          title: this.translateService.instant(
            "ARE_YOU_SURE_TO_WANT_TO_DELETE_THIS_ITEM"
          ),
          text: this.translateService.instant("NO_REVERT_AFTER_THIS"),
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn btn-success",
          cancelButtonClass: "btn btn-danger",
          cancelButtonText: this.translateService.instant("CANCEL"),
          confirmButtonText: this.translateService.instant("OK"),
          buttonsStyling: false,
        }).then((result) => {

            if (result.value == true)
            {
                let d = this.onDelete.emit(this.deleteItemId);
            }
        });
    }
}
