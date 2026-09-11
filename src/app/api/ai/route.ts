import { NextResponse } from 'next/server';
import { 
  generateOperationalBriefing, 
  generateProcurementInsights, 
  analyzeInventoryExpiryRisks, 
  queryOperationsAssistant 
} from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case 'briefing': {
        const briefing = await generateOperationalBriefing(payload);
        return NextResponse.json({ success: true, data: briefing });
      }

      case 'procurement': {
        const insights = await generateProcurementInsights(payload);
        return NextResponse.json({ success: true, data: insights });
      }

      case 'inventory_risk': {
        const report = await analyzeInventoryExpiryRisks(payload.batches);
        return NextResponse.json({ success: true, data: report });
      }

      case 'chat': {
        const reply = await queryOperationsAssistant(
          payload.history || [],
          payload.query,
          payload.options || { userRole: 'Operations Manager', branch: 'Nairobi Central' }
        );
        return NextResponse.json({ success: true, reply });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API /api/ai handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process AI operations request' },
      { status: 500 }
    );
  }
}
