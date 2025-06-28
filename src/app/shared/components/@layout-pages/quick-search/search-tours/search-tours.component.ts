import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-search-tours',
  templateUrl: './search-tours.component.html',
  styleUrls: ['./search-tours.component.scss'],
})
export class SearchToursComponent implements OnInit {
  searchForm!: FormGroup;
  @Input() placesInput: any = [];
  datestring = '';
  adultsNumber = 1;
  childrenNumber = 1;
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
      category_id: ['1'],
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

  search() {}

  setStart(ev: any) {}
  setEnd(ev: any) {}
}
