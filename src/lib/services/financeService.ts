import { Invoice, PaymentTransaction, BankStatementItem } from '../../types';
import { INITIAL_INVOICES, INITIAL_PAYMENTS, INITIAL_BANK_FEED } from '../../mock/initialData';

export interface FinanceService {
  getInvoices(): Promise<Invoice[]>;
  getPayments(): Promise<PaymentTransaction[]>;
  getBankFeed(): Promise<BankStatementItem[]>;
  recordPayment(payment: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date'>): Promise<PaymentTransaction>;
}

class MockFinanceService implements FinanceService {
  private invoices: Invoice[] = [...INITIAL_INVOICES];
  private payments: PaymentTransaction[] = [...INITIAL_PAYMENTS];
  private bankFeed: BankStatementItem[] = [...INITIAL_BANK_FEED];

  async getInvoices(): Promise<Invoice[]> {
    return [...this.invoices];
  }

  async getPayments(): Promise<PaymentTransaction[]> {
    return [...this.payments];
  }

  async getBankFeed(): Promise<BankStatementItem[]> {
    return [...this.bankFeed];
  }

  async recordPayment(data: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date'>): Promise<PaymentTransaction> {
    const receiptNumber = `RCT-2026-${1000 + this.payments.length + 1}`;
    const newPayment: PaymentTransaction = {
      ...data,
      id: `pay-${Date.now()}`,
      receiptNumber,
      date: new Date().toISOString().substring(0, 10)
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }
}

export const financeService: FinanceService = new MockFinanceService();
