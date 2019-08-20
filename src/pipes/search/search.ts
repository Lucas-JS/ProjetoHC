import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  retCurso: any;
  transform(items: any[], curso: string){
    if(!items){
     console.log(curso);
     this.retCurso = curso;
     return this.retCurso;
    }
  }
}
