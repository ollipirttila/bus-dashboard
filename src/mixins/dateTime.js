export const dateTimeMixin = {
  methods: {
    getFormattedTime: function(dateIsoString) {
      let date = new Date(dateIsoString);
      console.log(date);
      return date.getHours() + ":" + date.getMinutes();
    }
  }
};
