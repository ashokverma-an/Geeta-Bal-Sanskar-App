import { AfterViewInit, Component, inject, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { InputsAppearanceService } from '../../masterappearance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel, MatSelect, MatSelectModule, MatSuffix } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { CustomDateAdapter } from '../companydetail/companydetail.component';
import { MY_DATE_FORMATS } from '../../director/director-entry/director-entry.component';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-entry',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },],
  imports: [CommonModule, MatFormFieldModule, MatDatepickerModule, MatIcon,
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
    MatSelectModule,
  ],
  templateUrl: './company-entry.component.html',
  styleUrls: ['./company-entry.component.scss']
})
export class CompanyEntryComponent implements OnInit, AfterViewInit {
  maxDate = new Date();  // Current date
  managingDirector: any[] = [];
  isEditMode = false;
  initialFormData: any;
  appearance = inject(InputsAppearanceService).appearance;
  companyForm: FormGroup;
  @ViewChild('accordion') accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;

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
  sectors = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'];

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
  directorshipTypes = ['Executive Director', 'Non-Executive Director', 'Chairman'];
  cinPattern = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      companyId: 0,
      companyType: ["", Validators.required],
      cin: ["", [
        Validators.required,
        Validators.pattern(/^[UL]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/),
        Validators.maxLength(21)
      ]],
      registrationNumber: [''],
      companyName: ['', Validators.required],
      dateOfIncorporation: ['', [Validators.required, this.validateDateFormat]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, this.emailValidator]],
      phoneNumber: ['', [Validators.required]],
      registeredOfficeAddress: ['', Validators.required],
      gstNumber: [''],
      tanNumber: [''],
      panNumber: [''],
      sector: ['']
    });
    this.companyForm.get('directorshipType')?.setValidators([
      Validators.required,
      () => this.validateDirectorshipType(),
    ]);
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
  // ngOnInit(): void {

  //   this.route.paramMap.subscribe(() => {
  //     const data = history.state.data;
  //     if (data) {
  //       this.isEditMode = true;
  //       this.initialFormData = data;
  //       if (data.dateOfIncorporation) {
  //         data.dateOfIncorporation = new Date(data.dateOfIncorporation);
  //       }
  //       this.companyForm.patchValue(data,{ emitEvent: true });
  //     }
  //   });

  //   const formDataArray = JSON.parse(localStorage.getItem('DirectorformDataArray') || '[]');

  //   this.managingDirector = formDataArray.map((item: any, index: number) => ({
  //     arrayNo: index + 1, // Assuming array.no is the index + 1
  //     arrayName: `${item.firstName.trim()} ${item.MiddleName ? item.MiddleName.trim() + ' ' : ''}${item.LastName.trim()}`.trim()
  //   }));
  //   this.companyForm.get('cin')?.valueChanges.subscribe((cinValue: string) => {
  //     if (cinValue && cinValue.length >= 21) {
  //       const registrationNumber = cinValue.slice(-6);
  //       this.companyForm.patchValue({ registrationNumber }, { emitEvent: false });
  //     } else {
  //       this.companyForm.patchValue({ registrationNumber: '' }, { emitEvent: false });
  //     }
  //   });
  //   this.companyForm.get('country')?.valueChanges.subscribe((country) => {

  //      
  //     if (country === 'India') {
  //       this.states = this.statesInIndia;
  //     } else {
  //       this.states = [];
  //       this.districts = [];
  //       this.companyForm.patchValue({ state: '', city: '' });
  //     }
  //   });

  //   this.companyForm.get('state')?.valueChanges.subscribe((state) => {
  //     this.districts = this.stateDistrictMapping[state] || [];
  //     this.companyForm.patchValue({ city: '' });
  //   });
  //   this.companyForm.get('numShares')?.valueChanges.subscribe(() => this.calculateAuthorizedCapital());
  //   this.companyForm.get('shareValue')?.valueChanges.subscribe(() => this.calculateAuthorizedCapital());
  //   this.companyForm.get('issuedSubscribedCapital')?.valueChanges.subscribe(() => this.validateCapitalLimits());
  //   this.companyForm.get('paidUpCapital')?.valueChanges.subscribe(() => this.validateCapitalLimits());


  // }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      const data = history.state.data;
      if (data) {
        this.isEditMode = true;
        this.initialFormData = data;
        if (data.dateOfIncorporation) {
          data.dateOfIncorporation = new Date(data.dateOfIncorporation);
        }
        if (data.country) {
          this.onCountryChange(data.country); // Simulate country value change
        }
        if (data.state) {
          this.onStateChange(data.state); // Simulate state value change
        }
        this.companyForm.patchValue(data, { emitEvent: true });
      }
    });
    this.companyForm.get('cin')?.valueChanges.subscribe((cinValue: string) => {
      if (cinValue && cinValue.length >= 21) {
        const registrationNumber = cinValue.slice(-6);
        this.companyForm.patchValue({ registrationNumber }, { emitEvent: false });
      } else {
        this.companyForm.patchValue({ registrationNumber: '' }, { emitEvent: false });
      }
    });

    this.companyForm.get('country')?.valueChanges.subscribe((country) => {
      if (country === 'India') {
        this.states = this.statesInIndia;
      } else {
        this.states = [];
        this.districts = [];
        this.companyForm.patchValue({ state: '', city: '' });
      }
    });

    this.companyForm.get('state')?.valueChanges.subscribe((state) => {
      this.districts = this.stateDistrictMapping[state] || [];
      this.companyForm.patchValue({ city: '' });
    });

    this.companyForm.get('numShares')?.valueChanges.subscribe(() => this.calculateAuthorizedCapital());
    this.companyForm.get('shareValue')?.valueChanges.subscribe(() => this.calculateAuthorizedCapital());
    this.companyForm.get('issuedSubscribedCapital')?.valueChanges.subscribe(() => this.validateCapitalLimits());
    this.companyForm.get('paidUpCapital')?.valueChanges.subscribe(() => this.validateCapitalLimits());
  }
  private onCountryChange(country: string): void {
    if (country === 'India') {
      this.states = this.statesInIndia;
    } else {
      this.states = [];
      this.districts = [];
      this.companyForm.patchValue({ state: '', city: '' }, { emitEvent: false });
    }
  }
  private onStateChange(state: string): void {
    this.districts = this.stateDistrictMapping[state] || [];
    this.companyForm.patchValue({ city: '' }, { emitEvent: false });
  }

  calculateAuthorizedCapital() {
    const numShares = Number(this.companyForm.get('numShares')?.value || 0);
    const shareValue = Number(this.companyForm.get('shareValue')?.value || 0);
    const totalAuthorizedCapital = numShares * shareValue;

    this.companyForm.patchValue({ authorizedCapital: totalAuthorizedCapital }, { emitEvent: false });
    this.validateCapitalLimits();
  }
  validateCapitalLimits() {
    const authorizedCapital = Number(this.companyForm.get('authorizedCapital')?.value || 0);
    const issuedCapital = Number(this.companyForm.get('issuedSubscribedCapital')?.value || 0);
    const paidUpCapital = Number(this.companyForm.get('paidUpCapital')?.value || 0);

    if (issuedCapital > authorizedCapital) {
      this.companyForm.get('issuedSubscribedCapital')?.setErrors({ exceedsAuthorized: true });
    } else {
      this.companyForm.get('issuedSubscribedCapital')?.setErrors(null);
    }

    if (paidUpCapital > authorizedCapital) {
      this.companyForm.get('paidUpCapital')?.setErrors({ exceedsAuthorized: true });
    } else {
      this.companyForm.get('paidUpCapital')?.setErrors(null);
    }
  }
  setDefaultValue(controlName: string, value: string) {
    const control = this.companyForm.get(controlName);
    if (control && !control.value) {
      control.setValue(value);
    }
  }
  //   onSubmit() {
  //     if (this.companyForm.valid) {
  //         const formData = this.companyForm.value;
  //         const currentDate = new Date();
  //         let formDataArray = JSON.parse(localStorage.getItem('companyformDataArray') || '[]');
  //         let logArray = JSON.parse(localStorage.getItem('companyLogArray') || '[]');

  //         if (this.isEditMode) {
  //             const editIndex = formDataArray.findIndex((item: any) => item.registrationNumber === this.initialFormData.registrationNumber);
  //             if (editIndex !== -1) {
  //                 formDataArray[editIndex] = formData;
  //                 logArray.push({
  //                     action: 'update',
  //                     date: currentDate,
  //                     user: 'User',
  //                     details: JSON.stringify(formData)
  //                 });
  //             }
  //         } else {
  //             formDataArray.push(formData);
  //             logArray.push({
  //                 action: 'create',
  //                 date: currentDate,
  //                 user: 'User',
  //                 details: JSON.stringify(formData)
  //             });
  //         }

  //         localStorage.setItem('companyformDataArray', JSON.stringify(formDataArray));
  //         localStorage.setItem('companyLogArray', JSON.stringify(logArray));

  //         this.snackBar.open(this.isEditMode ? "Company details updated successfully." : "Company registration details submitted successfully.", "Close", { duration: 3000 });
  //         this.router.navigate(['/company']);
  //     }
  // }
  onSubmit() {

    if (this.companyForm.valid) {
      const formData = this.companyForm.value;

      if (this.isEditMode) {
        // let obj={
        //   companyId:1003,
        //   companyType:formData.companyType,
        //   cin:formData.cin,
        //   registrationNumber:formData,
        //   companyName:,"dateOfIncorporation":"2001-12-31T00:00:00.000Z","city":"Anantapur","state":"Andhra Pradesh","country":"India","postalCode":"342001","emailAddress":"sadsfdf@gg.com","phoneNumber":"+913243243543","registeredOfficeAddress":"Parwati Sadan Opposite Krishna Mandir ., Ummed Chowk","gstNumber":"2343543534553455","tanNumber":"345534553455345453","panNumber":"34534543464654","sector":"Healthcare"
        // }
        const { companyId, ...dataWithoutCompanyId } = formData;

        this.companyService.updateCompany(dataWithoutCompanyId, companyId).subscribe({
          next: () => {
            this.snackBar.open('Company details updated successfully.', 'Close', { duration: 3000 });
            this.router.navigate(['/company']);
          },
          error: () => {
            this.snackBar.open('Failed to update company details.', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.companyService.createCompany(formData).subscribe({
          next: () => {
            this.snackBar.open('Company registration details submitted successfully.', 'Close', { duration: 3000 });
            this.router.navigate(['/company']);
          },
          error: () => {
            this.snackBar.open('Failed to submit company details.', 'Close', { duration: 3000 });
          }
        });
      }
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
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
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
    return this.companyForm.get('directors') as FormArray;
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
  clearDateofIncorporation() {
    this.companyForm.get('dateOfIncorporation')?.setValue(null);
  }

}
