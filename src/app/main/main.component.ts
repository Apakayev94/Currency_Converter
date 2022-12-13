import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { RoundRate } from '../get-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class mainComponents implements OnInit {
    mainGlobalRates: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();

    enterText: string = "Enter amount and select currency you want to buy or sell:";
    wantText: string = "I want to ...";
    gettingText: string = "Getting exchange rate:";
    radioBuyText: string = "Buy";
    radioSellText: string = "Sell";
    textUAH: string = "UAH";
    textUSD: string = "USD";
    textEUR: string = "EUR";

    inputFrom: number = 0;
    inputTo: number = 0;
    inputLineFrom: string = "";
    inputLineTo: string = "";
    
    currencyFrom: string = "UAH";
    currencyTo: string = "UAH";

    actualAction: number = 1;
    
    onInputFromChanged() {
        this.inputLineFrom = this.inputLineFrom.replace(/[^0-9.]/g, '');
        this.inputFrom = +this.inputLineFrom;
        this.firstInputLogic();
    }

    onInputToChanged() {
        this.inputLineTo = this.inputLineTo.replace(/[^0-9.]/g, '');
        this.inputTo = +this.inputLineTo;
        this.secondInputLogic();
    }

	onSelectedFrom(value:string) {
		this.currencyFrom = value;
        this.firstInputLogic(); 
	}

	onSelectedTo(value:string) {
		this.currencyTo = value;
        this.firstInputLogic(); 
	}
    
    onRadioBuyChanged(evt: any) {
        let target = evt.target;
        if (target.checked) {
            this.actualAction = 1;
            this.firstInputLogic();
        }
    }

    onRadioSellChanged(evt: any) {
        let target = evt.target;
        if (target.checked) {
            this.actualAction = 0;
            this.firstInputLogic();
        }
    }

    constructor(private getDataService: GetDataService) {}

    ngOnInit(): void {
        this.getDataService.getRates().then((res: any) => {
            console.log(res);
            this.mainGlobalRates = res;
        })
    }

    updateInputs(buy: boolean, backDirection: boolean) {
        if (backDirection) {
            if (buy) {
                this.inputFrom = RoundRate(this.inputTo * (this.mainGlobalRates.get(this.currencyTo)?.get(this.currencyFrom) ?? 1));
            } else {
                this.inputFrom = RoundRate(this.inputTo / (this.mainGlobalRates.get(this.currencyFrom)?.get(this.currencyTo) ?? 1));
            }
            this.inputLineFrom = this.inputFrom + "";
        } else {
            if (buy) {
                this.inputTo = RoundRate(this.inputFrom / (this.mainGlobalRates.get(this.currencyTo)?.get(this.currencyFrom) ?? 1));
            } else {
                this.inputTo = RoundRate(this.inputFrom * (this.mainGlobalRates.get(this.currencyFrom)?.get(this.currencyTo) ?? 1));
            }
            this.inputLineTo = this.inputTo + "";
        }
    }

    firstInputLogic() {
        if (this.actualAction == 0) {
            return this.updateInputs(true, false);
        }
        if (this.actualAction == 1) {
            return this.updateInputs(false, false);
        }
    }

    secondInputLogic() {
        if (this.actualAction == 0) {
            return this.updateInputs(true, true);
        }
        if (this.actualAction == 1) {
            return this.updateInputs(false, true);
        }
    }
}