import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from "./request.service";
import { Observable } from "rxjs";
import { TokenStorage } from "./tokenstorage.service";



@Injectable()
export abstract class BaseCrudService<T>{
    constructor(
        protected controller:string,
        protected translateService : TranslateService,
        protected requestService : RequestService,
        protected tokenStorage : TokenStorage
    ){}

    public Count(cached: boolean = false): Promise<number>{
        return this.requestService.get(this.controller.concat("count"),cached)
        .toPromise()
        .then( res => { return <number> res;})
    }

    public Find(cached: boolean = false): Promise<T[]>{
        return this.requestService.get(this.controller,cached)
        .toPromise()
        .then(res => { return <T[]> res;})
    }

    public FindById(id : string,cached : boolean= false): Promise<T>{
        return this.requestService.get(this.controller.concat(id),cached)
        .toPromise()
        .then( res => { return <T> res;})
    }

    public Save(data: T): Promise<T>{
        return this.requestService.post(this.controller,data)
        .toPromise()
        .then( res => {return <T> res;})
    }
    public Update(id: string, data: T): Promise<T>{
        return this.requestService.put(this.controller.concat(id),data)
        .toPromise()
        .then( res=> { return <T> res;})
    }
    public Delete(id : string): Observable<any>{
        return this.requestService.delete(this.controller.concat(id));
    }
}
