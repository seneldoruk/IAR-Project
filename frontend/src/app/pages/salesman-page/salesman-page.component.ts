import { Component, OnInit } from '@angular/core';
import { Evaluation, Order, Salesman } from 'src/app/interfaces/salesman';
import { Router } from '@angular/router';
@Component({
    selector: 'app-salesman-page',
    templateUrl: './salesman-page.component.html',
    styleUrls: ['./salesman-page.component.css'],
})
export class SalesmanPageComponent implements OnInit {
    salesman: Salesman;
    flattenedOrders: Order[];
    OrderColumns = ['name', 'customer', 'customerRating', 'quantity', 'bonus'];
    EvalColumns = ['name', 'target', 'actual', 'bonus'];
    companyRating = { 1: 'Good', 2: 'Very Good', 3: 'Excellent' };
    evaluationsArray: any[] = [];
    console = console;
    constructor(private router: Router) {
        this.salesman = this.router.getCurrentNavigation().extras
            .state as Salesman;
        this.flattenedOrders = this.salesman.orders.flatMap(
            (order): Order[] => order
        );
        const evaluationNames = {
            attitude: 'Attitute towards client',
            communication: 'Communication skills',
            openness: 'Openness to employee',
            integrity: 'Integrity to company',
            leadership: 'Leadership competence',
            social: 'Social behaviour to employees',
        };
        for (const name in evaluationNames) {
            if (evaluationNames.hasOwnProperty(name)) {
                /* eslint-disable */
                const evaluation: Evaluation = this.salesman.evaluations[name];
                this.evaluationsArray.push({
                    name: evaluationNames[name],
                    target: 4,
                    actual: evaluation.value,
                    bonus: evaluation.bonus,
                });
                /* eslint-enable */
            }
        }
    }

    ngOnInit(): void {}
}
