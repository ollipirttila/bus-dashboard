<template>
  <div class="home">
    <div class="bus-functions">
      <div v-if="getSelectedStopItem" class="selected-stop">
        Selected stop: {{ getSelectedStopItem.name }} -
        {{ getSelectedStopItem.shortName }}
        <div class="remove-stop-icon" @click="resetSelectedStopItem()">
          <i class="fas fa-times fa-lg" />
        </div>
      </div>
    </div>
    <div class="bus-container">
      <div
        v-for="item in getStopMonitoringData"
        :key="item.vehicleRef"
        class="bus-item"
      >
        <div class="bus-line">
          {{ item.lineRef }} {{ getStopName(item.destinationShortName) }}
        </div>
        <div>
          Leaving from stop:
          {{ getFormattedTime(item.call.expectedDepartureTime) }}
        </div>
        <div>
          {{
            differenceFromScheduledDeparture(
              item.call.expectedDepartureTime,
              item.call.aimedDepartureTime
            )
          }}
        </div>
        <div>
          Scheduled departure:
          {{ getFormattedTime(item.call.aimedDepartureTime) }}
        </div>
        <div>Status: {{ item.call.departureStatus }}</div>
      </div>
    </div>

    <div v-if="!getSelectedStopItem" class="search-functions">
      <div class="search-title">Search for your bus stop</div>
      <input
        class="search-input"
        v-model="searchPhrase"
        @input="searchStop"
        @keyup.delete="clearResults"
        placeholder="Type a bus stop name"
      />
    </div>
    <div v-if="searchPhrase" class="stop-container">
      <div
        v-for="item in searchResults"
        :key="item.shortName"
        class="stop-item"
        @click="selectStop(item)"
      >
        <img src="../assets/bus-stop.svg" class="stop-item-logo" />
        <div class="stop-name">{{ item.name }}</div>
        <div class="stop-shortname">nro {{ item.shortName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateTimeMixin } from "@/mixins/dateTime.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      stopShortCodeInput: "",
      searchPhrase: null,
      searchResults: "",
    };
  },
  mounted: function() {
    console.log(this.$route.query.stop);
    this.initializeAppState(
      this.$route.query.stop === undefined ? 0 : this.$route.query.stop
    );
  },
  watch: {
    "$route.query.stop"() {
      // TODO: this gets triggered redundantly when user uses the UI to select stop also
      // Find a way to trigger it only, when the url parameter is changed by hand?
      this.setSelectedStopItemByShortName(this.$route.query.stop);
      this.fetchStopMonitoringData(this.$route.query.stop);
    },
  },
  mixins: [dateTimeMixin],
  methods: {
    differenceFromScheduledDeparture(expectedTime, scheduledTime) {
      const timeDifference = this.getDifferenceInTime(
        expectedTime,
        scheduledTime
      );
      const minuteStr = Math.abs(timeDifference) > 1 ? " minutes" : " minute";
      const delayType =
        timeDifference > 0 ? " behind schedule" : " ahead of schedule";
      if (timeDifference != 0) {
        return Math.abs(timeDifference) + minuteStr + delayType;
      }
      return "On schedule";
    },
    ...mapActions([
      "initializeAppState",
      "fetchStopData",
      "fetchStopMonitoringData",
      "resetStopMonitoringData",
      "setSelectedStopItem",
      "resetSelectedStopItem",
      "setSelectedStopItemByShortName",
    ]),

    searchStop() {
      this.searchResults = this.getStopData.filter(
        (item) =>
          item.name.toLowerCase().search(this.searchPhrase.toLowerCase()) !== -1
      );
    },
    clearResults() {
      this.searchResults = null;
    },
    selectStop(stopItem) {
      if (stopItem) {
        this.setSelectedStopItem(stopItem);
        this.fetchStopMonitoringData();
        this.clearResults;
        this.searchPhrase = null;
      } else {
        this.setSelectedStopItem({ shortName: 0 });
        this.resetStopMonitoringData();
      }
    },
    getStopName(shortName) {
      // TODO: When page gets refreshed, this gets triggered once per bus item while
      // stopdata is still empty. After that twice while there is stopdata.
      // So there's redundant triggering and stopdata is not initialized for the first
      // render.
      let stop = this.getStopData.filter((item) => item.shortName == shortName);
      return stop[0].name;
    },
  },
  computed: {
    ...mapGetters([
      "getStopData",
      "getStopMonitoringData",
      "getSelectedStopItem",
    ]),
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/variables.scss";
.home {
  margin-top: 5px;
  height: 100vh;
  button {
    background-color: $primary-color;
    padding: 10px;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      background-color: rgb(28, 151, 38);
      color: white;
    }
  }
  input {
    margin: 10px;
    padding: 10px;
    font-size: 15px;
    width: 300px;
  }
}
.bus-functions {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  .selected-stop {
    position: relative;
    background-color: rgb(12, 78, 138);
    color: white;
    font-weight: 700;
    width: 30%;
    padding: 10px;
    margin: 15px;
    border-radius: 8px;
    .remove-stop-icon {
      position: absolute;
      top: -10px;
      right: -10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: $primary-color;
      color: black;
      &:hover {
        background-color: rgb(21, 85, 24);
        color: white;
      }
    }
  }
}
.bus-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 0 50px;
  .bus-item {
    background-color: rgb(12, 78, 138);
    color: white;
    font-weight: 500;
    padding: 20px;
    margin: 10px;
    border-radius: 8px;
    .bus-line {
      background-color: rgb(61, 59, 59);
      color: rgb(255, 168, 6);
      font-size: 1.5em;
      border-radius: 8px;
      width: 100%;
      margin: 0 0 10px 0;
    }
  }
}
.search-functions {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .search-title {
    padding-top: 10px;
    font-size: 1.2em;
  }
  .search-input {
    text-align: center;
    border: 1px solid rgb(214, 214, 214);
    border-radius: 8px;
  }
}
.stop-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  .stop-item {
    background-color: $bus-yellow;
    width: 500px;
    margin: 5px;
    text-align: center;
    text-transform: uppercase;
    &:hover {
      cursor: pointer;
      box-shadow: 2px 5px 10px -2px $black;
    }
    .stop-item-logo {
      /* flip horizontally */
      transform: scaleX(-1);
      height: 60px;
      padding: 5px 0 0 0;
    }
    .stop-name,
    .stop-shortname {
      background-color: $black;
      color: $dirty-white;
    }
    .stop-name {
      padding-top: 5px;
    }
    .stop-shortname {
      padding-bottom: 5px;
      font-size: $font-size-small;
    }
  }
}
// Styles specific only to small screens
@media only screen and (max-width: $breakpoint-narrow-desktop) {
  .bus-functions {
    .selected-stop {
      width: 80%;
    }
  }
}
// Styles specific only to desktop screen sizes
@media only screen and (min-width: $breakpoint-narrow-desktop) {
  .home {
    margin-top: 10px;
  }
}
</style>
