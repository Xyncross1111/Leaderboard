import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../../lib/mongodb';
import Team from '../../../../../models/Team';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { points } = await request.json();
    const { id } = params;

    const team = await Team.findByIdAndUpdate(
      id,
      { points },
      { new: true }
    );

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json(
      { error: 'Error updating points' },
      { status: 500 }
    );
  }
} 