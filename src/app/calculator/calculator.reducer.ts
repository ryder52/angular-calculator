import { createReducer, on } from '@ngrx/store';
import { number, symbol, reset } from './calculator.actions';

export let displayState: {type: string, value: string}[] = [{type: 'operand', value: '0'}];
const operators = [['*', '/'], ['+', '-']];

const _calculatorReducer = createReducer(displayState,
  on(number, (state, { operand }) => addOperand(state, operand)),
  on(symbol, (state, { operator }) => addOperator(state, operator)),

  on(reset, () => [{type: 'operand', value: '0'}]),
);

function addOperand(state, operand) {
  const last = state[state.length - 1];
  if (last.type === 'operand') {
    if (last.value === '0' && operand !== '.') {
      return [...state.slice(0, state.length - 1), {type: 'operand', value: operand}];
    } else {
      return [...state.slice(0, state.length - 1), {type: 'operand', value: last.value + operand}];
    }
  } else if (last.type === 'result') {
    return [{type: 'operand', value: operand}];
  }
  return [...state, {type: 'operand', value: operand}];
}

function addOperator(state, operator) {
  const last = state[state.length - 1];
  if (last.type === 'operand') {
    if (last.value === '0' && ['-', '+'].includes(operator)) {
      return [{type: 'operand', value: operator}];
    }
    if (['.', '-', '+'].includes(last.value[last.value.length - 1])) {
      return [...state];
    } else {
      if (operator === '=') {
        return calculate(state);
      }
      return [...state, {type: 'operator', value: operator}];
    }
  } else if (last.type === 'result') {
    return [{type: 'operand', value: last.value}, {type: 'operator', value: operator}];
  }
  if (['+', '-'].includes(operator)) {
    return [...state, {type: 'operand', value: operator}];
  }
  return [...state];
}

function calculate(state) {
  const copy = [];
  state.forEach((item) => {
    copy.push(Object.assign({}, item));
  });
  let counter = 0;
  const limit = 100;

  while (copy.length > 1 && counter < limit) {
    operators.forEach((operatorGroup) => {
      copy.forEach((item, index) => {
        if (item.type === 'operator' &&  operatorGroup.includes(item.value)) {
          switch (item.value) {
            case '+':
              copy[index - 1].value = +copy[index - 1].value + +copy[index + 1].value;
              break;
            case '-':
              console.log(copy[index - 1]);
              copy[index - 1].value = +copy[index - 1].value - +copy[index + 1].value;
              break;
            case '*':
              copy[index - 1].value = +copy[index - 1].value * +copy[index + 1].value;
              break;
            case '/':
              copy[index - 1].value = +copy[index - 1].value / +copy[index + 1].value;
              break;
          }
          copy.splice(index, 2);
        }
      });
    });
    counter++;
  }
  copy[0].type = 'result';
  return copy;
}

export function calculatorReducer(state, action) {
  return _calculatorReducer(state, action);
}
