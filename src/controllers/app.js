import AppModel from '../models/appModel';

export default class App {
  constructor() {
    this.key = 'AIzaSyA7Euwfpwso2_XNiy9yjOSwLonpSFuixQA';
    this.originalApiQuery = 'https://www.googleapis.com/youtube/v3/';
    this.model = new AppModel(this.originalApiQuery);
  }


  async ShowLog(val, needAppend) {
    let data;
    if (!needAppend) {
      data = await this.model.getClipNames(`search?key=${this.key}&type=video&part=snippet&maxResults=15&q=${val}`);
    } else {
      data = await this.model.getClipNames(`search?pageToken=${this.nextPageToken}&key=${this.key}&type=video&part=snippet&maxResults=15&q=${val}`);
    }
    this.nextPageToken = data.nextPageToken;
    let videoids = '';
    for (let i = 0; i < data.items.length; i += 1) {
      videoids += data.items[i].id.videoId;
      if (i !== data.items.length - 1) {
        videoids += ',';
      }
    }
    this.viewsData = await this.model.getClipNames(`videos?key=${this.key}&id=${videoids}&part=snippet,statistics`);
    return data;
  }

  async ShowViews() {
    return this.viewsData;
  }

  async slider(butArr) {
    this.slider = document.querySelector('.items');
    let isDown = false;
    let startX;
    let scrollLeft;
    const size = document.querySelector('.item').offsetWidth;

    this.slider.addEventListener('mousedown', (e) => {
      isDown = true;
      this.slider.classList.add('active');
      startX = e.pageX - this.slider.offsetLeft;
      // eslint-disable-next-line prefer-destructuring
      scrollLeft = this.slider.scrollLeft;
    });
    this.slider.addEventListener('mouseleave', () => {
      isDown = false;
      let mod = this.slider.scrollLeft % size;
      if (mod > size / 2) {
        mod -= size;
      }
      this.slider.scrollLeft -= mod;
      this.slider.classList.remove('active');
    });
    this.slider.addEventListener('mouseup', () => {
      isDown = false;
      let mod = this.slider.scrollLeft % size;
      if (mod > size / 2) {
        mod -= size;
      }
      this.slider.scrollLeft -= mod;
      this.slider.classList.remove('active');
    });
    this.slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const curPage = Math.floor(this.slider.scrollLeft / (size * 4)) + 1;
      const x = e.pageX - this.slider.offsetLeft;
      const walk = (x - startX) * 3;
      if (Math.abs(walk) < (size * 4)) {
        this.slider.scrollLeft = scrollLeft - walk;
      } else {
        this.slider.scrollLeft = scrollLeft - ((size * 4) * (walk >= 0 ? 1 : -1));
      }
      const newPage = Math.floor(this.slider.scrollLeft / (size * 4)) + 1;
      if (newPage !== curPage) {
        let i = newPage - curPage;
        butArr.forEach((el) => {
          if (curPage !== 1 && newPage !== 1) {
            // eslint-disable-next-line no-param-reassign
            el.number += i;
            if (el.number < 1) {
              // eslint-disable-next-line no-param-reassign
              el.number = 1;
              i = 0;
            }
            // eslint-disable-next-line no-param-reassign
            el.innerHTML = `${el.number}`;
          }
          if (el.number === newPage) {
            el.classList.add('color');
          } else {
            el.classList.remove('color');
          }
        });
      }
    });
  }


  async buttonPressed(pageBut, size, butArr) {
    const origNumber = pageBut.number;
    const curPage = Math.floor(this.slider.scrollLeft / (size * 4)) + 1;
    const lastState = this.slider.scrollLeft;
    this.slider.scrollLeft = size * 4 * (pageBut.number - 1);
    if (curPage !== pageBut.number) {
      if (pageBut.number > 2 && lastState < this.slider.scrollLeft) {
        butArr.forEach((e) => {
          e.innerHTML = `${e.number + 1}`;
          e.number += 1;
        });
      } else if (pageBut.number > 1 && lastState > this.slider.scrollLeft) {
        butArr.forEach((e) => {
          e.innerHTML = `${e.number - 1}`;
          e.number -= 1;
        });
      }
    }
    butArr.forEach((e) => {
      if (origNumber === e.number) {
        e.classList.add('color');
      } else {
        e.classList.remove('color');
      }
    });
  }
}
