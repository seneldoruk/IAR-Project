import { Component, OnInit, Input } from '@angular/core';
import { Salesman } from 'src/app/interfaces/salesman';

@Component({
    selector: 'app-salesman-card',
    templateUrl: './salesman-card.component.html',
    styleUrls: ['./salesman-card.component.css'],
})
export class SalesmanCardComponent implements OnInit {
    @Input() salesman: Salesman;
    constructor() {}

    ngOnInit(): void {}
}
