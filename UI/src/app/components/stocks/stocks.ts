import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  FileUploadHandlerEvent,
  FileUploadModule
} from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {
  TableLazyLoadEvent,
  TableModule
} from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe } from '@angular/common';
import * as XLSX from 'xlsx';

interface Product {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface ExcelRow {
  product: string;
  quantity: number | null;
  purchasePrice: number | null;
  supplier: string;
  batchNo: string;
  expiryDate: string;
  valid: boolean;
}


/**
 * Stock row form
 *
 * Nullable:
 * - productId
 * - quantity
 * - purchasePrice
 * - supplierId
 * - expiryDate
 *
 * Non-nullable:
 * - batchNo
 */
type StockFormGroup = FormGroup<{
  productId: FormControl<number | null>;
  quantity: FormControl<number | null>;
  purchasePrice: FormControl<number | null>;
  supplierId: FormControl<number | null>;
  batchNo: FormControl<string>;
  expiryDate: FormControl<Date | null>;
}>;


@Component({
  selector: 'app-stocks',
  standalone: true,

  imports: [
    ReactiveFormsModule,

    TableModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TabsModule,
    SkeletonModule,
    TagModule,
    CurrencyPipe
  ],

  templateUrl: './stocks.html',
  styleUrl: './stocks.scss'
})
export class Stocks {


  isAddModalOpen = false;

  activeTab: 'manual' | 'excel' = 'manual';



  isSaving = false;

  isSavingAndPrinting = false;

  isImporting = false;



  cols = [
    {
      field: 'product',
      header: 'Product'
    },
    {
      field: 'quantity',
      header: 'Quantity'
    },
    {
      field: 'purchasePrice',
      header: 'Purchase Price'
    },
    {
      field: 'supplier',
      header: 'Supplier'
    },
    {
      field: 'batchNo',
      header: 'Batch No.'
    },
    {
      field: 'expiryDate',
      header: 'Expiry Date'
    }
  ];

  stockList: any[] = [];

  skeletonRows = Array.from(
    { length: 8 },
    (_, index) => index
  );



  products: Product[] = [];

  suppliers: Supplier[] = [];



  excelRows: ExcelRow[] = [];



  stockForm: FormGroup<{
    stocks: FormArray<StockFormGroup>;
  }>;


  constructor(
    private readonly fb: FormBuilder
  ) {

    this.stockForm = this.fb.group({
      stocks: this.fb.array<StockFormGroup>([])
    });

  }



  get stocks(): FormArray<StockFormGroup> {

    return this.stockForm.controls.stocks;

  }



  private createStockRow(): StockFormGroup {

    return new FormGroup({

      productId: new FormControl<number | null>(
        null,
        {
          validators: [
            Validators.required
          ]
        }
      ),

      quantity: new FormControl<number | null>(
        null,
        {
          validators: [
            Validators.required,
            Validators.min(1)
          ]
        }
      ),

      purchasePrice: new FormControl<number | null>(
        null,
        {
          validators: [
            Validators.required,
            Validators.min(0)
          ]
        }
      ),

      supplierId: new FormControl<number | null>(
        null
      ),

      /**
       * Non-nullable string.
       *
       * This fixes:
       *
       * Type 'string | null' is not assignable to type 'string'
       */
      batchNo: new FormControl<string>(
        '',
        {
          nonNullable: true
        }
      ),

      expiryDate: new FormControl<Date | null>(
        null
      )

    });

  }



  addRow(): void {

    this.stocks.push(
      this.createStockRow()
    );

  }



  removeRow(index: number): void {

    if (this.stocks.length <= 1) {
      return;
    }

    this.stocks.removeAt(index);

  }



  openCreateModel(): void {

    this.resetForm();

    this.isAddModalOpen = true;

  }



  private resetForm(): void {

    this.stocks.clear();

    this.excelRows = [];

    this.activeTab = 'manual';

    this.isSaving = false;

    this.isSavingAndPrinting = false;

    this.isImporting = false;

    this.addRow();

  }



  cancel(): void {

    this.isAddModalOpen = false;

    this.stocks.clear();

    this.excelRows = [];

    this.activeTab = 'manual';

  }



  getList(event: TableLazyLoadEvent): void {

    console.log('Lazy load event:', event);

    /*
     * API implementation goes here.
     */

  }



  save(): void {

    if (this.stockForm.invalid) {

      this.stockForm.markAllAsTouched();

      return;

    }

    if (this.stocks.length === 0) {
      return;
    }

    this.isSaving = true;

    /**
     * Because the form is strongly typed,
     * payload now has predictable types.
     */
    const payload = this.stocks.getRawValue();

    console.log('Stock payload:', payload);


    setTimeout(() => {

      this.isSaving = false;

      this.isAddModalOpen = false;

      console.log('Stock saved successfully');

    }, 500);

  }



  saveAndPrint(): void {

    if (this.stockForm.invalid) {

      this.stockForm.markAllAsTouched();

      return;

    }

    if (this.stocks.length === 0) {
      return;
    }

    this.isSavingAndPrinting = true;

    const payload = this.stocks.getRawValue();

    console.log(
      'Save & Print payload:',
      payload
    );


    setTimeout(() => {

      this.isSavingAndPrinting = false;

      this.isAddModalOpen = false;

      this.printStockReceipt();

    }, 500);

  }



  private printStockReceipt(): void {

    window.print();

  }



  onExcelUpload(event: FileUploadHandlerEvent): void {
    const file = event.files?.[0];

    if (!file) {
      return;
    }

    this.isImporting = true;
    this.excelRows = [];

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;

        if (!data) {
          return;
        }

        const workbook = XLSX.read(data, {
          type: 'array'
        });

        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          return;
        }

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json<any>(
          worksheet,
          {
            defval: ''
          }
        );
        

        this.excelRows = rows.map(row => {
          const product = String(
            row['Product'] ?? ''
          ).trim();

          const quantity = this.parseNumber(
            row['Quantity']
          );

          const purchasePrice = this.parseNumber(
            row['Purchase Price']
          );

          const supplier = String(
            row['Supplier'] ?? ''
          ).trim();

          const batchNo = String(
            row['Batch No.'] ?? ''
          ).trim();

          const expiryDate = String(
            row['Expiry Date'] ?? ''
          ).trim();

          const valid =
            product !== '' &&
            quantity !== null &&
            quantity > 0 &&
            purchasePrice !== null &&
            purchasePrice >= 0 &&
            supplier !== '' &&
            batchNo !== '' &&
            expiryDate !== '';

          return {
            product,
            quantity,
            purchasePrice,
            supplier,
            batchNo,
            expiryDate,
            valid
          };
        });

      } catch (error) {
        console.error(
          'Excel import failed:',
          error
        );

        this.excelRows = [];

      } finally {
        this.isImporting = false;
      }
    };

    reader.onerror = () => {
      console.error(
        'Unable to read Excel file'
      );

      this.isImporting = false;
      this.excelRows = [];
    };

    reader.readAsArrayBuffer(file);
  }
  private parseNumber(
    value: unknown
  ): number | null {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : null;
  }



  clearExcel(): void {

    this.excelRows = [];

  }



  downloadTemplate(): void {

    const headers = [
      'Product',
      'Quantity',
      'Purchase Price',
      'Supplier',
      'Batch No.',
      'Expiry Date'
    ];

    const csv = headers.join(',') + '\n';

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8'
      }
    );

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');

    anchor.href = url;

    anchor.download =
      'stock-import-template.csv';

    anchor.click();

    URL.revokeObjectURL(url);

  }



  importAndSave(): void {

    if (this.excelRows.length === 0) {
      return;
    }


    const invalidRows =
      this.excelRows.filter(
        row => !row.valid
      );


    if (invalidRows.length > 0) {

      console.warn(
        'Invalid Excel rows:',
        invalidRows
      );

      return;

    }


    this.isImporting = true;


    const payload =
      this.excelRows.map(row => ({

        product: row.product,

        quantity: row.quantity,

        purchasePrice:
          row.purchasePrice,

        supplier: row.supplier,

        batchNo: row.batchNo,

        expiryDate:
          row.expiryDate

      }));


    console.log(
      'Excel payload:',
      payload
    );

    setTimeout(() => {

      this.isImporting = false;

      this.isAddModalOpen = false;

      this.excelRows = [];

    }, 500);

  }

}
