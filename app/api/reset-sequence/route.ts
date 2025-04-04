import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Execute raw SQL to reset the sequence
    const result = await db.execute(
      sql`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products), true)`
    );
    
    return Response.json({
      success: true,
      message: 'Sequence reset successfully',
      result
    });
  } catch (error) {
    console.error('Error resetting sequence:', error);
    return Response.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
