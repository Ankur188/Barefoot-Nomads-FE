import { Component, HostListener, OnInit } from '@angular/core';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cards = [
    { imageUrl: '../../assets/trips-img/kedarnath.png'},
    { imageUrl: '../../assets/trips-img/manali&kasol.png'},
    { imageUrl: '../../assets/trips-img/meghalaya.png'},
    { imageUrl: '../../assets/trips-img/kedarnath.png'},
    { imageUrl: '../../assets/trips-img/manali&kasol.png'},
    { imageUrl: '../../assets/trips-img/meghalaya.png'}
    // Add more cards as needed
  ];
  viewPort = window.innerWidth;
  constructor(public staticService: StaticService) { 
    
  }

  ngOnInit(): void {
    // this.staticService.getTrips().subscribe(data => {
    //   let trips = data['trips'];
    //   this.trips = trips.map((item, i) =>{ 
    //       item['imageUrl'] = this.cards[i].imageUrl
    //     return item});
    // })
  }

}
