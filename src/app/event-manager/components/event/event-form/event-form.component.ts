import { Component, OnInit, computed, inject, input } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventCategoryService } from '../../../services/event-category.service';
import { EventService } from '../../../services/event.service';
import { EventCategoryLight } from '../../../../core/models/business/event-category.model';
import { Event, EventForm } from '../../../../core/models/business/event.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinner
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(EventCategoryService);
  private eventService = inject(EventService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loading = false;

  eventInput:Event | null=null;

  id = input<string>(); 

  isEditMode = computed(() => !!this.id());
  submitButtonText = computed(() => this.isEditMode() ? 'Modifier l\'évènement' : 'Créer l\'évènement');
  formTitle = computed(() => this.isEditMode() ? 'Modifier l\'évènement' : 'Nouveau évènement');

  // Récupération des catégories disponibles pour la dropdown (transformée en Signal)
  category = toSignal(this.categoryService.getAllEventCategories(), { initialValue: [] as EventCategoryLight[] });

  // 3. LE FORMULAIRE REACTIF
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    location: [''],
    category: [[] as EventCategoryLight[], [Validators.required]],
    allDay: [false],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null, [Validators.required]],
    spotsAvailable: [0]
  });

  ngOnInit(): void {
    if (this.isEditMode()) {
      let id = Number(this.id());
      this.eventService.getEventById(id).subscribe({
        next: (response) => {
          console.log(JSON.stringify(response.category));
          this.eventInput = response;
          this.form.patchValue({
            name: response.name,
            description: response.description,
            location: response.location,
            category: response.category, // s'assurer que les objets match avec le trackBy du select
            allDay: response.allDay,
            startDate: response.startDate,
            endDate: response.endDate,
            spotsAvailable: response.spotsAvailable
          });
        },
        error: (err) => console.error(err)
      });
    }
  }

  // Permet de retirer une catégorie directement depuis les capsules (Chips)
  removeCategory(categoryToRemove: EventCategoryLight): void {
    const currentSelected = this.form.controls.category.value || [];
    const updatedSelected = currentSelected.filter(c => c.id !== categoryToRemove.id);
    this.form.controls.category.setValue(updatedSelected);
    this.form.controls.category.markAsDirty();
  }

  // Comparateur pour que le mat-select retrouve les catégories sélectionnées en mode Édition
  compareCategories(c1: EventCategoryLight, c2: EventCategoryLight): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value as EventForm;
    
    if (this.isEditMode()) {
      formValue.id = Number(this.id())
      if(this.eventInput != null){
        formValue.state = this.eventInput?.state;
      }
      this.eventService.updateEvent(formValue).pipe(
              tap((saved) => {
                this.loading = false;
                if (saved) {
                  this.toastr.success('Mise à jour de l\'évènement avec succés !', 'Success');
                  this.router.navigateByUrl('/event-manager');
                } else {
                  this.toastr.error('Echec de la mise à jour de l\'évènement.', 'Error');
                }
              }),
            ).subscribe();
    } else {
      // Logique de création pure
      this.eventService.createEvent(formValue).pipe(
              tap((saved) => {
                this.loading = false;
                if (saved) {
                  this.toastr.success('La création de votre évènement à réussie !', 'Success');
                  this.router.navigateByUrl('/event-manager/profile');
                } else {
                  this.toastr.error('Echec de la création de votre évènement.', 'Error');
                }
              }),
            ).subscribe();
    }
  }
}