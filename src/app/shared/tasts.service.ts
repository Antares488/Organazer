import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

export interface Tasks {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TastsService {
  static url = 'https://angular-practice-calenda-f2bd4-default-rtdb.firebaseio.com/';


  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Tasks[]> {
    return this.http
      .get<Tasks[]>(`${TastsService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return [];
        }
        // @ts-ignore
        return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
      }));
  }

  create(task: Tasks): Observable<Tasks> {
    return this.http
      .post<CreateResponse>(`${TastsService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        console.log(res);
        return {...task, id: res.name};
      }));
  }

  remove(task: Tasks) {
    return this.http
      .delete<void>(`${TastsService.url}/${task.date}/${task.id}.json`);
  }

}
