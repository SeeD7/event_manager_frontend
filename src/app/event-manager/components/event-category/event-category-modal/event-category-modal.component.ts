import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, filter, switchMap } from 'rxjs';
import { EventCategoryService } from '../../../services/event-category.service';
import { EventCategory } from '../../../../core/models/business/event-category.model';


@Component({
  selector: 'event-category-modal',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule],
  templateUrl: './event-category-modal.component.html',
  styleUrl: './event-category-modal.component.scss',
})
export class EventCategoryModalComponent implements OnInit {
  protected data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private service = inject(EventCategoryService);
  private dialogRef = inject(MatDialogRef<EventCategoryModalComponent>);

  private nameCtrl!: FormControl;
  private iconCtrl!: FormControl;

  form!: FormGroup;

  ngOnInit(): void {
    this.nameCtrl = this.fb.control(this.data ? this.data.name : '' , [Validators.required]);
    this.iconCtrl = this.fb.control(this.data ? this.data.icon : '' );
    this.form = this.fb.group({
      name: this.nameCtrl,
      icon: this.iconCtrl,
    });

    this.nameCtrl.valueChanges.pipe(
        debounceTime(500),
        filter(value => this.nameCtrl.valid && (!this.data && value !== '') || (this.data && value !== this.data.name)),
        switchMap(value => this.service.exists(value)),
      ).subscribe(exists => {
        if (exists) {
          this.nameCtrl.setErrors({ alreadyExists: true });
        } else {
          if (this.nameCtrl.hasError('alreadyExists')) {
              this.nameCtrl.setErrors(null);
          }
        }
        this.cdr.markForCheck();
      });
  }

  validate() {
    if (this.form.valid) {
      const newCategory: EventCategory = this.form.value as EventCategory;
      this.dialogRef.close(newCategory);
    } else {
      this.form.markAllAsTouched();
    }
  }  

  cancel() {
    this.dialogRef.close();
  }
}
