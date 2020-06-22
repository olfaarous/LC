import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
// import {Http} from '@angular/http';
import { HttpClient} from '@angular/common/http';

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
  tanksNumber = [1];
  vesselInfoForm: FormGroup;


  

  // count = (<HTMLInputElement>document.getElementById("nbr")).value;
  counter(i: number) {
    return new Array(i);
  }


  vesselsTypes: TypesGroup[] = [
    {
      name: 'Oil Tanker',
      vtype: [
        { value: 'dirtyoil', viewValue: 'Dirty Oil Tankers' },
        { value: 'cleanoil', viewValue: 'Clean Oil Tankers' }
      ]
    },
    {
      name: 'Gas Tankers',
      vtype: [
        { value: 'lpg', viewValue: 'LPG Carriers' },
        { value: 'lng', viewValue: 'LNG Carriers' },
        { value: 'cng', viewValue: 'CNG Carriers' }
      ]
    },
    {
      name: 'Chemical Tankers',
      vtype: [
        { value: 'chemical', viewValue: 'Chemical Tanker' },
      ]
    },
    {
      name: 'Bitumen Tankers',
      vtype: [
        { value: 'bitumen', viewValue: 'Bitumen Tanker' },
      ]
    },
    {
      name: 'Other Tankers',
      vtype: [
        { value: 'water', viewValue: 'Water Tankers' },
        { value: 'citrus', viewValue: 'Citrus Tankers' },
        { value: 'wine', viewValue: 'Wine Tankers' },
        { value: 'molasses', viewValue: 'Molasses Tankers' },
      ]
    }
  ];


  atex = [
    "Atex1",
    "Atex2"
  ];
  TankDefaultNumber;
  constructor(private fb: FormBuilder, private http: HttpClient) { }
   
  ngOnInit() {
    this.createForms();

  }

  createForms() {
    // matching passwords validation


    // user details form validations
    this.vesselInfoForm = this.fb.group({
      Type: new FormControl(this.vesselsTypes[0].vtype[0].viewValue),
      IMO: new FormControl(''),
      Name: new FormControl(''),
      Flag: new FormControl(''),
      YearBuilt: new FormControl(''),
      Shipyard: new FormControl(''),
      Owner: new FormControl(''),
      Operator: new FormControl(''),
      Class: new FormControl(''),
      Atex: new FormControl(this.atex[0], Validators.required),
      AIS: new FormControl(''),
      MMSI: new FormControl(''), 
      GRT: new FormControl(''),
      DWT: new FormControl(''),
      Capacity: new FormControl(''),
      Length: new FormControl(''),
      LengthUnit:['Length_m'],
      Beam: new FormControl(''),
      BeamUnit:['Beam_m'],
      Draft: new FormControl(''),
      DraftUnit:['Draft_m'],
      images:this.fb.array([]),
      linearity: new FormControl(''),
      techDetails: new FormControl(''),
      q88: new FormControl(''),
      sireReport: new FormControl(''),
      NoTanks: new FormControl(1),
      tanksProps: this.fb.array([
        this.addTanksFields()
      ]),
    });
  }
  addTanksFields(): FormGroup {
    return this.fb.group({
      tankName: new FormControl(''),
      tankVolume: new FormControl(''),
      tonnage: new FormControl(''),
      isSlopTank: new FormControl(false)
    })
  }
  ngAfterViewInit() {
    this.TankDefaultNumber = this.vesselInfoForm.get('NoTanks').value;
  }
  getValue(value: any) {

    if (value > this.TankDefaultNumber) {
      console.log('Input was incremented');
      (<FormArray>this.vesselInfoForm.get('tanksProps')).push(this.addTanksFields());
    } else {
      console.log('Input was decremented');
      (<FormArray>this.vesselInfoForm.get('tanksProps')).removeAt(value)
    }

    this.TankDefaultNumber = value;


  }

    // We will create multiple form controls inside defined form controls images.
    createItem(data): FormGroup {
      return this.fb.group(data);
  }

    //Help to get all images controls as form array.
    get images(): FormArray {
      console.log(this.vesselInfoForm);
      return this.vesselInfoForm.get('images') as FormArray;
    };


    detectFiles(event) {
      let files = event.target.files;
      if (files) {
        for (let file of files) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            // console.log("e.target.result", e.target.result);
              this.images.push(this.createItem({
                  file,
                  url: e.target.result  //Base64 string for preview image
              }));
          }
          reader.readAsDataURL(file);
        }
      }
    }
  
    removePhoto(i){
      this.images.removeAt(i);
    }
  
  
  get demoArray() {
    return this.vesselInfoForm.get('tanksProps') as FormArray;
  }
  addTank(){
    console.log('Input was incremented');
      (<FormArray>this.vesselInfoForm.get('tanksProps')).push(this.addTanksFields());
      let tempTankNumber =this.vesselInfoForm.get('NoTanks').value 
      this.vesselInfoForm.get('NoTanks').setValue(tempTankNumber+1
      );
      this.TankDefaultNumber = tempTankNumber
  }

  onSubmit() {
    if (this.vesselInfoForm.invalid) {
      // return; 
    }
    console.log(this.vesselInfoForm.value);
    let data = new FormData();
    for (let image of this.vesselInfoForm.value.images){
      data.append("file", image.file)
      
      // data.append("url", image.url)
    }
    
    data.append("linearity", this.vesselInfoForm.value.linearity._files[0])
    data.append("q88", this.vesselInfoForm.value.q88._files[0])
    data.append("sire", this.vesselInfoForm.value.sireReport._files[0])
    data.append("techdetails", this.vesselInfoForm.value.techDetails._files[0])
    
    this.http.post('http://localhost:4444/vessel/saveFiles', data).subscribe(
    (response) => console.log(response),
    (error) => console.log(error));


    let DataInfo = this.vesselInfoForm.value;
    let listimg= [];
    for (let image of this.vesselInfoForm.value.images){
      console.log(image.file.name)
      listimg.push(image.file.name)
      console.log(image.file.name)

    }
    DataInfo.images = listimg;
    this.http.post('http://localhost:4444/vessel/newVessel', DataInfo).subscribe(
    (response) => console.log(response),
    (error) => console.log(error));
    
    

  }



}