export default class ArrayProto {
  constructor(array = []) {
    this.array = array;
  }

  sortByKeyAsc({ key = "", stringVal = true }) {
    this.array.sort((a, b) => {
      const textA = stringVal ? a[key] : a[key].toString();
      const textB = stringVal ? b[key] : b[key].toString();
      return textA.localeCompare(textB);
    });

    return this.array;
  }

  sortByKeyDesc({ key = "", stringVal = true }) {
    this.array.sort((a, b) => {
      const textA = stringVal ? a[key] : a[key].toString();
      const textB = stringVal ? b[key] : b[key].toString();
      return textB.localeCompare(textA);
    });

    return this.array;
  }
}
