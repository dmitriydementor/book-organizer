import { Component, HostBinding, inject, signal, ViewEncapsulation, WritableSignal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FileSelector } from '@components/file-selector/file-selector';
import { BookProcessingService } from '@services/book-processing.service';
import { BookListStore } from './store/book-list.store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'bo-book-list-viewer',
  imports: [MatToolbarModule, MatButtonModule, MatIcon, MatTooltip, FileSelector, JsonPipe],
  templateUrl: './book-list-viewer.html',
  styleUrl: './book-list-viewer.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [BookProcessingService],
})
export class BookListViewer {
  @HostBinding('class.bo-book-list-viewer') hostClass = true;

  bookProcessingService = inject(BookProcessingService);
  bookListStore = inject(BookListStore);

  books = this.bookListStore.books;

  onFileSelected(file: File) {
    this.bookProcessingService.processXmlFile(file);
  }
}
