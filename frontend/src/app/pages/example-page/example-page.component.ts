import { Component, OnInit } from '@angular/core';
import { PeopleDemoService } from '../../services/people-demo.service';
import { ExampleDatapoint } from '../../interfaces/example-datapoint';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-example-page',
    templateUrl: './example-page.component.html',
    styleUrls: ['./example-page.component.css'],
})
export class ExamplePageComponent implements OnInit {
    displayedColumns = ['id', 'name', 'color', 'age'];
    people: ExampleDatapoint[] = [];
    salesman: any;
    role: string;
    constructor(
        private peopleDemoService: PeopleDemoService,
        private router: Router,
        private authService: AuthService
    ) {
        this.salesman = this.router.getCurrentNavigation().extras.state;
        this.authService.subscribeLoginChange(
            (newState: { isLoggedIn: boolean; role: string }): void => {
                this.role = newState.role;
            }
        );
        this.authService.isLoggedIn().subscribe();
    }

    ngOnInit(): void {
        this.fetchPeople();
    }

    fetchPeople(): void {
        this.peopleDemoService.getPeople().subscribe((response): void => {
            if (response.status === 200) {
                this.people = response.body;
            }
        });
    }
}
