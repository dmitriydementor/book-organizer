import { ChangeDetectionStrategy, Component, HostBinding, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Book } from '../../pages/book-list-viewer/store/book.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

export interface EditBookDialogData {
  isCreate: boolean;
  book?: Book;
}

@Component({
  selector: 'bo-edit-book-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-book-dialog.html',
  styleUrl: './edit-book-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditBookDialog implements OnInit {
  @HostBinding('class.bo-edit-book-dialog') hostClass = true;
  dialogRef = inject(MatDialogRef);
  fb = inject(FormBuilder);
  data = inject<EditBookDialogData>(MAT_DIALOG_DATA);
  form = this.buildFormGroup();

  buildFormGroup() {
    return new FormGroup({
      author: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      pages: new FormControl<number | null>(null, [Validators.required]),
      id: new FormControl<number | null>(null),
    })
  }

  ngOnInit(): void {
    if (this.data.book) {
      this.form.patchValue(this.data.book);
    }
  }

  save() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.dialogRef.close({ ...value });
    }
  }
}
