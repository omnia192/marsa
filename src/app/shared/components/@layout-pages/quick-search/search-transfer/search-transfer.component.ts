import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-search-transfer',
  templateUrl: './search-transfer.component.html',
  styleUrls: ['./search-transfer.component.scss'],
})
export class SearchTransferComponent implements OnInit {
  searchForm!: FormGroup;
  @Input() placesInput: any = [];
  adultsNumber = 1;
  childrenNumber = 1;
  datestring = '';
  constructor(private formBuilder: FormBuilder) {
    this.initForms();
  }

  ngOnChanges() {
    if (this.placesInput.length > 0) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 150);
    }
  }
  initForms() {
    this.searchForm = this.formBuilder.group({
      category_id: ['4'],
      place_id: [null, [Validators.required]],
      start: [this.datestring, [Validators.required]],
      end: [this.datestring, [Validators.required]],
    });
  }
  ngOnInit(): void {
    const d = new Date();
    this.datestring =
      d.getDate() +
      ' ' +
      d.toLocaleString('default', { month: 'long' }) +
      ' ' +
      d.getFullYear();
  }


  search() {
    //console.log(this.searchForm.value);
  }
  setStart(ev: any) {}
  setEnd(ev: any) {}
}
