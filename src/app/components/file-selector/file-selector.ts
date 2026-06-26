import { Component, ElementRef, output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'bo-file-selector',
  imports: [],
  templateUrl: './file-selector.html',
  styleUrl: './file-selector.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class FileSelector {
  fileSelected = output<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  onFileSelected(files: FileList | null) {
    if (files?.length) {
      const file: File = files[0];
      this.fileSelected.emit(file);

      this.resetInput();
    }
  }

  resetInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
