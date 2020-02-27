<template>
  <div class="home">
    <img class="app-logo" alt="busLogo" src="../assets/logo.png" />
    <HeaderBar title="Bus Dashboard" />
    <div class="bus-container">
      <div v-for="item in busDataSet" :key="item.vehicleRef" class="bus-item">
        <div>Bussin id: {{ item.vehicleRef }}</div>
        <div>Bussin linja: {{ item.lineRef }}</div>
        <div>
          Arvioitu lähtö pysäkille: {{ item.call.expectedDepartureTime }}
        </div>
        <div>
          Aikataulun mukainen saapuminen: {{ item.call.aimedDepartureTime }}
        </div>
        <div>Status: {{ item.call.departureStatus }}</div>
      </div>
    </div>
    <input v-model="stopShortCodeInput" class="stop-input" />
    <button @click="fetchStopMonitoringDataSet" class="button">
      Fetch Data
    </button>
    <button @click="fetchStopListingDataSet" class="button">
      Fetch all stops
    </button>
    <div class="stop-container">
      <div v-for="item in stopDataSet" :key="item.shortName" class="stop-item">
        Pysäkin lyhytkoodi: {{ item.shortName }} Pysäkin nimi: {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderBar from "@/components/HeaderBar.vue";

export default {
  name: "Home",
  components: {
    HeaderBar
  },
  data() {
    return {
      busDataSet: [],
      stopDataSet: [],
      stopShortCodeInput: ""
    };
  },
  methods: {
    fetchStopMonitoringDataSet: function() {
      const stopShortCode = this.stopShortCodeInput;
      const baseURI =
        "http://data.itsfactory.fi/journeys/api/1/stop-monitoring";
      this.$http
        .get(baseURI, { params: { stops: stopShortCode } })
        .then(result => {
          this.busDataSet = result.data.body[stopShortCode];
          console.log(result.data.body[stopShortCode]);
        });
    },
    fetchStopListingDataSet: function() {
      const tariffZoneInput = "A";
      const baseURI = "http://data.itsfactory.fi/journeys/api/1/stop-points";
      this.$http
        .get(baseURI, { params: { tariffZone: tariffZoneInput } })
        .then(result => {
          this.stopDataSet = result.data.body;
          console.log(result.data.body);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/variables.scss";
.home {
  margin: 0;
}
.app-logo {
  width: 150px;
}

.stop-input {
  margin: 10px;
  padding: 10px;
  font-size: 15px;
}
.button {
  background-color: $primary-color;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  font-size: 20px;
}

.bus-container {
  display: flex;
  justify-content: center;
  padding: 0 50px;
  .bus-item {
    background-color: $primary-color;
    padding: 30px;
    margin: 10px;
    border-radius: 8px;
  }
}

.stop-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  margin-top: 50px;
  background-color: rgb(200, 211, 207);
  .stop-item {
    background-color: rgb(231, 243, 118);
    width: 500px;
    padding: 5px;
    margin: 5px 0 5px 0;
    text-align: center;
  }
}
</style>
