import {
  useState,
  useRef,
  useEffect
} from 'react';
import {
  useCreation as useMemo,
  usePersistFn as useImmutableCallback,
  useMount,
  useUnmount,
  useUpdate as useForceUpdate,
  useUpdateEffect as useUpdate,
  useSetState as useHavyState
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

export {
  useRef,
  useState,
  useHavyState,
  useMemo,
  useCompute,
  useCallback,
  useImmutableCallback,
  useElementRef,
  useMount,
  useUnmount,
  useUpdate,
  useEffect,
  useForceUpdate
};
