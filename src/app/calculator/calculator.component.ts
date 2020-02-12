import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.less']
})
export class CalculatorComponent implements OnInit {

  curr = '0';
  expr = [];
  ord  = ['*', '/', '+', '-'];
  last = 'operator';
  lmt  = 0;

  ngOnInit() {
    this.limitDisplay();
  }

  public getNumber(v: string) {
    if (this.curr.length === this.lmt) {
        return;
    }
    if (this.last === 'equals') {
      this.clear();
    }
    if (this.last === 'decimal' || this.last === 'minus') {
      this.expr[this.expr.length - 1].value += v;
    } else if (this.last === 'operand') {
      this.expr[this.expr.length - 1].value += v;
    } else {
      this.expr.push({type: 'operand', value: v});
    }
    this.last = 'operand';
    this.curr === '0' ? this.curr = v : this.curr += v;
  }

  public getDecimal() {
    if (this.curr.length === this.lmt - 1) {
      return;
    }
    if (this.last === 'equals') {
      this.clear();
    }
    if (this.expr.length === 0 && this.last === 'operator') {
      this.expr.push({type: 'operand', value: '0.'});
      this.last = 'decimal';
      this.curr += this.curr === '0' ? '.' : '0.';
    } else if (this.last === 'operand' && !this.expr[this.expr.length - 1].value.includes('.')) {
      this.expr[this.expr.length - 1].value += '.';
      this.last = 'decimal';
      this.curr += '.';
    }
  }

  public getOperation(op: string) {
    if (this.curr.length >= this.lmt - 1) {
      return;
    }
    if (this.expr.length === 0 && op === '-' && this.last === 'operator') {
      this.expr.push({type: 'operand', value: op});
      this.last = 'minus';
      this.curr = '-';
    } else if (op === '-' && this.last === 'operator' && !this.expr[this.expr.length - 1].value.includes('-')) {
      this.expr.push({type: 'operand', value: op});
      this.last = 'minus';
      this.curr += '-';
    } else if (this.last === 'operand' || this.last === 'equals') {
      this.expr.push({type: 'operator', value: op});
      this.last = 'operator';
      this.curr += op;
    }
  }

  public clear() {
    this.curr = '0';
    this.expr = [];
    this.last = 'operator';
  }

  public calculate() {
    let counter = 0;
    const limit = 100;
    while (this.expr.length > 1 && counter < limit) {
      this.ord.forEach((operator) => {
        this.expr.forEach((symbol, index) => {
          if (symbol.type === 'operator' && symbol.value === operator) {
            switch (symbol.value) {
              case '+':
                this.expr[index - 1].value = +this.expr[index - 1].value + +this.expr[index + 1].value;
                break;
              case '-':
                this.expr[index - 1].value = +this.expr[index - 1].value - +this.expr[index + 1].value;
                break;
              case '*':
                this.expr[index - 1].value = +this.expr[index - 1].value * +this.expr[index + 1].value;
                break;
              case '/':
                this.expr[index - 1].value = +this.expr[index - 1].value / +this.expr[index + 1].value;
                break;
            }
            this.expr.splice(index, 2);
          }
        });
      });
      counter++;
    }
    this.curr = this.expr[0].value.toString().length > this.lmt ? this.expr[0].value.toPrecision(this.lmt) : this.expr[0].value;
    this.last = 'equals';
  }

  @HostListener('window:resize') limitDisplay() {
      const display = document.querySelector('#display');
      const width = display.clientWidth;
      this.lmt = Math.floor(width / 24);
  }
}
