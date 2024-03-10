/* installs a resize observer and gives back a simple function to cancel/unobserve it */
export function installResizeObserver(
  targetElement: Element,
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions = { box: 'border-box' },
) {
  const resizeObserver = new ResizeObserver(callback);
  resizeObserver.observe(targetElement, options);
  return {
    cancel() {
      resizeObserver.unobserve(targetElement);
    },
  };
}
