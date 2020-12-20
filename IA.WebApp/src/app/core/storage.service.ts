import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

    public map: Map<string, string> = new Map<any, string>();

    constructor()
    {
    }

    public setItem(key: string, value: string): void
    {
        this.map.set(key, value);
    }

    public getItem(key: string): string | null
    {
        return this.map.get(key);
    }

}