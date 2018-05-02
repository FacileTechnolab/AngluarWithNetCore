import { Injectable } from '@angular/core';
import { Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Employee, EmployeeList } from '../model/employee';
import 'rxjs/add/operator/map';
import { CONFIG } from '../constants/config';
import { Router } from '@angular/router';
@Injectable()
export class EmployeeService {
    public token: string;
    private apiUrl: string;
    private tokenUrl: string;
    constructor(private _api: CONFIG, private _httpService: HttpService) {
        this.apiUrl = _api.ServerWithApiUrl;
    }
	get(searchTerm: string, skip: number, SortBy: string, sortOrder: string, filter: string, filterkey: string): Promise<EmployeeList> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
		return this._httpService.get(`${this.apiUrl}` + `employees/search?searchTerm=` + searchTerm + '&skip=' + skip + '&SortBy=' + SortBy + '&sortOrder=' + sortOrder + '&filter=' + filter +'&filterkey=' + filterkey,{ headers: headers })
            .map((response: Response) => <EmployeeList>response.json()).toPromise()
            .catch(err => { return this._httpService.handleError(err); });
    }
}
