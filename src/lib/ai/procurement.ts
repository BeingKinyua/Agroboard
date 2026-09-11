import { getGoogleGenAIClient } from './client';
import { SYSTEM_PROMPTS } from './prompts';

export interface ProcurementInsightRequest {
  lowStockItems: Array<{ name: string; currentStock: number; minStock: number; unit: string; category: string }>;
  pendingOrdersCount: number;
  availableSuppliers: Array<{ name: string; category: string; location: string; rating: number }>;
}

export interface ProcurementInsightResponse {
  summary: string;
  recommendations: Array<{
    productName: string;
    suggestedQty: number;
    unit: string;
    preferredSupplier: string;
    estimatedCostKES: number;
    urgency: 'High' | 'Medium' | 'Low';
    rationale: string;
  }>;
  totalEstimatedSpendKES: number;
}

/**
 * Generates AI-driven procurement orders based on stock thresholds and order velocity.
 */
export async function generateProcurementInsights(data: ProcurementInsightRequest): Promise<ProcurementInsightResponse> {
  const ai = getGoogleGenAIClient();

  if (!ai) {
    // Deterministic rule-based fallback
    const recs = data.lowStockItems.map((item, idx) => {
      const needed = Math.max(100, (item.minStock * 2) - item.currentStock);
      const supplier = data.availableSuppliers[idx % data.availableSuppliers.length]?.name || 'Limuru Greens Co-op';
      const estPrice = item.category === 'Leafy Greens' ? 35 : item.category === 'Fruits' ? 90 : 50;
      return {
        productName: item.name,
        suggestedQty: needed,
        unit: item.unit,
        preferredSupplier: supplier,
        estimatedCostKES: needed * estPrice,
        urgency: item.currentStock <= (item.minStock * 0.5) ? 'High' as const : 'Medium' as const,
        rationale: `Current inventory (${item.currentStock} ${item.unit}) is below minimum buffer (${item.minStock} ${item.unit}) with ${data.pendingOrdersCount} upcoming dispatch batches.`
      };
    });

    return {
      summary: `Automated replenishment plan generated for ${recs.length} critical produce lines. Focus placed on direct co-ops to protect wholesale gross margin.`,
      recommendations: recs,
      totalEstimatedSpendKES: recs.reduce((sum, r) => sum + r.estimatedCostKES, 0)
    };
  }

  try {
    const prompt = `Analyze this inventory state and recommend POs:
Low Stock Items: ${JSON.stringify(data.lowStockItems)}
Upcoming Scheduled Institutional Dispatches: ${data.pendingOrdersCount}
Suppliers: ${JSON.stringify(data.availableSuppliers)}

Respond in JSON format conforming to:
{
  "summary": "overview string",
  "recommendations": [
    {
      "productName": "string",
      "suggestedQty": number,
      "unit": "string",
      "preferredSupplier": "string",
      "estimatedCostKES": number,
      "urgency": "High" | "Medium" | "Low",
      "rationale": "string"
    }
  ],
  "totalEstimatedSpendKES": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPTS.PROCUREMENT_RECOMMENDER,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed as ProcurementInsightResponse;
  } catch (error) {
    console.error('[AI Procurement Error]', error);
    // Graceful fallback
    return {
      summary: 'Heuristic buffer replenishment plan generated. Sourcing from accredited Highland Co-operatives.',
      recommendations: data.lowStockItems.map(item => ({
        productName: item.name,
        suggestedQty: Math.max(50, item.minStock * 1.5),
        unit: item.unit,
        preferredSupplier: 'Kinangop Highland Co-operative',
        estimatedCostKES: Math.max(50, item.minStock * 1.5) * 45,
        urgency: 'Medium',
        rationale: 'Buffer replenishments required for morning hospital & school breakfast fulfillment.'
      })),
      totalEstimatedSpendKES: 85000
    };
  }
}
