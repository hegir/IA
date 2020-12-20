import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';

@Injectable()
export class SpinnerService {
    public $loadingEvent: EventEmitter<boolean>;
    private _reqSpinnerSub: Subscription;
    private _reqCount: number = 0;

    constructor() {
        this.$loadingEvent = new EventEmitter<boolean>();
    }

    public showSpinner(): void {
        if (this._reqCount == 0) {
            this._reqSpinnerSub = Observable.timer(Number(200)).subscribe(() => { this.$loadingEvent.emit(true) });
        }
        this._reqCount += 1;
    }

    public removeSpinner(): void {
        this._reqCount -= 1;

        if (this._reqCount < 1) {
            this.$loadingEvent.emit(false);
            this._reqSpinnerSub.unsubscribe();
            this._reqCount = 0;
        }
    }
}