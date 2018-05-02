import { Injectable } from '@angular/core';

@Injectable()
export class CONFIG {
    public ServerPath: string = "//localhost:50733/";     //""//localhost:5001/   "//api.dev01.medulla.net/";
    public ApiUrl: string = "api/";
    public ServerWithApiUrl = this.ServerPath + this.ApiUrl;    
}