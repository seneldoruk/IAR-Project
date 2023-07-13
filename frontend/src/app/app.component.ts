import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    isLoggedIn: boolean;
    role: string;
    authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    ngOnInit(): void {
        this.authService.subscribeLoginChange(
            (newState: { isLoggedIn: boolean; role: string }): void => {
                this.isLoggedIn = newState.isLoggedIn;
                this.role = newState.role;
            }
        );
        this.authService.isLoggedIn().subscribe();
    }
}
