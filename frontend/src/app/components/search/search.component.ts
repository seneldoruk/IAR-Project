import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Salesman } from 'src/app/interfaces/salesman';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
    data: Salesman[] = [];
    dataToShow = [];
    role: string;
    saveBonuses = (): any => {
        this.http.post(
            environment.apiEndpoint + '/api/salespeople',
            {},
            { withCredentials: true }
        );
    };
    onInputChange = (id: string): void => {
        if (id === '') {
            this.dataToShow = this.data;
        } else {
            this.dataToShow = this.data.filter((element): any =>
                element.id.includes(id)
            );
        }
    };
    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.subscribeLoginChange(
            (newState: { isLoggedIn: boolean; role: string }): void => {
                this.role = newState.role;
            }
        );
        this.authService.isLoggedIn().subscribe();
    }
    // eslint-disable-next-line
    ngOnInit(): void {
        /* eslint-disable */
        this.http
            .get<Salesman[]>(environment.apiEndpoint + '/api/salespeople', {
                withCredentials: true,
            })
            .subscribe((data): void => {
                this.data = data;
                this.dataToShow = data;
            });
        /* eslint-enable */
    }
}
