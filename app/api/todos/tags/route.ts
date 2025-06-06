import 'server-only';

import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { TagController } from '@/interface-adapters/controllers/TagController';

export async function GET() {
  try {
    const tagController = container.resolve(TagController);
    const tags = await tagController.getAll();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error is', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch todo tags',
      },
      { status: 500 }
    );
  }
}
