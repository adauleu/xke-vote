export const voters = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_SESSION':
      return [...action.updateSession.voters];
    case 'UPDATE_VOTES':
      return [...action.updateVotes.voters];
    default:
      return state;
  }
};
