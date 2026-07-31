import { Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { PageInfo } from '../../../../core/models/page-info.model';
import { Event } from '../../../../core/models/business/event.model';
import { Page } from '../../../../core/models/page.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { EventStateEnum } from '../../../../core/models/business/event-state.enum';
import { debounceTime, Subscription } from 'rxjs';
import { SearchEvent } from '../../../../core/models/search/search-event.model';

@Component({
  selector: 'app-user-event-table',
  imports: [ReactiveFormsModule, MatTableModule, MatPaginator, MatButtonModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatIcon, DatePipe],
  templateUrl: './user-event-table.component.html',
  styleUrl: './user-event-table.component.scss',
})
export class UserEventTableComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  dataSource: Event[] = [];
  pageInfo: PageInfo = {
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  };

  edit = output<Event>();
  delete = output<Event>();
  changeState = output<Event>();
  loadEvent = output<{search: SearchEvent, pageIndex: number, pageSize: number}>();

  columnsToDisplay = ['name', 'category', 'state', 'startDate', 'endDate', 'spotsAvailable', 'participants', 'createdDate', 'lastUpdatedDate', 'actions'];

  pageEvent = input<Page<Event>>();

  state = EventStateEnum;
  public stateOptions = Object.values(EventStateEnum);

  private obs!: Subscription;

  mainForm!: FormGroup;
  stateCtrl!: FormControl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.stateCtrl = this.formBuilder.control([EventStateEnum.DRAFT,EventStateEnum.PUBLISHED]);

    this.mainForm = this.formBuilder.group({
      state: this.stateCtrl,
    });

    this.obs = this.mainForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(data => {
        this.loadEvent.emit({search: this.mainForm.value ,pageIndex: 0, pageSize: 10});
      });
  }

  ngOnChanges() {
    const pageData = this.pageEvent();
    if (pageData && pageData.page) {
      this.dataSource = [...pageData.content];
      this.pageInfo = {...pageData?.page};
    queueMicrotask(() => {
      if (!this.paginator) return;
        this.paginator.length = pageData.page.totalElements;
        this.paginator.pageIndex = pageData.page.number;
        this.paginator.pageSize = pageData.page.size;
      });
    }
  }

  ngOnDestroy(): void {
    // Always unsubscribe to prevent memory leaks
    if (this.obs) {
      this.obs.unsubscribe();
    }
  }

  onPageChange(event: PageEvent) {
    this.loadEvent.emit({search: this.mainForm.value, pageIndex: event.pageIndex, pageSize: event.pageSize});
  }

}
