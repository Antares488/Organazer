import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tasks, TastsService } from '../shared/tasts.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-organazer',
  templateUrl: './organazer.component.html',
  styleUrls: ['./organazer.component.scss']
})
export class OrganazerComponent implements OnInit {

  form: FormGroup;
  tasks: Tasks[] = [];

  constructor(
    public dateService: DateService,
    public tasksService: TastsService) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  submit() {
    const {title} = this.form.value;
    const task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.tasksService.create(task).subscribe(task => {
      this.tasks.push(task);
      this.form.reset();
    }, err => console.error(err));

  }

  remove(task: Tasks) {
    this.tasksService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, error => console.log(error));
  }
}
