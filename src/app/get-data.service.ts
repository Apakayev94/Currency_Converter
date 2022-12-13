import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ItemsResponseObj { 
    currencyCodeA: string,
    currencyCodeB: string,
    date: number,
    rateBuy: number,
    rateSell: number,
    rateCross: number 
}

@Injectable({
  providedIn: 'root'
})

export class GetDataService {
    buyRates: Map<string, number> = new Map<string, number>();
    sellRates: Map<string, number> = new Map<string, number>();
    globalRates: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
    initialized: boolean = false;
    promise: Promise<Map<string, Map<string, number>>>|null = null;
    currencyKeys: Array<string> = new Array<string>();

    constructor(private http: HttpClient) { 
        this.currencyKeys.push("UAH", "USD", "EUR");
        this.currencyKeys.forEach(curr => {
            this.buyRates.set(curr, 1);
            this.sellRates.set(curr, 1);
            this.globalRates.set(curr, new Map());
        });
    }

    calcGlobalRates() {
        for (let oKey of this.currencyKeys) {
            let inMap = new Map();
            for (let iKey of this.currencyKeys) {
                if (oKey === iKey) {
                    inMap.set(iKey, 1);
                }
                else if (oKey === "UAH") {
                    inMap.set(iKey, 1 / (this.sellRates.get(iKey) ?? 1 ));
                }
                else if (iKey === "UAH") {
                    inMap.set(iKey, (this.buyRates.get(oKey) ?? 1));
                }
                else {
                    inMap.set(iKey, (this.buyRates.get(oKey) ?? 1) / (this.sellRates.get(iKey) ?? 1));
                }
            } 
        this.globalRates.set(oKey, inMap);
        }
    }

    actualize(): Promise<Map<string, Map<string, number>>> {
        return new Promise<Map<string, Map<string, number>>>((resolve, reject) => {
            this.http.get<ItemsResponseObj[]>("https://api.monobank.ua/bank/currency").subscribe((res: ItemsResponseObj[]) => {
                if (res.length == 0) {
                    console.log("ERROR");
                    reject(new Error("Something bad happened"));
                    return;
                }
                res.forEach(element => {
                    if (element.currencyCodeB == "980") {
                        if (element.currencyCodeA == "840") {
                            this.buyRates.set("USD", element.rateSell);
                            this.sellRates.set("USD", element.rateBuy);
                        } else if (element.currencyCodeA == "978") {
                            this.buyRates.set("EUR", element.rateSell);
                            this.sellRates.set("EUR", element.rateBuy);
                        }
                    }
                });
                this.calcGlobalRates();
                resolve(this.globalRates);
            })
        });
    }

    getRates(): Promise<Map<string, Map<string, number>>>{
        if(!this.promise) {
            this.promise = new Promise<Map<string, Map<string, number>>>((resolve, reject) => {
                this.promise = null;
                if (this.initialized) {
                    resolve(this.globalRates);
                }
                this.actualize().then((res) => {
                    resolve(res);
                    this.initialized = true;
                })
                .catch((error) => {
                    reject(error);
                });
            });
        }
        return this.promise;
    }
}

export function RoundRate(value: number) {
    return Math.round(value * 100) / 100;
}