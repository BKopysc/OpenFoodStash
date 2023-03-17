import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-form-div',
  templateUrl: './error-form-div.component.html',
  styleUrls: ['./error-form-div.component.scss']
})
export class ErrorFormDivComponent implements OnInit {

  @Input() errorInput = '';

  constructor() { }

  ngOnInit(): void {
  }

}
