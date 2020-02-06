export default class Factory {
  constructor(state, views) {
    this.state = state;
    this.views = views;
  }

  async generateObjects() {
    for (let i = 0; i < this.state.length; i += 1) {
      const name = this.state[i].snippet.title;
      const prev = this.state[i].snippet.thumbnails.medium.url;
      const ctitle = this.state[i].snippet.channelTitle;
      const descr = this.state[i].snippet.description;
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = this.state[i].snippet.publishedAt;
      const date = new Date(dateStr).toLocaleDateString('en-US', options);
      const id = this.state[i].id.videoId;
      const url = `https://www.youtube.com/watch?v=${id}`;
      const videoViews = this.views[i].statistics.viewCount;
      const block = document.createElement('div');
      document.querySelector('.items').appendChild(block);
      block.innerHTML = (`<a class = 'prev' href = '${url}' target = '_blank'><img src= '${prev}'></img></a> <p class = 'name'>${name}</p> <p class = 'views'>Views: ${videoViews}</p> <p class = 'descr'>${descr}</p> <p class = 'data'>${date}</p> <p class = 'ctitle'>Channel: ${ctitle}</p>`);
      block.classList.add('item');
    }
    return true;
  }
}
