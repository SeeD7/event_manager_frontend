import { KeyValuePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { RoleEnum } from '../../../../core/models/role.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-role-modal',
  imports: [MatSelectModule, KeyValuePipe, ReactiveFormsModule],
  templateUrl: './update-role-modal.component.html',
  styleUrl: './update-role-modal.component.scss',
})
export class UpdateRoleModalComponent implements OnInit {
  protected data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private formBuilder = inject(FormBuilder);

  form!: FormGroup;

  roles = RoleEnum;

  ngOnInit() {
    this.form = this.formBuilder.group({
      role: [Object.entries(this.roles).find(([, val]) => val === this.data.role)?.[0], Validators.required]
    });
  }

  validate() {
    setTimeout(() => {
      this.dialogRef.close(this.form.value.role);
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
