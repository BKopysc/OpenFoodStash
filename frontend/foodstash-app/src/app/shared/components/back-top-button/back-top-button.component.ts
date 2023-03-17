import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-back-top-button',
  templateUrl: './back-top-button.component.html',
  styleUrls: ['./back-top-button.component.scss']
})
export class BackTopButtonComponent implements OnInit {

  @Input() routeLink = '';
  @Input() fixedClass: boolean | null = false;

  constructor() { }

  ngOnInit(): void {
  }

}
