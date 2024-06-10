import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../services/payments.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'value', 'nameCountry', 'nameCoin', 'nameState', 'createAt', 'actions'];

  form: FormGroup;

  formVisible: boolean;

  payments: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  coins: any[] = [];

  constructor(
    private paymentsService: PaymentsService,
    private formBuilder: FormBuilder
  ){
    this.formVisible = false;
    this.form = this.formBuilder.group({
      value: ['', Validators.required],
      coin: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      this.getPayments();
      this.getCoins();
      this.getCountries();
      this.getStates();
  }

  public createForm(): void{
    this.formVisible = true;
  }

  public reloadPage(): void {
    window.location.reload();
  }

  public createPayment(): void {
    const body = {
      value: this.form.value.value,
      coin: this.form.value.coin,
      country: this.form.value.country
    }

    console.log('....', this.form.value)
    this.paymentsService.createPayment(body).subscribe({
      next: (data: any) => {
        this.formVisible = false;
        this.getPayments();
        this.form.reset();
      },
      error: () => {}
    })
  }

  public getPayments(): void {
    this.paymentsService.getPayments().subscribe({
      next: (data: any) => {
        // this.payments = data;
        // console.log('.....', data)
        const mapper = data.map((item: any) => {
          return {
            nameCountry: item.country?.nombre,
            nameCoin: item.coin?.nombre,
            nameState: item.state?.nombre,
            id: item.id,
            value: item.value,
            createAt: item.createAt
          }
        })
        this.payments = mapper;
        console.log('.....', mapper)
      },
      error: () => {}
    })
  }

  public getStates(): void {
    this.paymentsService.getStates().subscribe({
      next: (data: any) => {
        this.states = data;
        // console.log('.....', data)
      },
      error: () => {}
    })
  }

  public getCountries(): void {
    this.paymentsService.getCountries().subscribe({
      next: (data: any) => {
        this.countries = data;
        // console.log('.....', data)
      },
      error: () => {}
    })
  }

  public getCoins(): void {
    this.paymentsService.getCoins().subscribe({
      next: (data: any) => {
        this.coins = data;

        // console.log('.....', data)
      },
      error: () => {}
    })
  }

  public deletePayment(id: any): void { 
    this.paymentsService.deletePayment(id).subscribe({
      next: (data: any) => {
        this.getPayments();
        // console.log('.....', data)
      },
      error: () => {}
    })
  }
}
