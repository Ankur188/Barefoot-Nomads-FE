import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  batchInfo:any = [
    {
      dates:'JAN 12 - 16, 2025',
      status : 'AVAILABLE',
      startingPrice : '10,50,000'
    },
    {
      dates:'JAN 22 - 27, 2025',
      status : 'FULL',
      startingPrice : '7400'
    },{
      dates:'FEB 04 - 08, 2025',
      status : 'FILLING FAST',
      startingPrice : '6400'
    },{
      dates:'MAR 07 - 11, 2025',
      status : 'FILLING FAST',
      startingPrice : '6000'
    }
  ]

  occupancy:any = [
    {
      name:'TRIPLE OCCUPANCY',
      price: ''
    },
    {
      name:'DOUBLE OCCUPANCY',
      price: '300'
    },
    {
      name:'SINGLE OCCUPANCY',
      price: '600'
    }
  ]

  currentPage = 1;
  itemsPerPage = 4;
  paginatedBatches = [];
  totalPages = Math.ceil(this.batchInfo.length / this.itemsPerPage);


  constructor() { 
    this.updatePagination()
  }
  


  ngOnInit(): void {
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBatches = this.batchInfo.slice(start, start + this.itemsPerPage);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get pages() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

}
