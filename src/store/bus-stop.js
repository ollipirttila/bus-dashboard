import axios from "axios";
import router from "../router";

const busStopModule = {
  state: {
    stopDataSet: [],
    stopMonitoringData: [],
    selectedStopItem: { shortName: 0 },
  },
  getters: {
    getStopData: (state) => {
      return state.stopDataSet;
    },
    getStopMonitoringData: (state) => {
      return state.stopMonitoringData;
    },
    getSelectedStopItem: (state) => {
      return state.selectedStopItem;
    },
  },
  mutations: {
    fetchStopData(state) {
      axios
        .get("https://data.itsfactory.fi/journeys/api/1/stop-points")
        .then((result) => {
          state.stopDataSet = result.data.body;
        });
    },
    fetchStopMonitoringData(state, stopShortName) {
      axios
        .get("https://data.itsfactory.fi/journeys/api/1/stop-monitoring", {
          params: {
            stops: stopShortName
              ? stopShortName
              : state.selectedStopItem.shortName,
          },
        })
        .then((result) => {
          state.stopMonitoringData = result.data.body[stopShortName];
        });
    },
    resetStopMonitoringData(state) {
      state.stopMonitoringData = null;
    },
    setSelectedStopItem(state, stopItem) {
      state.selectedStopItem = stopItem;
      router.push({
        path: "",
        query: { stop: stopItem ? stopItem.shortName : 0 },
      });
    },
    resetSelectedStopItem(state) {
      state.selectedStopItem = null;
      state.stopMonitoringData = null;
      router.push({
        path: "",
        query: { stop: 0 },
      });
    },
    setSelectedStopItemByShortName(state, shortNameInput) {
      axios
        .get("https://data.itsfactory.fi/journeys/api/1/stop-points")
        .then((result) => {
          let stopDataSet = result.data.body;
          let stopItem = stopDataSet.find(
            (item) => item.shortName == shortNameInput
          );
          state.selectedStopItem = stopItem;
        });
    },
  },
  actions: {
    fetchStopData(context) {
      context.commit("fetchStopData");
    },
    fetchStopMonitoringData(context, stopShortName) {
      context.commit("fetchStopMonitoringData", stopShortName);
    },
    resetStopMonitoringData(context) {
      context.commit("resetStopMonitoringData");
    },
    setSelectedStopItem(context, stopItem) {
      context.commit("setSelectedStopItem", stopItem);
    },
    resetSelectedStopItem(context) {
      context.commit("resetSelectedStopItem");
    },
    setSelectedStopItemByShortName(context, shortNameInput) {
      context.commit("fetchStopData");
      context.commit("setSelectedStopItemByShortName", shortNameInput);
    },
  },
};

export default busStopModule;
