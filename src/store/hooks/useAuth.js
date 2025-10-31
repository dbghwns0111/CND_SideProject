import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  return {
    ...auth,
    login: user => dispatch(login(user)),
    logout: () => dispatch(logout()),
  };
};
