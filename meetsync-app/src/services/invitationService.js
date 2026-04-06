
import api from './api';

export const invitationService = {
  // Inviter des participants à une réunion
  invite: (meetingId, participantIds) =>
    api.post(`/meetings/${meetingId}/invitations`, {
      participant_ids: participantIds,
    }),

  // Répondre à une invitation
  respond: (invitationId, status) =>
    api.patch(`/invitations/${invitationId}`, { status }),
};