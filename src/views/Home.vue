<template>
  <div class="home">
    <img class="app-logo" alt="busLogo" src="../assets/logo.png" />
    <HeaderBar title="Bus Dashboard" />
    <div class="bus-functions">
      <div v-if="selectedStop" class="selected-stop">
        Selected stop: {{ selectedStop.name }} - {{ selectedStop.shortName }}
        <div class="remove-stop-icon" @click="selectStop()">
          <i class="fas fa-times fa-lg" />
        </div>
      </div>
    </div>
    <div class="bus-container">
      <div v-for="item in busDataSet" :key="item.vehicleRef" class="bus-item">
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

    <div v-if="!selectedStop" class="search-functions">
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
        <div class="stop-name">{{ item.name }}</div>
        <div class="stop-shortname">{{ item.shortName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderBar from "@/components/HeaderBar.vue";
import { dateTimeMixin } from "@/mixins/dateTime.js";

export default {
  name: "Home",
  components: {
    HeaderBar,
  },
  data() {
    return {
      busDataSet: null,
      stopDataSet: [],
      stopShortCodeInput: "",
      searchPhrase: null,
      searchResults: "",
      selectedStop: null,
    };
  },
  mounted: function() {
    this.fetchStopListingDataSet();
  },
  mixins: [dateTimeMixin],
  methods: {
    fetchStopMonitoringDataSet() {
      const stopShortCode = this.stopShortCodeInput;
      const baseURI =
        "https://data.itsfactory.fi/journeys/api/1/stop-monitoring";
      this.$http
        .get(baseURI, { params: { stops: stopShortCode } })
        .then((result) => {
          this.busDataSet = result.data.body[stopShortCode];
          console.log(result.data.body[stopShortCode]);
        });
    },
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

    fetchStopListingDataSet() {
      const baseURI = "https://data.itsfactory.fi/journeys/api/1/stop-points";
      this.$http.get(baseURI).then((result) => {
        this.stopDataSet = result.data.body;
        console.log(result.data.body);
      });
    },

    searchStop() {
      this.searchResults = this.stopDataSet.filter(
        (item) =>
          item.name.toLowerCase().search(this.searchPhrase.toLowerCase()) !== -1
      );
      console.log(this.searchResults);
    },
    clearResults() {
      this.searchResults = null;
    },
    selectStop(stopItem) {
      if (stopItem) {
        this.stopShortCodeInput = stopItem.shortName;
        this.selectedStop = stopItem;
        this.fetchStopMonitoringDataSet();
        this.clearResults;
        this.searchPhrase = null;
      } else {
        this.selectedStop = null;
        this.busDataSet = null;
      }
    },
    getStopName(shortName) {
      let stop = this.stopDataSet.filter((item) => item.shortName == shortName);
      return stop[0].name;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/variables.scss";
.home {
  .app-logo {
    width: 150px;
    padding-bottom: 20px;
  }
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
  align-items: center;
  background-color: rgb(200, 211, 207);
  .stop-item {
    background-color: rgb(231, 243, 118);
    width: 500px;
    padding: 5px;
    margin: 5px;
    text-align: center;
    &:hover {
      background-color: rgb(179, 192, 65);
      cursor: pointer;
    }
  }
}
</style>
