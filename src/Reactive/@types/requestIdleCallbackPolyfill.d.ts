declare global {
    interface Window {
      requestIdleCallback: ((
        callback: ((deadline: RequestIdleCallbackDeadline) => void),
        opts?: RequestIdleCallbackOptions,
      ) => RequestIdleCallbackHandle);
      cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
    }
  }

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

export {
    RequestIdleCallbackDeadline
}