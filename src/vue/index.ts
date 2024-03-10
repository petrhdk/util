import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";
import { installResizeObserver } from "../dom";
import { isDefined } from "../core";

/** hook that gives a reactive reference to the component's own css pixel width */
export function useComponentSize() {
  let resizeObserver: ReturnType<typeof installResizeObserver> | undefined;

  const componentWidth = ref<number>(0);
  const componentHeight = ref<number>(0);

  onMounted(() => {
    /* get dom reference */
    let target = getCurrentInstance()?.proxy?.$el as Node | null;

    /* traverse siblings in case the vue template starts with an html comment or similar */
    while (!(target instanceof Element) && target !== null) {
      target = target.nextSibling;
    }

    if (!target)
      throw new Error(
        "Could not bind to the component's DOM element for dynamically measuring component width, using fallback width 0.",
      );

    resizeObserver = installResizeObserver(target, (entries) => {
      for (const entry of entries) {
        componentWidth.value = entry.borderBoxSize[0].inlineSize;
        componentHeight.value = entry.borderBoxSize[0].blockSize;
      }
    });
  });

  onBeforeUnmount(() => {
    if (isDefined(resizeObserver)) {
      resizeObserver.cancel();
      resizeObserver = undefined;
    }
  });

  return { componentWidth, componentHeight };
}
