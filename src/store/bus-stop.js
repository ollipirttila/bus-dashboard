import axios from "axios";
import router from "../router";

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
    initializeAppState(state, UrlStopQuery) {
      //Get array of all bus stop items
      axios
        .get("https://data.itsfactory.fi/journeys/api/1/stop-points")
        .then((result) => {
          state.stopDataSet = result.data.body;
          state.selectedStopItem = result.data.body.find(
            (item) => item.shortName == UrlStopQuery
          );
          //Get monitoring data for bus stop indicated by URL parameter
          axios
            .get("https://data.itsfactory.fi/journeys/api/1/stop-monitoring", {
              params: {
                stops: UrlStopQuery,
              },
            })
            .then((result) => {
              state.stopMonitoringData = result.data.body[UrlStopQuery];
            });
        });
    },
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
      state.selectedStopItem = { shortName: 0 };
      state.stopMonitoringData = [];
      router.push({
        path: "",
        query: { stop: 0 },
      });
    },
    setSelectedStopItemByShortName(state, shortNameInput) {
      state.selectedStopItem = state.stopDataSet.find(
        (item) => item.shortName == shortNameInput
      );
    },
  },
  actions: {
    initializeAppState(context, UrlStopQuery) {
      context.commit("initializeAppState", UrlStopQuery);
    },
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
      context.commit("setSelectedStopItemByShortName", shortNameInput);
    },
  },
};

export default busStopModule;
