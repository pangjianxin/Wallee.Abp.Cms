import { useThemeStore } from "@/store/themeStore";

export const useSideMenuStore = defineStore(
  "side-menu",
  () => {
    const themeStore = useThemeStore();
    const rail = ref(false);
    const permanent = ref(true);
    const temporary = ref(false);
    const sideMenuModel = ref(true);

    //切换侧边栏的状态，如果是移动端，切换sideMenuModel的值，如果是PC端，切换rail的值
    const toggleCollapse = () => {
      if (themeStore.mobile) {
        updateSideMenuModel(!sideMenuModel.value);
      } else {
        updateRail(!rail.value);
      }
    };
    const updateRail = (val: boolean) => {
      rail.value = val;
    };

    const udpatePermanent = (value: boolean) => {
      permanent.value = value;
    };

    const updateTemporary = (value: boolean) => {
      temporary.value = value;
    };

    const updateSideMenuModel = (value: boolean) => {
      sideMenuModel.value = value;
    };
    
    //监听移动端的变化
    watch(
      () => themeStore.mobile,
      (newVal: boolean) => {
        udpatePermanent(!newVal);
        updateTemporary(newVal);
        updateRail(!newVal);
      },
      {
        immediate: true,
      }
    );

    return {
      rail,
      permanent,
      temporary,
      sideMenuModel,
      toggleCollapse,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
