import { Component, computed, inject, Input, OnChanges, OnDestroy, output, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Page } from '../../../../core/models/page.model';
import { CommonModule, DatePipe } from '@angular/common';
import { PageInfo } from '../../../../core/models/page-info.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, EMPTY, filter, Subscription, switchMap, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { EventCategory } from '../../../../core/models/business/event-category.model';
import { MatDialog } from '@angular/material/dialog';
import { EventCategoryModalComponent } from '../event-category-modal/event-category-modal.component';
import { ToastrService } from 'ngx-toastr';
import { EventCategoryService } from '../../../services/event-category.service';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';

@Component({
  selector: 'app-event-category-table',
  imports: [ReactiveFormsModule, MatTableModule, MatPaginator, MatButtonModule, MatIcon, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, DatePipe],
  templateUrl: './event-category-table.component.html',
  styleUrl: './event-category-table.component.scss'
})
export class EventCategoryTableComponent implements OnChanges, OnDestroy {
  dataSource: EventCategory[] = [];
  pageInfo: PageInfo = {
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  };

  edit = output<EventCategory>();
  delete = output<EventCategory>();
  loadEventCategories = output<{pageIndex: number, pageSize: number }>();


  columnsToDisplay = ['icon', 'name', 'creator', 'createdDate', 'lastUpdater', 'lastUpdatedDate', 'actions'];
  
  @Input() pageEventCategory!: Page<EventCategory>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private obs!: Subscription;

  ngOnInit(): void {
    this.loadEventCategories.emit({pageIndex: 0, pageSize: 10});
  }

  ngOnChanges() {
    if (this.pageEventCategory && this.pageEventCategory.page) {
      this.dataSource = [...this.pageEventCategory.content];
      this.pageInfo = {...this.pageEventCategory.page};
    queueMicrotask(() => {
      if (!this.paginator) return;
        this.paginator.length = this.pageEventCategory.page.totalElements;
        this.paginator.pageIndex = this.pageEventCategory.page.number;
        this.paginator.pageSize = this.pageEventCategory.page.size;
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
    this.loadEventCategories.emit({pageIndex: event.pageIndex, pageSize: event.pageSize});
  }
}
