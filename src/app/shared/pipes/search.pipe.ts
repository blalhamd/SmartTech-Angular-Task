import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(list: string[], searchValue: string): string[] {
    return list.filter((x) =>
      x.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
}
