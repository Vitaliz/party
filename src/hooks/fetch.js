import useSWR from 'swr';
import unaxios from '../utils/unaxios';

function useFetch() {
  return unaxios;
}

function useFetchState(url) {
  return useSWR(url, unaxios.get);
}

export {
  useFetch,
  useFetchState
};
