import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit {

  @Input() card: any;

  constructor() { }

  ngOnInit(): void {
  }

}
