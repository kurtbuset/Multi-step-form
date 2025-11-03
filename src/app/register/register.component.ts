import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StepService } from '../_services/step.service';

@Component({
  templateUrl: 'register.component.html',
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  currentStep = 1;
  name = '';
  email = '';
  phone = '';
  submitted = false;
  isYearly = false; // toggle for monthly/yearly
  selectedPlan: string = ''; // stores the selected plan
  step = 0;

  plans = [
    {
      name: 'Arcade',
      value: 'arcade',
      monthlyPrice: '$9/mo',
      yearlyPrice: '$90/yr',
      icon: 'icon-arcade.svg',
    },
    {
      name: 'Advanced',
      value: 'advanced',
      monthlyPrice: '$12/mo',
      yearlyPrice: '$120/yr',
      icon: 'icon-advanced.svg',
    },
    {
      name: 'Pro',
      value: 'pro',
      monthlyPrice: '$15/mo',
      yearlyPrice: '$150/yr',
      icon: 'icon-pro.svg',
    },
  ];

  addOns = [
    {
      name: 'Online Service',
      description: 'Access to multiplayer games',
      monthly: '+$1/mo',
      yearly: '+$10/yr',
      selected: false,
    },
    {
      name: 'Larger storage',
      description: 'Extra 1TB of cloud save',
      monthly: '+$2/mo',
      yearly: '+$20/yr',
      selected: false,
    },
    {
      name: 'Customizable profile',
      description: 'Custom theme on your profile',
      monthly: '+$2/mo',
      yearly: '+$20/yr',
      selected: false,
    },
  ];

  constructor(private stepService: StepService) {
    this.stepService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  isPhoneValid(): boolean {
    const phoneRegex = /^\+?\d{7,15}$/; // accepts optional +, 7–15 digits
    return phoneRegex.test(this.phone);
  }

  onNext() {
    this.submitted = true;

    // Validation only on step 1
    if (this.currentStep === 1) {
      if (!this.name || !this.email || !this.phone) return;
      if (!this.isEmailValid() || !this.isPhoneValid()) return;
    }

    if (this.currentStep === 2 && !this.selectedPlan) {
      alert('Please select a plan.');
      return;
    }

    // Move to next step
    this.stepService.setStep(this.currentStep + 1);
  }

  onBack() {
    this.stepService.setStep(1);
  }

  goToStep(stepNumber: number) {
    this.stepService.setStep(stepNumber);
  }

  getTotal() {
    let plan = this.plans.find((p) => p.value === this.selectedPlan);
    let planPrice = this.isYearly
      ? Number(plan?.yearlyPrice.replace(/[^0-9]/g, ''))
      : Number(plan?.monthlyPrice.replace(/[^0-9]/g, ''));

    let addonsPrice = this.addOns
      .filter((a) => a.selected)
      .reduce((sum, a) => {
        let price = this.isYearly
          ? Number(a.yearly.replace(/[^0-9]/g, ''))
          : Number(a.monthly.replace(/[^0-9]/g, ''));
        return sum + price;
      }, 0);

    return `$${planPrice + addonsPrice}/${this.isYearly ? 'yr' : 'mo'}`;
  }

  get selectedPlanObj() {
    return this.plans.find((p) => p.value === this.selectedPlan);
  }

  get selectedPlanPrice() {
    if (!this.selectedPlanObj) return '';
    return this.isYearly
      ? this.selectedPlanObj.yearlyPrice
      : this.selectedPlanObj.monthlyPrice;
  }

  get selectedAddOns() {
    return this.addOns.filter((a) => a.selected);
  }
}
