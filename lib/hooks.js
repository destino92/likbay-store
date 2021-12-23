import useSWR from 'swr';
import {useStore} from '../store';

const fetchUser = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      console.lof("From hooks")
      console.log(data)
      useStore.dispatch({ type: 'SET_USER', payload: data?.user || null });
      return { user: data?.user || null };
    });

export function useUser() {
  const { data, error } = useSWR('api/user', fetchUser);
  return !data && !error ? { loading: true } : data && data?.user;
}