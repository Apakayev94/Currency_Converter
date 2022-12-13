import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { RoundRate } from '../get-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class headerComponents implements OnInit {
    headerMainText: string = "Currency Converter";
    usdText: string = "USD: ";
    eurText: string = "EUR: ";

    buyRatesUSD: number = 0;
    sellRatesUSD: number = 0;
    buyRatesEUR: number = 0;
    sellRatesEUR: number = 0;

    constructor(private getDataService: GetDataService) {}
    ngOnInit(): void {
        this.getDataService.getRates().then((res: any) => {
            this.buyRatesUSD = RoundRate(1 / (res.get("UAH")?.get("USD") ?? 1));
            this.sellRatesUSD = RoundRate(res.get("USD")?.get("UAH") ?? 1);
            this.buyRatesEUR = RoundRate(1 / (res.get("UAH")?.get("EUR") ?? 1));
            this.sellRatesEUR = RoundRate(res.get("EUR")?.get("UAH") ?? 1);
        })
    }
}