import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
  Country,
  UsernameValidator,
  PasswordValidator,
  ParentErrorStateMatcher,
  PhoneValidator
} from '../validators';

export interface VesselType {
  value: string;
  viewValue: string;
}

export interface TypesGroup {
  disabled?: boolean;
  name: string;
  vtype?: VesselType[];
}

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {

  vesselInfoForm: FormGroup;
  accountDetailsForm: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;

  parentErrorStateMatcher = new ParentErrorStateMatcher();

  // count = (<HTMLInputElement>document.getElementById("nbr")).value;
  counter(i: number) {
    return new Array(i);
}

  typesControl = new FormControl();
  vesselsTypes: TypesGroup[] = [
    {
      name: 'Oil Tankers',
      vtype: [
        {value: 'dirtyoil', viewValue: 'Dirty Oil Tankers'},
        {value: 'cleanoil', viewValue: 'Clean Oil Tankers'}
      ]
    },
    {
      name: 'Gas Tankers',
      vtype: [
        {value: 'lpg', viewValue: 'LPG Carriers'},
        {value: 'lng', viewValue: 'LNG Carriers'},
        {value: 'cng', viewValue: 'CNG Carriers'}
      ]
    },
    {
      name : 'Chemical Tankers',
      vtype: [
        {value: 'chemical', viewValue: 'Chemical Tanker'},
      ]
    },
    {
      name : 'Bitumen Tankers',
      vtype: [
        {value: 'bitumen', viewValue: 'Bitumen Tanker'},
      ]
    },   
    {
      name: 'Other Tankers',
      vtype: [
        {value: 'water', viewValue: 'Water Tankers'},
        {value: 'citrus', viewValue: 'Citrus Tankers'},
        {value: 'wine', viewValue: 'Wine Tankers'},
        {value: 'molasses', viewValue: 'Molasses Tankers'},
      ]
    }
  ];
  genders = [
    "Male",
    "Female",
    "Other"
  ];

  atex = [
    "Atex1",
    "Atex2"
  ];


  countries = [
    new Country('UY', 'Uruguay'),
    new Country('US', 'United States'),
    new Country('AR', 'Argentina')
  ];


  validation_messages = {
    'fullname': [
      { type: 'required', message: 'Full name is required' }
    ],
    'bio': [
      { type: 'maxlength', message: 'Bio cannot be more than 256 characters long' },
    ],
    'Type': [
      { type: 'required', message: 'Please select the vessel\'s type' },
    ],
    'birthday': [
      { type: 'required', message: 'Please insert your birthday' },
    ],
    'phone': [
      { type: 'required', message: 'Phone is required' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ]
  };

  account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
  }


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    // matching passwords validation
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    // country & phone validation
    let country = new FormControl(this.countries[0], Validators.required);

    let phone = new FormControl('', {
      validators: Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ])
    });

    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    // user details form validations
    this.vesselInfoForm = this.fb.group({
      Type : this.typesControl,
      IMO : new FormControl('',Validators.required),
      Name : new FormControl('', Validators.required),
      Flag: new FormControl('', Validators.required),
      YearBuilt : new FormControl('', Validators.required),
      Shipyard : new FormControl('', Validators.required),
      Owner: new FormControl('', Validators.required),
      Operator : new FormControl('', Validators.required),
      Class: new FormControl('', Validators.required),
      Atex: new FormControl(this.atex[0], Validators.required),
      AIS : new FormControl('', Validators.required),
      MMSI: new FormControl('', Validators.required),
      GRT: new FormControl('', Validators.required),
      DWT : new FormControl('', Validators.required),
      Capacity: new FormControl('', Validators.required),
      Length : new FormControl('', Validators.required),
      Beam: new FormControl('', Validators.required),
      Draft: new FormControl('', Validators.required),
      NoTanks : new FormControl('', Validators.required),
      acceptfile: [],

    });


    
    // user links form validations
    this.accountDetailsForm = this.fb.group({
      username: new FormControl('', Validators.compose([
       UsernameValidator.validUsername,
       Validators.maxLength(25),
       Validators.minLength(5),
       Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
       Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(false, Validators.pattern('true'))
    })

  }


  onTypeSelected(value:string){
    console.log("the selected value is " + value);
  } 
  
  onSubmitAccountDetails(value){
    console.log(value);
  }

  onSubmitUserDetails(value){
    console.log(value);
  }

  
  // get image() {
  //   return `<mat-form-field>
  //     <ngx-mat-file-input formControlName="basicfile" placeholder="Basic Input" ></ngx-mat-file-input>
  //     <mat-icon matSuffix>folder</mat-icon>
  //   </mat-form-field>`;
  // }

}
