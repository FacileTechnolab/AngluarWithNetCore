import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

@Injectable()
export class HttpService {

    constructor(private _http: Http) { }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.get(url, options);
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.post(url, body, options);
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.put(url, body, options);
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this._http.delete(url, options);
    }

    request(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.request(url, options);
    }

    handleError(error: Response | any) {
        let errorMessage: any;
        console.log(error);
        if (error instanceof Response) {
            if (error.status !== 0) {
                try {
                    errorMessage = [{ field: 'custom', message: (<any>error)._body || error.statusText || error.text }];
                } catch (exception) {
                    errorMessage = [{ field: 'custom', message: 'Oops! Something went wrong, please try again!' }];
                }
            } else {
                errorMessage = [{ field: 'custom', message: 'Oops! Something went wrong, please try again!' }];
            }
        } else {
            errorMessage = [{ field: 'custom', message: 'Oops! Something went wrong, please try again!' }];
        }
        return Observable.throw(errorMessage).toPromise();
    }
}
