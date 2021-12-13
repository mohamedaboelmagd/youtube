import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: string | undefined, args?: any): any {
    let hours = value?.substring(value?.indexOf('PT') + 2, value?.indexOf('M'));
    let minutes = value?.substring(
      value?.indexOf('M') + 1,
      value?.indexOf('S')
    );
    let seconds = value?.substring(value?.indexOf('S') + 1);
    hours = hours && +hours < 10 ? `0${hours}` : hours;
    minutes = minutes && +minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds && +seconds < 10 ? `0${seconds}` : seconds;
    return typeof value === 'string'
      ? `${hours}:${minutes}${seconds ? ':' + seconds : ''}`
      : value;
  }
}

// PT11M15S 00:00:00
