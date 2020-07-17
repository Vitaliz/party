import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo as useDeepMemo,
  useContext
} from 'react';
import {
  useCreation as useMemo,
  usePersistFn as useImmutableCallback,
  useMount,
  useUnmount,
  useUpdate as useForceUpdate,
  useUpdateEffect as useUpdate,
  useSetState as useHavyState,
  useDebounceFn
} from 'ahooks';

function useCallback(callback, deps) {
  return useMemo(() => {
    return callback;
  }, deps);
}

function useElementRef() {
  const [element, setElement] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setElement(node);
    }
  }, []);
  return [element, ref];
}

function useCompute(factory) {
  return factory();
}

function useLazyState(initialState) {
  const [state, setState] = useState(initialState);
  const setLazyState = useDebounceFn(setState, { wait: 500 });
  return [state, setLazyState];
}

export {
  useRef,
  useState,
  useLazyState,
  useHavyState,
  useMemo,
  useDeepMemo,
  useCompute,
  useCallback,
  useImmutableCallback,
  useElementRef,
  useMount,
  useUnmount,
  useUpdate,
  useLayoutEffect,
  useEffect,
  useForceUpdate,
  useContext
};
