import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { BonusCalculationSalesman } from '../../interfaces/salesman';
@Component({
    selector: 'app-bonus-page',
    templateUrl: './bonus-page.component.html',
    styleUrls: ['./bonus-page.component.css'],
})
export class BonusPageComponent implements OnInit {
    constructor(private http: HttpClient) {}
    data: BonusCalculationSalesman[];
    // eslint-disable-next-line
    ngOnInit(): void {
        /* eslint-disable */
        console.log('oninit');
        this.http
            .get<BonusCalculationSalesman[]>(
                environment.apiEndpoint + '/api/bonus',
                {
                    withCredentials: true,
                }
            )
            .subscribe((data): void => {
                this.data = data;
            });
        /* eslint-enable */
    }
}
