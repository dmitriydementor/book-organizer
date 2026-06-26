import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FileSelector } from '@components/file-selector/file-selector';
import { BookProcessingService } from '@services/book-processing.service';
import { BookListStore } from './store/book-list.store';
import { Book } from './store/book.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule, Sort } from '@angular/material/sort'
import { MatDialog } from '@angular/material/dialog';
import { EditBookDialog, EditBookDialogData } from '@components/edit-book-dialog/edit-book-dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'bo-book-list-viewer',
  imports: [
    MatToolbarModule, MatButtonModule, MatIcon, MatTooltip, MatTableModule,
    MatPaginatorModule, MatSortModule, MatInputModule,

    ReactiveFormsModule,

    FileSelector
  ],
  templateUrl: './book-list-viewer.html',
  styleUrl: './book-list-viewer.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [BookProcessingService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListViewer implements AfterViewInit, OnInit {
  @HostBinding('class.bo-book-list-viewer') hostClass = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  bookProcessingService = inject(BookProcessingService);
  bookListStore = inject(BookListStore);

  books = this.bookListStore.sortedBooks;
  booksCount = this.bookListStore.booksCount;

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  displayedColumns: string[] = ['title', 'author', 'pages', 'edit'];
  dataSource = new MatTableDataSource<Book>([]);

  constructor() {
    effect(() => {
      const books = this.books();

      this.dataSource.data = books;
    });
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.bookListStore.updateQuery(query);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 200;
  }

  onSortChange(sortState: Sort) {
    this.bookListStore.updateOrder(sortState.direction);
  }

  onFileSelected(file: File) {
    this.bookProcessingService.processXmlFile(file);
  }

  editBook(book: Book) {
    this.matDialog.open<EditBookDialog, EditBookDialogData, Book>(EditBookDialog, { data: { book, isCreate: false } }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(res => {
      if (res) {
        this.bookListStore.editBook(res);
      }
    });
  }

  addBook() {
       this.matDialog.open<EditBookDialog, EditBookDialogData, Book>(EditBookDialog, { data: { isCreate: true } }).afterClosed().pipe(
        takeUntilDestroyed(this.destroyRef),
       ).subscribe(res => {
      if (res) {
        this.bookListStore.addBook(res);
      }
    });
  }

  saveToXml() {
    this.bookProcessingService.saveToXml();
  }
}

