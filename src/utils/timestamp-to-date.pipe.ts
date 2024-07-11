import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {

  monthObj = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }

  transform(timestamp: number, type: string): number|string {
    if (!timestamp) return ''; // Handle undefined or null

    // console.log(date)
    const newDate = new Date(timestamp * 1000);
    // console.log(dateDate.getDate(), dateDate.getMonth(), dateDate.getFullYear())

    if(type === 'date')
    return newDate.getDate();
    else
    return this.monthObj[newDate.getMonth()] + ', ' + newDate.getFullYear();
  }

}
