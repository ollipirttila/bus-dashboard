import differenceInMinutes from "date-fns/differenceInMinutes";
import parseISO from "date-fns/parseISO";

export const dateTimeMixin = {
  methods: {
    getFormattedTime: function(dateIsoString) {
      let date = parseISO(dateIsoString);
      console.log(date);
      return date.getHours() + ":" + date.getMinutes();
    },
    getDifferenceInTime: function(expectedTime, aimedTime) {
      const aimedDate = parseISO(aimedTime);
      const expectedDate = parseISO(expectedTime);
      return differenceInMinutes(expectedDate, aimedDate);
    }
  }
};
