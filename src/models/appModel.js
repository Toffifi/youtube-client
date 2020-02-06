export default class AppModel {
  constructor(state) {
    this.state = state;
  }


  async getClipNames(value) {
    const fetchResult = fetch(`${this.state}${value}`);
    const response = await fetchResult;
    const data = await response.json();
    return data;
  }
}
