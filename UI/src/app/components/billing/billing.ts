import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../services/common-service';
import { ButtonModule } from 'primeng/button';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-billing',
  imports: [TableModule, CommonModule, ButtonModule,
    DialogModule, ReactiveFormsModule, InputTextModule, FloatLabel, InputNumber, SelectModule,
    FileUploadModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing implements OnInit {
  paymentModes: any = [{ key: 'cash', label: 'Cash' }, { key: 'upi', label: 'UPI' }, { key: 'card', label: 'Card' }]
  cols: any = [{
    header: "Invoice number",
    field: "invoice_number"
  },
  {
    header: "Customer name",
    field: "customer_name"
  },
  {
    header: "Total amount",
    field: "total_amount"
  },
  {
    header: "Payment status",
    field: "payment_status"
  },
  {
    header: "Payment mode",
    field: "payment_mode"
  },
  ]
  invoiceList = [];

  invoiceForm!: FormGroup;
  isCreateModalOpen: boolean = false;
  private lastLazyLoadEvent: any;
  constructor(private _commonService: CommonService, private _formBuilder: FormBuilder) {
    this.invoiceForm = this._formBuilder.group({
      invoice_number: ['', Validators.required],
      customer_name: ['', Validators.required],
      phno: ['', Validators.required],

      items: this._formBuilder.array([
        this.createItem()
      ]),

      total_amount: [0, Validators.required],
      amount_paid: [0, Validators.required],
      balance: [0],
      payment_mode: ['', Validators.required]
    });

    this.invoiceForm.get('amount_paid')?.valueChanges.subscribe(value => {
      const total = Number(this.invoiceForm.get('total_amount')?.value) || 0;
      const paid = Number(value) || 0;

      console.log('Balance: ', total - paid)
      this.invoiceForm.patchValue({
        balance: total - paid
      }, { emitEvent: false });
    });
  }

  createItem(): FormGroup {
    return this._formBuilder.group({
      item: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      unit: [''],
      rate: [0, [Validators.required, Validators.min(0)]],
      amount: [0],
      discount: [0],
    });
  }

  ngOnInit(): void {

  }

  getList(event: any) {
    console.log('Loading List: ', event);
    this.lastLazyLoadEvent = event;
    this._commonService.getRequest(`api/invoices/`).subscribe({
      next: (response: any) => {
        console.log('Response: List ', response);
        this.invoiceList = response.data;
      },
      error: (error: any) => { },
    })
  }
  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  openCreateModel() {
    this.isCreateModalOpen = true;
  }

  savePrintInvoice() {

  }

  onBasicUploadAuto(event: any): void {
    console.log('uploaded')

    const file: File = event.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, {
        type: 'array'
      });

      // Read first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert Excel rows to JSON
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: ''
      });

      console.log('Excel data:', rows);

      this.fillItems(rows);
    };

    reader.readAsArrayBuffer(file);
  }

  fillItems(rows: any[]): void {
    const itemsArray = this.invoiceForm.get('items') as FormArray;

    console.log('rows: ', rows)
    // Remove existing rows
    itemsArray.clear();

    rows.forEach(row => {
      const qty = Number(row.qty) || 0;
      const rate = Number(row.rate) || 0;
      const discount = Number(row.discount) || 0;

      // Amount after discount
      const amount = (qty * rate) - discount;

      itemsArray.push(
        this._formBuilder.group({
          item: [row.item_name || '', Validators.required],
          qty: [qty || 1, [
            Validators.required,
            Validators.min(1)
          ]],
          unit: [row.unit || ''],
          rate: [rate, [
            Validators.required,
            Validators.min(0)
          ]],
          amount: [amount],
          discount: [discount]
        })
      );
    });

    this.calculateTotal();
  }

  calculateTotal(): void {
    const items = this.invoiceForm.get('items') as FormArray;

    const total = items.controls.reduce((sum, control) => {
      return sum + (Number(control.get('amount')?.value) || 0);
    }, 0);

    this.invoiceForm.patchValue({
      total_amount: total
    });

    this.calculateBalance();
  }

  calculateBalance(): void {
    const total = Number(this.invoiceForm.get('total_amount')?.value) || 0;
    const paid = Number(this.invoiceForm.get('amount_paid')?.value) || 0;

    this.invoiceForm.patchValue({
      balance: total - paid
    });
  }

  saveInvoice(): void {

    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const invoiceData = this.invoiceForm.getRawValue();

    invoiceData.payment_mode = invoiceData.payment_mode ? invoiceData.payment_mode?.key : '';

    console.log('Saving invoice:', invoiceData);

    this._commonService.postRequest(`api/invoices/`, invoiceData).subscribe({
      next: (response: any) => {
        console.log('Invoice saved:', response);

        // Optional
        this.invoiceForm.reset();

        this.invoiceForm.setControl(
          'items',
          this._formBuilder.array([
            this.createItem()
          ])
        );

        this.getList(this.lastLazyLoadEvent);
        this.isCreateModalOpen = false;
      },

      error: (error: any) => {
        console.error('Error saving invoice:', error);
      }
    });
  }
}
