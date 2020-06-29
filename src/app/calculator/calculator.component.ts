import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { number, symbol, reset } from './calculator.actions';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.less']
})
export class CalculatorComponent implements OnInit, OnDestroy {

  expression$: Observable<({type: string, value: string})[]>;
  displaySubscriber = null;
  display = '';
  lmt  = 0;

  constructor(private store: Store<{ expression: {type: string, value: string}[] }>) {
    this.expression$ = store.pipe(select('expression'));
    this.displaySubscriber = this.expression$.subscribe(
      expression => {this.display = expression.map(o => o.value).join(''); console.log(expression); }
    );
  }

  ngOnInit() {
    this.limitDisplay();
  }

  ngOnDestroy(): void {
    this.displaySubscriber.unsubscribe();
  }

  number(operand) {
    this.store.dispatch(number({ operand }));
  }

  symbol(operator) {
    this.store.dispatch(symbol({ operator }));
  }

  reset() {
    this.store.dispatch(reset());
  }

  @HostListener('window:resize') limitDisplay() {
      const display = document.querySelector('#display');
      const width = display.clientWidth;
      this.lmt = Math.floor(width / 24);
  }
}
