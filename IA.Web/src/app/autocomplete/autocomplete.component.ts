import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { isObject } from 'util';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
declare var $: any;

@Component({
    selector: 'arni-autocomplete',
    templateUrl: './autocomplete.component.html',
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArniAutoCompleteComponent<T> implements OnInit {
    _disabled: boolean;
    _items: T[] = new Array();
    filteredItems:any = new Array();


    @Input() set disabled(value) {
        this._disabled = value;
        if (value)
            this.autocompleteControl.disable();
        else
            this.autocompleteControl.enable();
        this.cd.markForCheck();
    };

    @Input() set items(value) {
        this._items = value;
        this.filteredOptions = this.autocompleteControl.valueChanges
            .pipe(
                startWith<string>(''),
                map(name => {
                    return this._filter(name);
                })
            );
        this.cd.markForCheck();
    }

    @Input() displayField: string;
    @Input() name: string;
    @Input() id: string;
    @Input() placeholder: string;
    @Input() selectedItem: T;
    @Output() onChange: EventEmitter<T | string> = new EventEmitter<T | string>();
    @Output() onFocus: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onKeyUpEnter: EventEmitter<any> = new EventEmitter<any>();
    @Output() onKeyUp: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("autoCompleteInput") autoCompleteInput: ElementRef;

    autocompleteControl = new FormControl();
    filteredOptions: Observable<T[]>;
    constructor(private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
    }

    selectOneRemaining()
    {
        if(this.filteredItems.length == 1)
        {
            this.selectedItem = this.filteredItems[0];
            this.onChange.emit(this.selectedItem);
        }
    }

    addHoverToOneRemaining() {

        if(this.filteredItems.length == 0)
        return;
        if (this.filteredItems.length > 1) {
            setTimeout(function(){
                $("mat-option > span").removeClass("font-color-white");
                $("mat-option").removeClass("focus-autocomplete-option");
            },30)


        }
        else{
            setTimeout(function(){
                $("mat-option > span").addClass("font-color-white")
                $("mat-option").addClass("focus-autocomplete-option");
            },30)
        }
    }

    focusEmit() {
        this.onFocus.emit(true);
    }

    keyupEnter(event) {
        this.onKeyUpEnter.emit(event);
    }

    keyup(event) {
        this.onKeyUp.emit(event);
    }

    closePanel(tr: MatAutocompleteTrigger) {
        tr.closePanel();
    }
    filterValue:string;

    displayFn(displayField: string): (item?: T) => string | undefined {
        return (item?: T) => {
            if (item)
                return item[displayField];
            else {
                this.filterValue = '';
                return '';
            }
        }
    }

    _filter(data: string | T): T[] {
        if (!isObject(data)) {
            this.filterValue = data != null ? (<string>data).toString().toLowerCase() : '';
            if (this.filterValue != '' || this.filterValue != undefined)
            this.onChange.emit(data);
            this.filteredItems = new Array();
            let filterArray = this.filterValue.split(' ');
            this.filteredItems = this._items.filter(option => this.contains(option[this.displayField].toLowerCase(), filterArray) == true);
            this.addHoverToOneRemaining();
            return this.filteredItems;

        }
        else {
            if(!isObject(this.selectedItem) || this.filteredItems.length != 1)
            {
                this.selectedItem = (<T>data);
                this.onChange.emit(this.selectedItem);
            }
            return this._items.filter(option => this.contains(option[this.displayField].toLowerCase(), [data[this.displayField].toLowerCase()]) == true);
        }
    }

    contains(target, pattern){
        let containsAll = true;
        pattern.forEach(word => {
            if(!target.includes(word)){
                containsAll = false;
            }
        });
        return containsAll;
    }

    getDescription(item: T) {
        return item[this.displayField];
    }

    disable() {
        this.disabled = true;
    }
    enable() {
        this.disabled = false;
    }
    reset() {
        this.autocompleteControl.reset();
    }
    focus() {
        this.autoCompleteInput.nativeElement.focus();
    }
    get enabled(): boolean {
        return this.autocompleteControl.enabled;
    }
}
