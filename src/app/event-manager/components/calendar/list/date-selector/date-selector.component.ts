import { DatePipe } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { outputFromObservable, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-date-selector',
  imports: [ReactiveFormsModule, MatCardModule, MatIconModule, DatePipe, MatSelectModule, MatRadioModule],
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.scss',
})
export class DateSelectorComponent {

  dateFormat = ["d MMMM y", "MMMM y", "y"];
  monthList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  currentDate = signal(new Date());
  numberOfDays = signal(31);
  daysList = signal(this.range(0,this.numberOfDays()));

  displayTypeCtrl = new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] });
  displayTypeForm = new FormGroup({
    displayType: this.displayTypeCtrl
  });

  dayCtrl = new FormControl<number>(this.currentDate().getDate(), { nonNullable: true, validators: [Validators.required] });
  monthCtrl = new FormControl<number>(this.currentDate().getMonth(), { nonNullable: true, validators: [Validators.required] });
  yearCtrl = new FormControl<number>(this.currentDate().getFullYear(), { nonNullable: true, validators: [Validators.required] });

  dateSelectForm = new FormGroup({
    day: this.dayCtrl,
      month: this.monthCtrl,
      year: this.yearCtrl,
  });

  dateChanged = outputFromObservable(toObservable(this.currentDate));
  displayTypeChanged = output<number>();

  displayTypeValue = toSignal(this.displayTypeCtrl.valueChanges, {
    initialValue: this.displayTypeCtrl.value
  });

  ngOnInit(): void {
    this.setNumberOfDays();
    this.setDaysList();
  }

  setDate(time: number) {
    this.currentDate.set(new Date(time));
  }

  setNumberOfDays(){
    this.numberOfDays.set(this.getCurrentDaysInMonth());
  }

  setDaysList() {
    this.daysList.set(this.range(0,this.numberOfDays()));
  }

  range(start: number, end: number): Iterable<number> {
    return {
      *[Symbol.iterator]() {
        for (let i = start; i <= end; i++) {
          yield i;
        }
      }
    };
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  getCurrentDaysInMonth(){
    return this.getDaysInMonth(this.monthCtrl.value, this.yearCtrl.value);
  }

  onSelectMonth() {
    this.setNumberOfDays();
    if(this.dayCtrl.value > this.numberOfDays()){
      this.dayCtrl.setValue(this.numberOfDays());
    }
    this.setDaysList();
  }

  validate() {
    let newDate = new Date();
    newDate.setDate(this.dayCtrl.value);
    newDate.setMonth(this.monthCtrl.value);
    newDate.setFullYear(this.yearCtrl.value);
    this.currentDate.set(newDate);
  }

  onDisplayTypeChanged($event: MatRadioChange) {
    this.displayTypeChanged.emit($event.value);
  }
}
