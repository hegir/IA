import {Injectable,EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../environments/environment';

@Injectable()
export class SpinnerService {
    public $loadinEvent: EventEmitter<boolean>;
    private _reqSpinnerSub: Subscription;
    private _reqCount: number = 0;

    constructor() {
        this.$loadinEvent = new EventEmitter<boolean>();
    }

    public ShowSpinner(): void {
        if (this._reqCount == 0) {
            this._reqSpinnerSub = Observable.timer(environment.spinnerTimer).subscribe(() => { this.$loadinEvent.emit(true) });
        }
        this._reqCount += 1;
    }
    public RemoveSpinner(): void {
        this._reqCount -= 1;
        if (this._reqCount < 1) {
            this.$loadinEvent.emit(false);
            this._reqSpinnerSub.unsubscribe();
            this._reqCount = 0;
        }
    }
}