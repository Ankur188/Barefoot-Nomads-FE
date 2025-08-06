import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameToInitials'
})
export class NameToInitialsPipe implements PipeTransform {

  transform(value: string): unknown {
    let arr = value.split(' ');
    return arr[0].charAt(0) + arr[arr.length-1].charAt(0);
  }

}
