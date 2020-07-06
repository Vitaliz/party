import bridge from '../utils/bridge';
import bus from '../utils/bus';
import vibrator from '../utils/vibrator';
import { swipe } from '../utils/events';

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

export {
  useBridge,
  useBus,
  useVibrator,
  useSwipe
};
