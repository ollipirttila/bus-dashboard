import axios from "axios";

const busStopModule = {
  state: {
    stopDataSet: [],
    stopMonitoringData: [],
    selectedStopItem: null,
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
    fetchStopMonitoringData(state) {
      axios
        .get("https://data.itsfactory.fi/journeys/api/1/stop-monitoring", {
          params: { stops: state.selectedStopItem.shortName },
        })
        .then((result) => {
          state.stopMonitoringData =
            result.data.body[state.selectedStopItem.shortName];
        });
    },
    resetStopMonitoringData(state) {
      state.stopMonitoringData = null;
    },
    setSelectedStopItem(state, stopItem) {
      state.selectedStopItem = stopItem;
    },
  },
  actions: {
    fetchStopData(context) {
      context.commit("fetchStopData");
    },
    fetchStopMonitoringData(context) {
      context.commit("fetchStopMonitoringData");
    },
    resetStopMonitoringData(context) {
      context.commit("resetStopMonitoringData");
    },
    setSelectedStopItem(context, stopItem) {
      context.commit("setSelectedStopItem", stopItem);
    },
  },
};

export default busStopModule;
