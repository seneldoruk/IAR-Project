import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { BonusCalculationSalesman } from '../interfaces/salesman';
@Component({
    selector: 'app-bonus-remarks',
    templateUrl: './bonus-remarks.component.html',
    styleUrls: ['./bonus-remarks.component.css'],
})
export class BonusRemarksComponent implements OnInit {
    onEnter(str: string): void {
        if (!str) {
            str = '';
        }
        this.http
            .post<any>(
                environment.apiEndpoint + '/api/bonus',
                {
                    id: parseInt(this.salesman.id, 10),
                    remarks: str,
                    value: this.salesman.calculatedBonus,
                },
                {
                    withCredentials: true,
                }
            )
            .subscribe((data): void => {
                // eslint-disable-next-line
                if (data.status && data.status === 200) {
                    this.displayComponent = false;
                }
            });
    }
    displayComponent = true;
    @Input() salesman: BonusCalculationSalesman;
    constructor(private http: HttpClient) {}
    ngOnInit(): void {}
}
