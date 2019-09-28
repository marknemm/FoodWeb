import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    MatDatepickerModule,
    MatListModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatBadgeModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    MatDatepickerModule,
    MatListModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatBadgeModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } }
  ]
})
export class MaterialModule {}

