export const session = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SESSION':
      let session = action.updateSession.session;
      return {
        ...state,
        ...session
      };
    default:
      return state;
  }
};
