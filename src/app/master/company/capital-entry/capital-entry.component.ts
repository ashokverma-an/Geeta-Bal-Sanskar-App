import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { InputsAppearanceService } from '../../masterappearance.service';
import moment from 'moment';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../companydetail/companydetail.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RupeesPipe } from '../../../rupees.pipe';

@Component({
  selector: 'app-capital-entry',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },],
  imports: [RupeesPipe,MatCardTitle, MatCard,CommonModule, MatFormFieldModule, MatDatepickerModule, MatIcon,
    MatExpansionModule,
    MatLabel,
    MatOptionModule,
    MatInput,
    MatError,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    MatFormFieldModule,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSuffix,
    MatSelectModule,MatTable, MatCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatHeaderRow, MatProgressSpinnerModule,MatRow, MatCell,],
  templateUrl: './capital-entry.component.html',
  styleUrl: './capital-entry.component.scss'
})
export class CapitalEntryComponent {
  companyData:any;
  ShowEntryOfCapital:boolean=true;
  tableloading:boolean=false;
  submitloading:boolean=false;
  clickTimeout: any = null;
  capitaldataOfCompany :any[]=[];
  companyId:number=0;
  companyType:string='';
  maxDate = new Date(); 
  appearance = inject(InputsAppearanceService).appearance;
  @Input() capitalForm!: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex: number | null = null;
  displayedColumns: string[] = ['capitalType','DateOfResolution','TypeOfShare', 'NoOfShares', 'NominalValueOfPerShare', 'Total'];
  constructor(private fb: FormBuilder,     private companyService: CompanyService, private router: Router,   private snackBar: MatSnackBar,private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
     ;
    this.tableloading = true;
    this.route.paramMap.subscribe(() => {
      const data = history.state.row;
      this.companyId = history.state.flag;
      this.companyData=history.state.data
      if (data) {
        this.companyType = data.capitalType;
      }
    });
    if (!this.capitalForm) {
      this.capitalForm = this.fb.group({
        entries: this.fb.array([this.createCapitalEntry()])
      });
    }
    setTimeout(() => {
      this.fetchShareCapitalData();
      this.tableloading = false;
    }, 3000);
  }
  
  // Method to create a new capital entry
  createCapitalEntry(): FormGroup {
    return this.fb.group({
      companyId : [this.companyId],
      dateOfResolution: ['', Validators.required],
      typeOfShare: ['Equity', Validators.required],
      numberOfShares: [0, [Validators.required, Validators.min(1)]],
      nominalValue: [0, [Validators.required, Validators.min(0)]],
      capitalType:[this.companyType],
      totalAmount: [{ value: 0, disabled: true }],
    });
  }

  // Get the 'entries' array from the form group
  get entries() {
    return this.capitalForm.get('entries') as FormArray;
  }

  // Method to add a new capital entry row
  addRow() {
     
    const lastEntry = this.entries.at(this.entries.length - 1);
    if (!lastEntry.valid) {
      this.snackBar.open('Please fill in all fields of the previous entry before adding a new one.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }
    this.entries.push(this.createCapitalEntry());
  }
  removeRow(index: number) {
    this.entries.removeAt(index);
  }
  calculateTotalAmount(entry: any, index: number) {
    const totalAmount = entry.numberOfShares * entry.nominalValue;
    this.entries.at(index).patchValue({ totalAmount });
  }
  onSave() {
    console.log(this.capitalForm.value);
  }

  onReset() {
    this.capitalForm.reset();
    this.router.navigate(['/company-detail'], {
      state: {
        title: 'Cmpany Details',
        data: this.companyData
      }
    });

  }
  onSubmit(): void {
    if (this.capitalForm.valid) {
      const shareCapitalArray = this.capitalForm.value.entries;
      this.submitloading = true;
  
      // Call the service to save the company share capital
      this.companyService.saveCompanyShareCapital(shareCapitalArray).subscribe(
        (response) => {
          // Handle success response
          this.snackBar.open(response.message, '', {
            duration: 3000,
          });
          setTimeout(() => {
            // Reset the form and fetch updated data
            this.capitalForm.reset();
            this.fetchShareCapitalData();
            this.submitloading = false;
          }, 3000);
        },
        (error) => {
          if (error.status === 400) {
            this.snackBar.open(error.error.error, '', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Failed to save data. Please try again.', '', {
              duration: 3000,
            });
          }
          this.submitloading = false;
        }
      );
    } else {
      // If form is not valid, show error message
      this.snackBar.open('Please fill all required fields.', '', {
        duration: 3000,
      });
      this.submitloading = false;
    }
  }
  
  
  dateFilter = (date: Date | null): boolean => {
    return !!date && date <= this.maxDate;
  };

  onDateInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    // if (moment(input, 'DD-MM-YYYY', true).isValid()) {
    //   this.companyForm.get('dateOfIncorporation')?.setValue(moment(input, 'DD-MM-YYYY').toDate());
    // }
  }
  allowManualInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '-', '/'];
    if (!event.key.match(/[0-9]/) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  formatDate(event: any) {
    let value = event.replace(/\D/g, '');
    if (value.length >= 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + '-' + value.slice(5, 9);

    this.capitalForm.patchValue({ dob: value }, { emitEvent: false });
  }
  validateDateFormat(control: FormControl) {
    const inputDate = control.value;
    if (inputDate && !moment(inputDate, 'DD-MM-YYYY', true).isValid()) {
      return { invalidDate: true };
    }
    return null;
  }
  clearDateofIncorporation() {
    this.capitalForm.get('dateOfIncorporation')?.setValue(null);
  }
  fetchShareCapitalData(): void {
    this.companyService.fetchCompanyShareCapital(this.companyId).subscribe(
      (response) => {
        this.capitaldataOfCompany = response; 
        const filteredData = response.filter(
          (item: any) => item.capitalType === this.companyType
        );
        this.dataSource.data = filteredData;
      },
      (error) => {
        this.snackBar.open('Failed to fetch data. Please try again.', '', {
          duration: 3000,
        });
      }
    );
  }
  onRowClick(rowIndex: number, row: any) {
    if (this.selectedRowIndex === rowIndex) {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        // this.openDirectorHistoryDialog(row);
      }
    } else {
      this.selectedRowIndex = rowIndex;
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
    }, 300);
  }

  handleKeyDown(event: KeyboardEvent, row: any, rowIndex: number) {
    event.preventDefault();
    const totalRows = this.dataSource.data.length;;
    if (event.key === 'ArrowDown') {
      if (this.selectedRowIndex === null) {
        this.selectedRowIndex = 0;
      } else if (this.selectedRowIndex < totalRows - 1) {
        this.selectedRowIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      if (this.selectedRowIndex !== null && this.selectedRowIndex > 0) {
        this.selectedRowIndex--;
      }
    } else if (event.key === 'Enter' && this.selectedRowIndex !== null) {
    } else if (event.ctrlKey && event.key.toLowerCase() === 'v') {
    } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
    } else if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    }
  }
}