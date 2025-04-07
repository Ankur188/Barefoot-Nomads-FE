import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tripDuration'
})
export class TripDurationPipe implements PipeTransform {

  monthObj = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
  }
  
  transform(fromDate, toDate): unknown {
    let year = new Date(fromDate * 1000).getFullYear();
    let month = new Date(fromDate * 1000).getMonth() + 1;
    let from = new Date(fromDate * 1000).getDate();
    let to = new Date(toDate * 1000).getDate();
    return `${this.monthObj[month]} ${from} - ${to}, ${year}`;
  }

}
