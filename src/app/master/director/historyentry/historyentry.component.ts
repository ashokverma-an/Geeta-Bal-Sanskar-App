import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { SectionComponent } from '../../../section/section.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatCell, MatHeaderCell, MatHeaderRow, MatRow } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsAppearanceService } from '../../masterappearance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../director-entry/director-entry.component';
import { DirectorService } from '../../../services/director.service';

@Component({
  selector: 'app-historyentry',
  standalone:true,
  providers: [provideNativeDateAdapter(),   { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
     { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },],
  imports: [MatIcon,MatSuffix,CommonModule, MatFormFieldModule, SectionComponent,MatCard,MatCardModule,
    MatLabel,MatSelect,MatOptionModule,MatInput,MatError,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSuffix,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './historyentry.component.html',
  styleUrl: './historyentry.component.scss'
})
export class HistoryentryComponent {
natureOfInterestOptions = [
    { value: 'Director', label: 'Director' },
    { value: 'Alternate Director', label: 'Alternate Director' },
    { value: 'Additional Director', label: 'Additional Director' },
    { value: 'Managing Director', label: 'Managing Director' },
    { value: 'Chief Executive Officer', label: 'Chief Executive Officer' },
    { value: 'Whole Time Director', label: 'Whole Time Director' },
    { value: 'Company Secretary', label: 'Company Secretary' },
    { value: 'Chief Financial Officer', label: 'Chief Financial Officer' },
    { value: 'Nominee Director', label: 'Nominee Director' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Designated Partner', label: 'Designated Partner' },
    { value: 'Partner', label: 'Partner' },
    { value: 'Proprietor', label: 'Proprietor' },
    { value: 'Trustee', label: 'Trustee' },
    { value: 'Shareholder', label: 'Shareholder' },
    { value: 'Others', label: 'Others' }
];
editmode:boolean=false;
  clickTimeout: any = null;
  formDataArray:any[]=[];
  displayedColumns: string[] = ['position','companyName', 'natureOfInterest','shareHolding', 'DateOfWitchInterest'];
  selectedRowIndex: number | null = null;

  editIndex: number | null = null
  showDirectorHostory:boolean=false;
  directorData: any;
  title: string = '';
  directorId: string | null = null;
  directorForm!: FormGroup;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(); // Set max date to today
  appearance = inject(InputsAppearanceService).appearance;
  designationOptions = [
    "None",
    "Designated Partner",
    "Partner",
    "Director",
    "Managing Director",
    "Alternate Director",
    "Additional Director",
    "Director Appointed in Casual Vacancy",
    "Whole Time Director",
    "CEO",
    "CFO",
    "Company Secretary (CS)",
    "Nominee Director",
    "Other"
  ];

  onReset() {
    if(this.directorForm){
      this.directorForm.reset();
    }
     
      this.router.navigate(['/director-details']);
  }
  clearEndDate(index: number) {
    this.directors.at(index).get('endDate')?.setValue(null);
  }
  constructor(private directorService: DirectorService,private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router,private route: ActivatedRoute) {}

  onSubmit() {
     
    if (this.directorForm.invalid) {
      this.snackBar.open("Please fill all required fields before submitting.", "Close", {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const newDirectorData = this.directorForm.value.directors;
    if(this.editmode){
      this.directorService.editDirectorHistoryById(Number(this.directorId),newDirectorData).subscribe(
        (response: any) => {
          this.snackBar.open("Director history Updated successfully!", "Close", {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/director']);
        },
        (error:any) => {
          this.snackBar.open("Failed to save director history. Try again.", "Close", {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
          console.error("❌ API Error:", error);
        }
      );
    }else{
      this.directorService.saveDirectorHistory(newDirectorData).subscribe(
        (response: any) => {
          this.snackBar.open("Director history saved successfully!", "Close", {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/director']);
        },
        (error:any) => {
          this.snackBar.open("Failed to save director history. Try again.", "Close", {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
          console.error("❌ API Error:", error);
        }
      );
    }
   
  }
 
  ngOnInit() {
     
    const navigation = window.history.state;
    if (navigation) {
      if(navigation.flag=='Edit'){
        this.editmode=true;
        this.directorId = navigation.id;
        this.fetchDirectorHistoryById(this.directorId);
      }else{
        this.directorId=navigation.data
        this.directorForm = this.fb.group({
          directors: this.fb.array([this.createDirectorRow(Number(this.directorId))])
        });
      }
     
    }
  
    // const savedData = localStorage.getItem('directorHistory');
    // if (savedData) 
    //   const parsedData = JSON.parse(savedData);
  
    //   // ✅ Filter savedData based on directorId
    //   const filteredData = parsedData.filter((data: any) => data.diretorId === Number(this.directorId));
    //  if(filteredData.diretorId!=0){
    //   this.showDirectorHostory=true;
    //   if (filteredData.length > 0) {
    //     this.directorForm = this.fb.group({
    //       directors: this.fb.array(filteredData.map((data: any) => this.createDirectorRowWithData(data)))
    //     });
    //   } else {
    //     this.directorForm = this.fb.group({
    //       directors: this.fb.array([this.createDirectorRow(Number(this.directorId))])
    //     });
    //   }
    //  }
  
    // } else {
    //   this.showDirectorHostory=true;
    //   this.directorForm = this.fb.group({
    //     directors: this.fb.array([this.createDirectorRow(Number(this.directorId))])
    //   });
    // }
    if(this.directorForm){
      this.directorForm.valueChanges.subscribe(() => {
        this.validateNoOverlap(this.directors);
      });
    }
  
  
  }
  get directors(): FormArray {
    return this.directorForm.get('directors') as FormArray;
  }
  fetchDirectorHistoryById(directorId: any) {
     
    this.directorService.getDirectorHistoryByHistoryId(directorId).subscribe(
      (data) => {
        
        if (data.length > 0) {
          this.directorForm = this.fb.group({
            directors: this.fb.array(data.map((data: any) => this.createDirectorRowWithData(data)))
          });
        } else {
          this.directorForm = this.fb.group({
            directors: this.fb.array([this.createDirectorRow(Number(this.directorId))])
          });
        }
      },
      (error) => {
        this.snackBar.open("No data found for selected director. Please ad first.", "Close", {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
        this.directorForm = this.fb.group({
          directors: this.fb.array([this.createDirectorRow(Number(this.directorId))])
        });
      }
    );
  }
  createDirectorRow(directorId:number): FormGroup {
    const row = this.fb.group({
      diretorId:directorId,
      companyName: [''],
      role: [''],
      startingDate: ['', [this.startDateValidator()]],
      endDate: [''],
      shareholding:['',[Validators.required]],
    shareholdingRupees:['',Validators.required],
    dateofChangeEffect:[''],
      dateofAlloted:['',Validators.required],
      natureofInterest:['',Validators.required],
      otherRole: [''],
    }, { validators: this.dateValidator() });
    row.get('startingDate')?.valueChanges.subscribe(() => this.calculateExperience(row));
    row.get('endDate')?.valueChanges.subscribe(() => this.calculateExperience(row));

    return row;
  }
 createDirectorRowWithData(data: any): FormGroup {
  
  return this.fb.group({
    diretorId:[data.directorId || '', Validators.required],
    companyName: [data.companyName || '', Validators.required],
    role: [data.role || '', Validators.required],
    startingDate: [data.startingDate || ''],
    endDate: [data.endDate || ''],
    natureofInterest:[data.natureOfInterest|| ''],
    shareholding:[data.shareholding || ''],
    shareholdingRupees:[data.shareholdingRupees || ''],
    dateofChangeEffect:[data.dateofChangeEffect || ''],
    dateofAlloted:[data.dateOfAlloted || ''],
    otherRole: [data.otherRole || ''],
  }, { validators: this.dateValidator() });
}
  
  validateNoOverlap(formArray: FormArray) {
    const dateRanges: { start: Date; end: Date }[] = [];
  
    for (let i = 0; i < formArray.controls.length; i++) {
      const group = formArray.at(i) as FormGroup;
      const start = group.get('startingDate')?.value;
      const end = group.get('endDate')?.value;
  
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
  
        for (const range of dateRanges) {
          if (
            (startDate >= range.start && startDate <= range.end) ||
            (endDate >= range.start && endDate <= range.end) ||
            (startDate <= range.start && endDate >= range.end)
          ) {
            group.get('startingDate')?.setErrors({ overlap: true });
            group.get('endDate')?.setErrors({ overlap: true });
            return;
          }
        }
  
        dateRanges.push({ start: startDate, end: endDate });
      }
    }
  }
  clearStartDate(index: number) {
    this.directors.at(index).get('startingDate')?.setValue(null);
  }
 
  dateValidator() {
    return (group: FormGroup) => {
      const start = group.get('startingDate')?.value;
      const end = group.get('endDate')?.value;
  
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
  
        if (endDate < startDate) {
          group.get('endDate')?.setErrors({ endDateBeforeStart: true });
        } else if (startDate.getTime() === endDate.getTime()) {
          group.get('endDate')?.setErrors({ sameDates: true });
        } else {
          group.get('endDate')?.setErrors(null);
        }
      }
      return null;
    };
  }
  onRoleChange(index: number, event: any) {
    const selectedValue = event.value;
    const directorGroup = this.directors.at(index) as FormGroup; // Cast to FormGroup
  
    if (selectedValue === 'Other') {
      if (!directorGroup.contains('otherRole')) {
        directorGroup.addControl('otherRole', new FormControl('', Validators.required));
      }
    } else {
      if (directorGroup.contains('otherRole')) {
        directorGroup.removeControl('otherRole');
      }
    }
  }
  
  startDateValidator() {
    return (control: FormControl) => {
      const today = new Date();
      const startDate = new Date(control.value);
      return startDate > today ? { startDateInvalid: true } : null;
    };
  }
  calculateExperience(row: FormGroup) {
    const startDate = row.get('startingDate')?.value;
    const endDate = row.get('endDate')?.value;

    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);

      if (end.isBefore(start)) {
        row.get('years')?.setValue(null);
        row.get('years')?.setErrors({ invalidDate: true });
      } else {
        const experience = parseFloat(end.diff(start, 'years', true).toFixed(1));
        row.get('years')?.setValue(experience);
        row.get('years')?.setErrors(null);
      }
    } else {
      row.get('years')?.setValue(null);
    }
  }
  addRow() {
     
    const lastRow = this.directors.at(this.directors.length - 1);
    
    if (lastRow && lastRow.invalid) {
      this.snackBar.open("Please fill all required fields before adding a new row.", "Close", {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.directors.push(this.createDirectorRow(Number(this.directorId)));
  }
  removeRow(index: number) {
    if (this.directors.length > 1) {
      this.directors.removeAt(index);
    }
  }
}
