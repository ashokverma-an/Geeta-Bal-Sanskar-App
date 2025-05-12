
import { AfterViewInit, Component, inject, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { InputsAppearanceService } from '../../masterappearance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel, MatSelect, MatSelectModule, MatSuffix } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule, MatOptionSelectionChange, NativeDateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DirectorService } from '../../../services/director.service';
import { CompanyService } from '../../../services/company.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopaitalCompanyComponent } from '../copaital-company/copaital-company.component';
import { GenratedocumentComponent } from '../../genratedocument/genratedocument.component';
// Define custom date format
export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD-MM-YYYY' },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (!value) return null;
    const parsedDate = moment(value, 'DD-MM-YYYY', true);
    return parsedDate.isValid() ? parsedDate.toDate() : null;
  }

  override format(date: Date, displayFormat: string): string {
    return moment(date).format('DD-MM-YYYY');
  }
}

@Component({
  selector: 'app-companydetail',
  providers: [provideNativeDateAdapter(), { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },],
  standalone: true,
  imports: [MatIcon, CommonModule, MatFormFieldModule, MatDatepickerModule,GenratedocumentComponent,
    MatExpansionModule,
    MatLabel,
    MatSelect,
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
    MatSelectModule, MatTable,
    MatCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatHeaderRow, MatProgressSpinnerModule,  CopaitalCompanyComponent,MatRow, MatCell,],
  templateUrl: './companydetail.component.html',
  styleUrl: './companydetail.component.scss'
})
export class CompanydetailComponent {
  showGenerateDoc = true;
  companyData:any;
  loading: boolean = false;
  ShowDirectorTable:boolean=true;
  capitalDetails:any[]=[];
  displayedColumns1: string[] = ['HeadsOfCapital','EquetyShares', 'PreferenceShare','Total'];
  dataSource1 = new MatTableDataSource<any>(this.capitalDetails);
  drectorList: any[] = [];
  selectedRowIndex: number | null = null;
  clickTimeout: any = null;
  formDataArray: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['position', 'nameOfDirector', 'designationOfDirector', 'directorshipType', 'dateOfAppointment', 'dateOfCessation', 'actions'];
  editIndex: number | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  capitalTypes = ['Authorized Capital', 'Issued Capital', 'Subscribed Capital', 'Paid-up Capital'];
  companyId: number = 0;
  buttonValue = "Submit";
  maxDate = new Date();  // Current date
  managingDirector: any[] = [];
  isEditMode = false;
  initialFormData: any;
  appearance = inject(InputsAppearanceService).appearance;
  companyForm: FormGroup;
  companyDrectorKMP:FormGroup;
  companyCapital:FormGroup;
  @ViewChild('accordion') accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  countryTypes = ['India', 'Bhaarat', 'Others'];
  companyTypes = [
    'Private Limited',
    'Public Limited',
    'Section 8 Private Limited',
    'Section 8 Public Limited',
    'Producer Limited',
    'One Person Company',
    'Others'
  ];
  postDirectorTypes = [
    'Director',
    'Managing Director',
    'Alternate Director',
    'Additional Director',
    'Director Appointed in Casual Vacancy',
    'Whole Time Director',
    'CEO',
    'CFO',
    'Company Secretary (CS)',
    'Nominee Director',
    'Others'
  ];

  statesInIndia = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  sectors = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'];
  districtsInRajasthan = [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Sawai Madhopur",
    "Tonk",
    "Udaipur"
  ];
  directorshipTypes = ['Executive Director', 'Non-Executive Director', 'Chairman'];
  cinPattern = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private directorService: DirectorService,
        private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      companyId: 0,
      sector: [''],
      otherpostOfDirector: [''],
      ceoManagingDirector: [''],
      gstNumber: [''],
      tanNumber: [''],
      panNumber: [''],
      // shareholders: this.fb.array([this.createShareholder()]),
      // capitals: this.fb.array([this.createCapitalFormGroup()]),
    });
    this.companyDrectorKMP= this.fb.group({
      companyId: 0,
      directors: this.fb.array([this.createDirectorFormGroup()]),
    });
    this.companyCapital= this.fb.group({
      companyId: 0,
      capitals: this.fb.array([this.createCapitalFormGroup()]),
    });
    
    this.companyDrectorKMP.get('directorshipType')?.setValidators([
      Validators.required,
      () => this.validateDirectorshipType(),
    ]);
  }

  
  ngOnInit(): void {
    this.GetDirectorList();
    this.loadFormData();

    this.route.paramMap.subscribe(() => {
      const data = history.state.data;
      if (data) {
         
        this.initialFormData = data;
        this.companyId=this.initialFormData.companyId;
        this.companyDrectorKMP.get('companyId')?.setValue(this.companyId);
        this.companyData=data;
        this.onFetchCompanyDirector();
        const storedData = JSON.parse(localStorage.getItem('companyDetailsStep2') || '[]');
        const existingEntry = storedData.find((item: any) => item.companyId === data.position);
        if (existingEntry) {
          this.companyForm.patchValue(existingEntry);
          this.isEditMode = true;
          this.buttonValue = "Update";
        } else {
          this.companyForm.get('companyId')?.setValue(data.position);
        }
      }
    });
    const formDataArray = JSON.parse(localStorage.getItem('DirectorformDataArray') || '[]');

    this.managingDirector = formDataArray.map((item: any, index: number) => ({
      arrayNo: index + 1, // Assuming array.no is the index + 1
      arrayName: `${item.firstName.trim()} ${item.MiddleName ? item.MiddleName.trim() + ' ' : ''}${item.LastName.trim()}`.trim()
    }));
    // this.companyForm.get('numShares')?.valueChanges.subscribe(() => this.calculateAuthorizedCapital());
    // this.companyForm.get('shareValue')?.valueChanges.subscribe(() => this.calculateAuthorizedCapital());
    // this.companyForm.get('issuedSubscribedCapital')?.valueChanges.subscribe(() => this.validateCapitalLimits());
    // this.companyForm.get('paidUpCapital')?.valueChanges.subscribe(() => this.validateCapitalLimits());
  }
  onSelectionChange(event: MatOptionSelectionChange, type: string, index: number) {
    const directorGroup = this.directors.at(index);
    const selectedValues = directorGroup.get('directorshipType')?.value || [];

    if (event.isUserInput) {
      if (
        (type === 'Executive Director' && selectedValues.includes('Non-Executive Director')) ||
        (type === 'Non-Executive Director' && selectedValues.includes('Executive Director'))
      ) {
        event.source.deselect(); // Prevent conflicting selection
      }
    }
  }
  // calculateAuthorizedCapital() {
  //   const numShares = Number(this.companyForm.get('numShares')?.value || 0);
  //   const shareValue = Number(this.companyForm.get('shareValue')?.value || 0);
  //   const totalAuthorizedCapital = numShares * shareValue;

  //   this.companyForm.patchValue({ authorizedCapital: totalAuthorizedCapital }, { emitEvent: false });
  //   this.validateCapitalLimits();
  // }
  // validateCapitalLimits() {
  //   const authorizedCapital = Number(this.companyForm.get('authorizedCapital')?.value || 0);
  //   const issuedCapital = Number(this.companyForm.get('issuedSubscribedCapital')?.value || 0);
  //   const paidUpCapital = Number(this.companyForm.get('paidUpCapital')?.value || 0);

  //   if (issuedCapital > authorizedCapital) {
  //     this.companyForm.get('issuedSubscribedCapital')?.setErrors({ exceedsAuthorized: true });
  //   } else {
  //     this.companyForm.get('issuedSubscribedCapital')?.setErrors(null);
  //   }

  //   if (paidUpCapital > authorizedCapital) {
  //     this.companyForm.get('paidUpCapital')?.setErrors({ exceedsAuthorized: true });
  //   } else {
  //     this.companyForm.get('paidUpCapital')?.setErrors(null);
  //   }
  // }
  setDefaultValue(controlName: string, value: string) {
    const control = this.companyForm.get(controlName);
    if (control && !control.value) {
      control.setValue(value);
    }
  }
  onSubmit() {
     
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      const currentDate = new Date();

      let formDataArray = JSON.parse(localStorage.getItem('companyDetailsStep2') || '[]');
      let logArray = JSON.parse(localStorage.getItem('companyDetailsStep2Log') || '[]');

      if (this.isEditMode) {
        const editIndex = formDataArray.findIndex((item: any) => item.registrationNumber === this.initialFormData.registrationNumber);
        if (editIndex !== -1) {
          formDataArray[editIndex] = formData;
          logArray.push({
            action: 'update',
            date: currentDate,
            user: 'User',
            details: JSON.stringify(formData)
          });
        }
      } else {
        // Add new entry
        formDataArray.push(formData);
        logArray.push({
          action: 'create',
          date: currentDate,
          user: 'User',
          details: JSON.stringify(formData)
        });
      }

      localStorage.setItem('companyDetailsStep2', JSON.stringify(formDataArray));
      localStorage.setItem('companyDetailsStep2Log', JSON.stringify(logArray));
      // const storedData = JSON.parse(localStorage.getItem('companyDetailsStep2') || '[]');
      // const existingEntry = storedData.find((item: any) => item.companyId === data.position);
      // if (existingEntry) {
      //   this.companyForm.patchValue(existingEntry);
      // } else {
      //   this.companyForm.get('companyId')?.setValue(data.position);
      // }


      this.snackBar.open(this.isEditMode ? "Company details updated successfully." : "Company registration details submitted successfully.", "Close", { duration: 3000 });
      this.router.navigate(['/company']);
    }
  }

  onReset() {
    if (this.isEditMode) {
      this.router.navigate(['/company']);
    } else {
      this.companyForm.reset();
      this.router.navigate(['/company']);
    }

  }
  preventKeyPress(event: KeyboardEvent) {
    event.preventDefault();
  }
  expandAll() {
    this.accordion.openAll();
  }

  collapseAll() {
    this.accordion.closeAll();
  }
  preventInvalidChars(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const inputChar = event.key;

    // Allow control keys (Backspace, Delete, Arrow keys, Tab)
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(inputChar)) {
      return;
    }

    // Ensure only numbers, one decimal point, and ₹ symbol are allowed
    const regex = /^[+₹]?[0-9]*\.?[0-9]{0,2}$/;

    let newValue = inputElement.value + inputChar;

    // If the user presses ₹ at the beginning, allow it
    if (inputChar === '₹' && !inputElement.value.includes('₹')) {
      newValue = '₹' + inputElement.value;
      inputElement.value = newValue; // Auto-add ₹
      event.preventDefault();
      return;
    }

    // If invalid, prevent input
    if (!regex.test(newValue)) {
      event.preventDefault();
    }
  }


  preventInvalidEmail(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const inputElement = event.target as HTMLInputElement;
    const regex = /^[a-zA-Z0-9@._-]*$/;

    // Allow control keys like backspace, delete, left and right arrows
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      return;
    }

    const currentValue = inputElement.value;
    const newValue = currentValue + inputChar;

    if (!regex.test(newValue)) {
      event.preventDefault();
    }
  }

  // Optional: Custom email validator
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const value = control.value;
    if (value && !emailPattern.test(value)) {
      return { invalidEmail: true };
    }
    return null;
  }
  ngAfterViewInit() {
    this.ngZone.run(() => {
      this.panels.forEach(panel => panel.open());
    });
  }
  convertToUppercase() {
    const cinValue = this.companyForm.get("cin")?.value;
    if (cinValue) {
      this.companyForm.get("cin")?.setValue(cinValue.toUpperCase(), { emitEvent: false });
    }
  }
  validateDirectorshipType() {
    const selected = this.companyForm.get('directorshipType')?.value || [];

    if (selected.includes('Executive Director') && selected.includes('Non-Executive Director')) {
      return { invalidSelection: true }; // ED & NED cannot be selected together
    }
    if (selected.length > 2) {
      return { maxSelection: true }; // More than 2 selections are not allowed
    }
    if (selected.length === 2 && !selected.includes('Chairman')) {
      return { chairmanRequired: true }; // At least one must be "Chairman"
    }

    return null;
  }
  get directors(): FormArray {
    return this.companyDrectorKMP.get('directors') as FormArray;
  }

  createDirectorFormGroup(): FormGroup {
    return this.fb.group({
      ceoManagingDirector: ['', Validators.required],
      postOfDirector: ['', Validators.required],
      otherpostOfDirector: [''],
      directorshipType: [[], Validators.required],
      dateOfAppointment: ['', Validators.required],
      dateOfCessation: ['']
    });
  }


  addDirector(): void {
     
    const lastShareholder = this.directors.at(this.directors.length - 1);
    if (!lastShareholder.valid) {
      this.snackBar.open('Please complete the previous shareholder details before adding a new one.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.directors.push(this.createDirectorFormGroup());
  }

  removeDirector(index: number): void {
    if (this.directors.length > 1) {
      this.directors.removeAt(index);
    }
  }
  // Disable Future Dates
  dateFilter = (date: Date | null): boolean => {
    return !!date && date <= this.maxDate;
  };

  onDateInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (moment(input, 'DD-MM-YYYY', true).isValid()) {
      this.companyForm.get('dateOfIncorporation')?.setValue(moment(input, 'DD-MM-YYYY').toDate());
    }
  }
  // Restrict Keyboard Input to Numbers, Slash (-), or Backspace
  allowManualInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '-', '/'];
    if (!event.key.match(/[0-9]/) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  formatDate(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length >= 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + '-' + value.slice(5, 9);

    this.companyForm.patchValue({ dob: value }, { emitEvent: false });
  }
  validateDateFormat(control: FormControl) {
    const inputDate = control.value;
    if (inputDate && !moment(inputDate, 'DD-MM-YYYY', true).isValid()) {
      return { invalidDate: true };
    }
    return null;
  }
  clearDateofAppointment(index: any) {
     
    console.log("");
  }
  authorizedCapitalValidator(form: AbstractControl) {
    const capitals = (form.get('capitals') as FormArray).controls;

    let authorizedTotal = 0;
    let otherTotal = 0;

    capitals.forEach(control => {
      const type = control.get('capitalType')?.value;
      const amount = control.get('capitalAmount')?.value || 0;

      if (type === 'Authorized Capital') {
        authorizedTotal = amount;
      } else if (type === 'Issued Capital' || type === 'Subscribed Capital' || type === 'Paid-up Capital') {
        otherTotal += amount;
      }
    });

    return authorizedTotal > otherTotal ? null : { authorizedCapitalInvalid: true };
  }
  handleKeyDown(event: KeyboardEvent, row: any, rowIndex: number) {
    event.preventDefault();
    const totalRows = this.dataSource.data.length;
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
      this.openDirectorHistoryDialog(row);
    }
  }
  onRowClick(rowIndex: number, row: any) {
    if (this.selectedRowIndex === rowIndex) {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        this.openDirectorHistoryDialog(row);
      }
    } else {
      this.selectedRowIndex = rowIndex;
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
    }, 300);
  }
  openDirectorHistoryDialog(rowData: any) {
     
    this.router.navigate(['/company-detail'], {
      state: {
        title: 'Cmpany Details',
        data: rowData
      }
    });
  }
  navigateToDetails(element: any): void {
    this.router.navigate(['/company-details'], { state: { data: element } });
  }
  loadFormData() {
     
    // this.formDataArray = JSON.parse(localStorage.getItem('companyformDataArray') || '[]');
    // this.dataSource.data = this.formDataArray.map((item: any, index: number) => ({
    //   position: index + 1,
    //   ...item
    // }));
  }
  GetDirectorList() {
    this.directorService.getAllDirectors().subscribe({
      next: (data) => {
         
        this.drectorList = data;
        console.log('✅ Fetched data from API:', this.dataSource.data);
      },
      error: (err) => {
        console.error('⚠️ No data found.', err);
      }
    });
  }
  onDirectorSubmit() {
    this.loading = true;
    
    this.companyService.saveCompanyDirectorMapping(this.companyDrectorKMP.value).subscribe(
      response => {
         ;
        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        setTimeout(() => {
          this.onFetchCompanyDirector();
          this.ShowDirectorTable = !this.ShowDirectorTable;
          this.loading = false;
        }, 2000);
        
      },
      error => {
        this.snackBar.open('Error saving company-director mapping', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.loading = false;
      }
    );
  }
  
  onFetchCompanyDirector() {
    this.companyService.getCompanyDrectorList(this.companyId)
      .subscribe(
        response => {
           
          this.dataSource.data= response.directors.map((item: any, index: number) => ({
            position: index + 1,
            ...item,
          }));
        },
        error => {
          this.snackBar.open('⚠️ No data found Director/KMP.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
  }
  loadFormDatadirector() {
    this.formDataArray = JSON.parse(localStorage.getItem('DirectorformDataArray') || '[]');
    this.dataSource.data=this.capitalDetails;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  AddDirectorToComapnay(){
    this.ShowDirectorTable= !this.ShowDirectorTable;
  }



  get capitals(): FormArray {
    return this.companyCapital.get('capitals') as FormArray;
  }

  createCapitalFormGroup(): FormGroup {
    return this.fb.group({
      capitalType: ['', Validators.required],
      equityShare: [null, [Validators.required]],
      preferenceShare: [null, [Validators.required, Validators.max(100), Validators.pattern(/^\d{1,3}$/)]],
    });
  }
  addCapital(): void {
    this.capitals.push(this.createCapitalFormGroup());
  }

  removeCapital(index: number): void {
    this.capitals.removeAt(index);
  }

  calculateTotal(index: number): number {
    const capital = this.capitals.at(index).value;
    return (capital.equityShare || 0) * (capital.preferenceShare || 0);
  }

  isCapitalSelected(type: string, index: number): boolean {
    return this.capitals.controls.some((control, i) => control.get('capitalType')?.value === type && i !== index);
  }

  onCapitalTypeChange(index: number): void {
    const selectedType = this.capitals.at(index).get('capitalType')?.value;
    if (selectedType === 'Authorized Capital' || selectedType === 'Paid-up Capital') {
      this.capitals.at(index).get('capitalType')?.setValidators(Validators.required);
    }
  }
  createShareholder(): FormGroup {
    return this.fb.group({
      name: [''],
      sharePercentage: ['', [Validators.min(0), Validators.max(100)]],
      contactNumber: [''],
      emailAddress: ['', [this.emailValidator]]
    });
  }
  get shareholders(): FormArray {
    return this.companyForm.get('shareholders') as FormArray;
  }

  addShareholder(): void {
     
    const lastShareholder = this.shareholders.at(this.shareholders.length - 1);

    if (!lastShareholder.valid) {
      this.snackBar.open('Please complete the previous shareholder details before adding a new one.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.shareholders.push(this.createShareholder());
  }

  removeShareholder(index: number): void {
    this.shareholders.removeAt(index);
  }
  editRow(row:any){

  }
  deleteRow(row:any){

  }
 
}
