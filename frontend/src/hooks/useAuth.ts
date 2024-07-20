import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setToken } from '../redux/authSlice';

const useAuth = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setToken(null));
    localStorage.removeItem('token');
  };

  return {
    isAuthenticated: !!token,
    logout,
  };
};

export default useAuth;
