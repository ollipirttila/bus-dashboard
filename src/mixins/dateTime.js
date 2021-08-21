/* eslint-disable prettier/prettier */
import differenceInMinutes from "date-fns/differenceInMinutes";
import parseISO from "date-fns/parseISO";

export const dateTimeMixin = {
  methods: {
    getFormattedTime(dateIsoString) {
      let date = parseISO(dateIsoString);
      return (
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes()
      );
    },
    getDifferenceInTime(expectedTime, aimedTime) {
      const aimedDate = parseISO(aimedTime);
      const expectedDate = parseISO(expectedTime);
      return differenceInMinutes(expectedDate, aimedDate);
    },
  },
};
