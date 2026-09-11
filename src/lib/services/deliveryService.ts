import { DeliveryRun, DeliveryRunStatus } from '../../types';
import { INITIAL_DELIVERY_RUNS } from '../../mock/initialData';

export interface DeliveryService {
  getDeliveryRuns(): Promise<DeliveryRun[]>;
  createDeliveryRun(run: Omit<DeliveryRun, 'id' | 'runCode'>): Promise<DeliveryRun>;
  updateDeliveryRunStatus(id: string, status: DeliveryRunStatus): Promise<DeliveryRun | null>;
}

class MockDeliveryService implements DeliveryService {
  private runs: DeliveryRun[] = [...INITIAL_DELIVERY_RUNS];

  async getDeliveryRuns(): Promise<DeliveryRun[]> {
    return [...this.runs];
  }

  async createDeliveryRun(data: Omit<DeliveryRun, 'id' | 'runCode'>): Promise<DeliveryRun> {
    const runCode = `RUN-NAI-0${this.runs.length + 1}`;
    const newRun: DeliveryRun = {
      ...data,
      id: `run-${Date.now()}`,
      runCode
    };
    this.runs.unshift(newRun);
    return newRun;
  }

  async updateDeliveryRunStatus(id: string, status: DeliveryRunStatus): Promise<DeliveryRun | null> {
    const idx = this.runs.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.runs[idx] = { ...this.runs[idx], status };
    return this.runs[idx];
  }
}

export const deliveryService: DeliveryService = new MockDeliveryService();
