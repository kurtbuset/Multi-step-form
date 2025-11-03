import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StepService {
  private stepSource = new BehaviorSubject<number>(1);
  currentStep$ = this.stepSource.asObservable();

  setStep(step: number) {
    this.stepSource.next(step);
  }
}
