import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../lib/mongodb';
import Team from '../../../../models/Team';
import { getIO } from '../../../../lib/socket';

export async function DELETE(request, context) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.role === 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const teamId = context.params.id;
    await dbConnect();

    const team = await Team.findByIdAndDelete(teamId);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Get updated teams list
    const updatedTeams = await Team.find({}).sort({ points: -1 });
    
    try {
      // Try to emit update via socket
      const io = getIO();
      if (io) {
        io.emit('teamsUpdate', updatedTeams);
      }
    } catch (socketError) {
      console.error('Socket error:', socketError);
      // Continue with the response even if socket fails
    }

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Error deleting team' },
      { status: 500 }
    );
  }
} 