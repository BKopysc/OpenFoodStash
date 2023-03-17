import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements OnInit {

  @Input() info = '';
  @Input() iconName!: string;
  @Input() iconColor!: 'primary' | 'accent' | 'warn'

  constructor() { }

  ngOnInit(): void {
  }

}
