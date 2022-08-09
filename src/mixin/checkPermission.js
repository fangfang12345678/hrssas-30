import store from "@/store";
export const mixins = {
  methods: {
    checkPermission(key) {
      // const { userInfo } = store.state.user;
      // if (userInfo.roles.points && userInfo.roles.points.length) {
      //   return userInfo.roles.points.some((item) => item === key);
      // }
      // return false;
      console.log(store.state.user.userInfo.roles.points);
      return !store.state.user.userInfo.roles.points.includes(key);
    },
  },
};
