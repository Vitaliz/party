import bridge from '../utils/bridge';
import bus from '../utils/bus';
import vibrator from '../utils/vibrator';
import { swipe, scroll, resize } from '../utils/events';

function useBridge() {
  return bridge;
}

function useBus() {
  return bus;
}

function useVibrator() {
  return vibrator;
}

function useSwipe() {
  return swipe;
}

function useScroll() {
  return scroll;
}

function useResize() {
  return resize;
}

export {
  useBridge,
  useBus,
  useVibrator,
  useSwipe,
  useScroll,
  useResize
};
