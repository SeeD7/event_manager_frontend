import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-confirm-modal',
  imports: [],
  templateUrl: './cancel-confirm-modal.component.html',
  styleUrl: './cancel-confirm-modal.component.scss',
})
export class CancelConfirmModalComponent {

  protected data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);

  validate() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
