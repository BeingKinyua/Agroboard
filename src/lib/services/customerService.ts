import { Customer, Supplier } from '../../types';
import { INITIAL_CUSTOMERS, INITIAL_SUPPLIERS } from '../../mock/initialData';

export interface CustomerService {
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
  createCustomer(customer: Omit<Customer, 'id' | 'code'>): Promise<Customer>;
  updateCustomer(customer: Customer): Promise<Customer>;
  getSuppliers(): Promise<Supplier[]>;
}

class MockCustomerService implements CustomerService {
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private suppliers: Supplier[] = [...INITIAL_SUPPLIERS];

  async getCustomers(): Promise<Customer[]> {
    return [...this.customers];
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.customers.find(c => c.id === id) || null;
  }

  async createCustomer(data: Omit<Customer, 'id' | 'code'>): Promise<Customer> {
    const code = `CUST-${data.type.substring(0, 3).toUpperCase()}-${String(this.customers.length + 1).padStart(3, '0')}`;
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      code,
      totalOrdersCount: 0
    };
    this.customers.unshift(newCust);
    return newCust;
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    this.customers = this.customers.map(c => c.id === customer.id ? customer : c);
    return customer;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return [...this.suppliers];
  }
}

export const customerService: CustomerService = new MockCustomerService();
