
import { MatDialogModule } from '@angular/material/dialog';
import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { InputsAppearanceService } from '../../masterappearance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel, MatSelect, MatSelectModule, MatSuffix } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter ,MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionComponent } from '../../../section/section.component';
import moment from 'moment';
import { MatRadioModule } from '@angular/material/radio'; // Import MatRadioModule
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DirectorService } from '../../../services/director.service';

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
  providers: [provideNativeDateAdapter(),   { provide: DateAdapter, useClass: CustomDateAdapter },
   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },],
  selector: 'app-director-entry',
  standalone: true,
  imports: [MatCheckboxModule,MatRadioModule,CommonModule, MatFormFieldModule,SectionComponent,MatIcon,
    MatLabel,
    MatSelect,
    MatOptionModule,
    MatInput,
    MatError,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSuffix,
    MatSelectModule],
  templateUrl: './director-entry.component.html',
  styleUrl: './director-entry.component.scss'
})
export class DirectorEntryComponent {
  educationOptions: string[] = [
    'X/SSLC/Junior/Equivalent',
    'XII/SSC/High/Equivalent',
    'Graduation/Bachelor/Equivalent',
    'Post Graduate/Master/Equivalent',
    'Professional',
    'Executive Program',
    'Doctorate',
    'Diploma'
  ];
  
  showOtherEducation = false;
  maxDate = this.getMinAgeDate();
  ViewDirector:boolean=false;
  minDate = new Date(1990, 0, 1);  // January 1, 2000
  // maxDate = new Date();  // Current date
  bttnvalue = "submit";
  isEditMode = false;
  initialFormData: any;
  formDataArray: any[] = [];
  appearance = inject(InputsAppearanceService).appearance;
  directorForm: FormGroup;
  genderOptions = ['Male', 'Female','Transgender'];
  editIndex: number | null = null
  minEndDate = this.minDate;  // Initialize minEndDate

  designationOptions = [
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
    "Others"
  ];

  countryTypes = ['India', 'Bhaarat', 'Others'];
  statesInIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];
  
  stateDistrictMapping: { [key: string]: string[] } = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sikar", "Sirohi", "Sri Ganganagar", "Sawai Madhopur", "Tonk", "Udaipur"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri-Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "SAS Nagar", "Tarn Taran"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia"]
  
  };
  states: string[] = [];
  districts: string[] = [];
  nationalityOptions = [
    "Indian",  "Other"
  ];
  constructor(
    private fb: FormBuilder, private snackBar: MatSnackBar, private route: ActivatedRoute,
    private router: Router,private directorService: DirectorService,
  ) {
    
    this.directorForm = this.fb.group({
      isNewDirector: new FormControl(''),
      dinNO: new FormControl('', [Validators.pattern(/^\d{8}$/), Validators.maxLength(8)]),
      firstName: ["", [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100) 
      ]],

      MiddleName: ["", [
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100)
      ]],
      LastName: ["", [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100)
      ]],
      ffirstName: ["", [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100)
      ]],
      fMiddleName: ["", [
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100)
      ]],
      fLastName: ["", [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100)
      ]],
      email: ["", [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
        Validators.maxLength(100)
      ]],
      mobile: ["", [
        Validators.required,
      ]],
      fax:[null],
      nationality: ["", Validators.required],
      permanentaddress: ["", Validators.required],
      voterIdentityCardNumber:["",Validators.pattern(/^[A-Z]{3}\d{7}$/)],
      passportNumber:["",Validators.pattern(/^[A-Z]{1}\d{7}$/)],
      
      drivingLicence:["", Validators.pattern(/^[A-Z]{2}\d{4}\d{10}$/)],
      isoCountryCode:[''],
      country:["",Validators.required],
      sameAsPermanent: [false],
      gender: ['',[Validators.required,Validators.pattern('^[a-zA-Z]+$')]],
      
      citizenOfIndia: [null, Validators.required],
      residentOfIndia:[null, Validators.required],
      occupationtype:[null, Validators.required],
      educationQualification:[null, Validators.required],
      otherNationality:[],
      otheroccupationtype:[],
      otherEducation:[''],
      areaofoccupation:[],
      dob: [null, [Validators.required, this.validateAge,this.validateDateFormat]],
      pincode: [
        "",
        [Validators.required, Validators.pattern("^[1-9][0-9]{5}$")],
      ],
      district: ["", Validators.required],
      state: ["", Validators.required],
      pancard: ['', [Validators.required]],
      aadharcard: [""],
      presentCountry:[""],
      isoPresentCountryCode:[""],
      presentPincode:[""],
      presentState:[""],
      presentDistrict:[""],
      presentaddress:[""],
      createdBy:[''],
      modifiedBy:[''],
      UpdateEffectFrom:['']
    });
  }
  updatePanValidation() {
    if (!this.directorForm) return; // Prevents accessing undefined form
    const lastNameControl = this.directorForm.get('lastName');
    const panControl = this.directorForm.get('pancard');
    if (panControl) {
      panControl.setValidators([
        Validators.required,
        Validators.pattern(this.getPanPattern()),
        this.panFourthCharValidator(lastNameControl?.value)
      ]);
      panControl.updateValueAndValidity();
    }
  }
  panFourthCharValidator(lastName: string | null) {

    return (control: AbstractControl) => {
      if (!control.value || control.value.length < 4 || !lastName) {
        return null;
      }
      const fourthChar = control.value.charAt(3).toUpperCase();
      const lastNameFirstChar = lastName.charAt(0).toUpperCase();
      return fourthChar === lastNameFirstChar ? null : { fourthCharMismatch: true };
    };
  }
  getPanPattern(): string {
    if (!this.directorForm) return '^[A-Z]{5}[0-9]{4}[A-Z]$'; // Default PAN format
  
    const lastName = this.directorForm.get('lastName')?.value;
    if (lastName) {
      const lastNameInitial = lastName.charAt(0).toUpperCase();
      return `^[A-Z]{3}P${lastNameInitial}[0-9]{4}[A-Z]$`; // Custom pattern
    }
  
    return '^[A-Z]{5}[0-9]{4}[A-Z]$'; // Default pattern
  }
  onEducationChange(value: string) {
    this.showOtherEducation = value === 'Others';
    if (!this.showOtherEducation) {
      this.directorForm.patchValue({ otherEducation: '' });
    }
  }
  get isNewDirector(): boolean {
    return this.directorForm.get('isNewDirector')?.value;
  }
  allowManualInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '-', '/'];
    if (!event.key.match(/[0-9]/) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  onDirectorStatusChange() {
    const dinControl = this.directorForm.get('dinNO');

    if (!this.isNewDirector) {
      dinControl?.clearValidators(); // Remove 'required' when "Yes" is selected
    } else {
      dinControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/), Validators.maxLength(8)]);
    }

    dinControl?.updateValueAndValidity(); // Update form validation
  }
  clearEndDate(index: number) {
    this.directors.at(index).get('endDate')?.setValue(null);
  }
  clearStartate(index: number) {
    this.directors.at(index).get('startingDate')?.setValue(null);
  }
  // Disable Future Dates
  dateFilter = (date: Date | null): boolean => {
    return !!date && date <= this.maxDate;
  };

  // Restrict date selection to ensure the user is at least 18 years old
  validateAge(control: FormControl) {
    const inputDate = moment(control.value, 'DD-MM-YYYY');
    if (!inputDate.isValid() || moment().diff(inputDate, 'years') < 18) {
      return { invalidAge: true };
    }
    return null;
  }
  onDateInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (moment(input, 'DD-MM-YYYY', true).isValid()) {
      this.directorForm.get('dob')?.setValue(moment(input, 'DD-MM-YYYY').toDate());
    }
  }
  onDateInputUUpdates(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (moment(input, 'DD-MM-YYYY', true).isValid()) {
      this.directorForm.get('UpdateEffectFrom')?.setValue(moment(input, 'DD-MM-YYYY').toDate());
    }
  }
  formatDate(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length >= 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + '-' + value.slice(5, 9);

    this.directorForm.patchValue({ dob: value }, { emitEvent: false });
  }
  validateDateFormat(control: FormControl) {
    const inputDate = control.value;
    if (inputDate && !moment(inputDate, 'DD-MM-YYYY', true).isValid()) {
      return { invalidDate: true };
    }
    return null;
  }

  // Get max date (18 years from today)
  getMinAgeDate(): Date {
    return moment().subtract(18, 'years').toDate();
  }
  
  copyPermanentAddress(isSame: boolean) {
    // if (isSame) {
    //   this.directorForm.patchValue({
    //     presentAddress: this.directorForm.get('permanentAddress')?.value
    //   });
    //   // this.directorForm.get('presentAddress')?.disable();
    // } else {
    //   this.directorForm.get('presentAddress')?.enable();
    console.log("66");
    }
  get directors(): FormArray {
    return this.directorForm.get('directors') as FormArray;
  }
  addRow() {
    const lastRow = this.directors.at(this.directors.length - 1); // Get the last row
  
    if (lastRow && lastRow.invalid) {
      this.snackBar.open("Please fill all required fields before adding a new row.", "Close", {
        duration: 3000, // Snackbar disappears after 3 seconds
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'] // Custom styling
      });
      return;
    }
  
    this.directors.push(this.createDirectorRow());
  }
  updateEndDateMin(startingDate: Date | null): void {
    if (!startingDate) {
      return; // Exit the function if no date is selected
    }
  
    const minEndDate = new Date(startingDate);
    minEndDate.setFullYear(minEndDate.getFullYear() + 1); // Example logic
  
    // Assuming you're updating a specific row inside a FormArray
    // row.get('endDate')?.setValidators([Validators.required, Validators.min(minEndDate.getTime())]);
    // row.get('endDate')?.updateValueAndValidity();
  }
  removeRow(index: number) {
    if (this.directors.length > 1) {
      this.directors.removeAt(index);
    }
  }

  createDirectorRow(): FormGroup {
    const row = this.fb.group({
      companyName: ['', Validators.required],
      role: ['', Validators.required],
      startingDate: ['', Validators.required],
      endDate: [''],
      years: [{ value: '', disabled: true }, [Validators.pattern('^[0-9]+$')]]
    },{ validators: this.dateValidator() });
  
    // Listen for changes and calculate experience
    row.get('startingDate')?.valueChanges.subscribe(() => this.calculateExperience(row));
    row.get('endDate')?.valueChanges.subscribe(() => this.calculateExperience(row));
  
    // Listen for startingDate changes to update endDate min validator
    row.get('startingDate')?.valueChanges.subscribe(value => this.updateEndDateMin(value));
  
    return row;
  }
  calculateExperience(row: FormGroup) {
    const startDate = row.get('startingDate')?.value;
    const endDate = row.get('endDate')?.value;
  
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
  
      if (end.isBefore(start)) {
        row.get('years')?.setValue(null); // Set null instead of string
        row.get('years')?.setErrors({ invalidDate: true }); // Set validation error
      } else {
        const experience = parseFloat(end.diff(start, 'years', true).toFixed(1)); // Convert to number
        row.get('years')?.setValue(experience);
        row.get('years')?.setErrors(null); // Clear previous errors
      }
    } else {
      row.get('years')?.setValue(null);
    }
  }

   // Validate that start date is not greater than today
   startDateValidator() {
    return (control: FormControl) => {
      const today = new Date();
      const startDate = new Date(control.value);
      return startDate > today ? { startDateInvalid: true } : null;
    };
  }

  // Validate end date should be after start date and not the same
  dateValidator() {
    return (group: FormGroup) => {
      const startDate = new Date(group.get('startingDate')?.value);
      const endDate = new Date(group.get('endDate')?.value);

      if (!startDate || !endDate) return null;

      if (endDate < startDate) {
        return { endDateBeforeStart: true };
      }
      if (startDate.getTime() === endDate.getTime()) {
        return { sameDates: true };
      }
      return null;
    };
  }
  ngOnInit(): void {
    
    this.route.paramMap.subscribe(() => {
      const data = history.state.data;
      const flag = history.state.flag;
      
      if (data) {
         ;
        this.states = this.statesInIndia;
        this.isEditMode = true;
        this.directorForm.get('UpdateEffectFrom')?.setValidators([Validators.required])
        this.initialFormData = data;
        this.bttnvalue = "update";
        this.directorForm.patchValue({
          ...data,
          dob: data.dob ? new Date(data.dob) : null
        });
        if (data.state) {
          this.directorForm.patchValue({ state: data.state });
          this.districts = this.stateDistrictMapping[data.state] || [];
        }
        if (data.city) {
          this.directorForm.patchValue({ city: data.city });
        }
        if (data.directors && Array.isArray(data.directors)) {
          const directorsFormArray = this.directorForm.get('directors') as FormArray;
          directorsFormArray.clear();
        
          data.directors.forEach((director: any) => {
            const directorRow = this.createDirectorRow();
            directorRow.patchValue(director);
            directorsFormArray.push(directorRow);
          });
        }
  
        if (flag === 'View') {
          this.ViewDirector = true;
          this.directorForm.disable(); // Disable the whole form
        }
      }
    });
  this.directorForm.get('lastName')?.valueChanges.subscribe(() => {
    this.updatePanValidation();
  });
  this.updatePanValidation();
    this.directorForm.get('country')?.valueChanges.subscribe((country) => {
   
      if (country == 'India') {
         
        this.states = this.statesInIndia;
      } else {
        this.states = [];
        this.districts = [];
        this.directorForm.patchValue({ state: '', city: '' });
      }
    });
  
    this.directorForm.get('state')?.valueChanges.subscribe((state) => {
      this.districts = this.stateDistrictMapping[state] || [];
      this.directorForm.patchValue({ city: '' });
    });
  }
  
  

  ensureCountryCode() {
    const mobileControl = this.directorForm.get('mobile');
    if (mobileControl) {
      let value = mobileControl.value;
  
      // Ensure "+91" is always at the beginning
      if (!value.startsWith('+91')) {
        value = '+91' + value.replace(/[^0-9]/g, '').slice(2); // Remove non-numeric except +91
      }
      
      // Ensure only 10 digits after +91
      if (value.length > 13) {
        value = value.slice(0, 13);
      }
  
      mobileControl.setValue(value, { emitEvent: false });
    }
  }
  
preventNonNumericInput(event: KeyboardEvent, maxLength: number): void {
  const input = event.target as HTMLInputElement;

  // Prevent non-numeric characters
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }

  // Prevent exceeding the max length
  if (input.value.length >= maxLength && event.key !== 'Backspace') {
    event.preventDefault();
  }
}
  preventInvalidChars(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (isNaN(Number(key)) || key === '-' || key === '.') {
      event.preventDefault();
    }
    if (inputElement.value.length >= 3) {
      event.preventDefault();
    }
  }
  preventKeyPress(event: KeyboardEvent) {
    event.preventDefault();
  }
 
focusFirstInvalidField() {
  for (const key of Object.keys(this.directorForm.controls)) {
    const control = this.directorForm.get(key);
    if (control && control.invalid) {
      const invalidField = document.querySelector(`[formControlName="${key}"]`) as HTMLElement;
      if (invalidField) {
        invalidField.focus();
        break;
      }
    }
  }
}
  
  panPreventInvalidChars(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
      return;
    }
    if (!/^[a-zA-Z0-9]$/.test(key)) {
      event.preventDefault();
    }
    inputElement.value = inputElement.value.toUpperCase();
    if (inputElement.value.length >= 10) {
      event.preventDefault();
    }
  }
  drvingPreventInvalidChars(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
      return;
    }
    if (!/^[a-zA-Z0-9]$/.test(key)) {
      event.preventDefault();
    }
    inputElement.value = inputElement.value.toUpperCase();
    if (inputElement.value.length >= 16) {
      event.preventDefault();
    }
  }
  aadharPreventInvalidChars(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
      return;
    }
    if (!/^[0-9-]$/.test(key)) {
      event.preventDefault();
    }
    inputElement.value = inputElement.value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    if (inputElement.value.length >= 14) {
      event.preventDefault();
    }
  }
  // aadharValidator(control: AbstractControl): ValidationErrors | null {
  //   const aadharPattern = /^\d{4}-\d{4}-\d{4}$/;
  //   const value = control.value ? control.value.trim() : '';
  //   if (value && !aadharPattern.test(value)) {
  //     return { invalidAadhar: true };
  //   }
  //   return null;
  // }
  pancardPreventInvalidChars(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
      return;
    }
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
    }
    if (inputElement.value.length >= 6) {
      event.preventDefault();
    }
  }
  // onSubmit() {
  //    
  //   if (this.directorForm.invalid) {
  //     this.focusFirstInvalidField();
  //     return;
  //   }
  // if (this.directorForm.valid) {
  //     const formValue = this.directorForm.value;
  //     const currentDate = new Date();
  //     let formDataArray = JSON.parse(localStorage.getItem('DirectorformDataArray') || '[]');
  //     let logArray = JSON.parse(localStorage.getItem('DirectorLogArray') || '[]');
  
  //     if (this.isEditMode) {
  //       // Find the index of the existing entry to update
  //       const editIndex = formDataArray.findIndex((item: any) => item.pancard === this.initialFormData.pancard);
  //       if (editIndex !== -1) {
  //         formDataArray[editIndex] = formValue;
  //         logArray.push({
  //           action: 'update',
  //           date: currentDate,
  //           user: 'User',
  //           details: JSON.stringify(formValue)
  //         });
  //       }
  //     } else {
  //       // // Check for duplicate DIN, PAN, or Aadhar
  //       // const isDuplicate = formDataArray.some((item: any) => 
  //       //   item.pancard === formValue.pancard 
  //       // );
        
  //       // if (isDuplicate) {
  //       //   this.snackBar.open("Duplicate entry found. Please check DIN.", "Close", { duration: 3000 });
  //       //   return;
  //       // }
  
  //       // Add new entry
  //       formDataArray.push(formValue);
  //       logArray.push({
  //         action: 'create',
  //         date: currentDate,
  //         user: 'User',
  //         details:JSON.stringify(formValue)
  //       });
  //      }
  
  //     localStorage.setItem('DirectorformDataArray', JSON.stringify(formDataArray));
  //     localStorage.setItem('DirectorLogArray', JSON.stringify(logArray));
  
  //     this.snackBar.open(this.isEditMode ? "Director details updated successfully." : "Director details submitted successfully.", "Close", { duration: 3000 });
  //     this.router.navigate(['/director']);
  //   }
  // }
  onSubmit() {
     
    if (this.directorForm.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    if (this.directorForm.valid) {
      const formValue = this.directorForm.value;
      
      if (this.isEditMode) {
        formValue.modifiedBy=localStorage.getItem('loggedInUser');
        this.directorService.updateDirector(this.initialFormData.directorId, formValue).subscribe(
          (response) => {
            this.snackBar.open("Director details updated successfully.", "Close", { duration: 3000 });
            this.router.navigate(['/director']);
          },
          (error) => {
            console.error('Error updating director:', error);
            this.snackBar.open("Error updating director. Please try again.", "Close", { duration: 3000 });
          }
        );
      } else {
        // Create new director via API
        formValue.createdBy=localStorage.getItem('loggedInUser');
        this.directorService.createDirector(formValue).subscribe(
          
          (response) => {
            this.snackBar.open("Director details submitted successfully.", "Close", { duration: 3000 });
            this.router.navigate(['/director']);
          },
          (error) => {
            console.error('Error creating director:', error);
            this.snackBar.open("Error creating director. Please try again.", "Close", { duration: 3000 });
          }
        );
      }
    }
  }
  onReset() {
    if (this.isEditMode) {
      this.router.navigate(['/director']);
    } else {
      this.directorForm.reset();
      this.router.navigate(['/director']);
    }

  }
  preventInvalidNameInput(event: KeyboardEvent, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    const regex = /^[a-zA-Z\s]$/; // Allows only alphabets and spaces
  
    // Prevent numbers and special characters
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  
    // Prevent exceeding the max length
    if (input.value.length >= maxLength && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
  preventInvalidMobileInput(event: KeyboardEvent, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    const regex = /^[0-9]$/; // Allows only numbers (0-9)
  
    // Prevent alphabets and special characters
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  
    // Prevent exceeding max length
    if (input.value.length >= maxLength && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  clearDOBDate(){
this.directorForm.get('dob')?.setValue(null);
  }
    clearDateUpdateEffectFrom(){
this.directorForm.get('UpdateEffectFrom')?.setValue(null);
  }
}
