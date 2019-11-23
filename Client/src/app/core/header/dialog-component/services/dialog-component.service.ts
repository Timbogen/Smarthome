import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface Garage {
    doorOneOpen: boolean;
    doorTwoOpen: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class DialogComponentService {

    public garage: Observable<Garage>;

    constructor(public http: HttpClient) {
    }

    updateGarageData() {

        this.garage = this.http.get<Garage>('http://localhost:8000/garage');
    }

    latestGarageData(): Observable<Garage> {

        return this.garage;
    }
}
