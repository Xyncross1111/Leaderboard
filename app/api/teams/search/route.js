import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Team from '../../../models/Team';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    await dbConnect();
    
    const searchRegex = new RegExp(query, 'i');
    const teams = await Team.find({
      name: { $regex: searchRegex }
    }).sort({ points: -1 });

    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error searching teams' },
      { status: 500 }
    );
  }
}