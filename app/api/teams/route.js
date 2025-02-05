import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import Team from '../../../models/Team';

// Get all teams sorted by points
export async function GET() {
  try {
    await dbConnect();
    const teams = await Team.find({}).sort({ points: -1 });
    if (!teams || teams.length === 0) {
      return NextResponse.json(
        { error: 'No teams found' },
        { status: 404 }
      );
    }
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Create a new team (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { name, members } = body;

    // Validate team data
    if (!name || !members || members.length < 1 || members.length > 3) {
      return NextResponse.json(
        { error: 'Team name and 1-3 members are required' },
        { status: 400 }
      );
    }

    // Create team with default 500 points
    const team = await Team.create({
      name,
      members: members.map(member => ({ name: member })),
      points: 700
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Team name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error creating team' },
      { status: 500 }
    );
  }
}