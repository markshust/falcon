const CONTACT_SEND = 'contact/CONTACT_SEND';
const CONTACT_SEND_SUCCESS = 'contact/CONTACT_SEND_SUCCESS';
const CONTACT_SEND_FAIL = 'contact/CONTACT_SEND_FAIL';

const initialState = {
  sent: false,
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CONTACT_SEND:
      return { ...state, sent: false, loading: true };
    case CONTACT_SEND_SUCCESS:
      return { ...state, sent: true, loading: false };
    case CONTACT_SEND_FAIL:
      return { ...state, sent: false, loading: false, error: action.error };
    default:
      return state;
  }
}

export function send(data) {
  return {
    types: [CONTACT_SEND, CONTACT_SEND_SUCCESS, CONTACT_SEND_FAIL],
    promise: client => client.post('/contact', { data })
  };
}
