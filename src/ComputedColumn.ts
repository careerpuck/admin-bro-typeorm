/* eslint-disable no-param-reassign */
export function ComputedColumn(type: string) {
  return function (target: any, propertyKey: string) {
    target.computedColumns = target.computedColumns || {}
    target.computedColumns[propertyKey] = type
  }
}
