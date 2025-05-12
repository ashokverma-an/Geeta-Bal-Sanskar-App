import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupees',
  standalone: true, // Standalone pipe
})
export class RupeesPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return '₹0.00';
    
    let numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    return `₹${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
