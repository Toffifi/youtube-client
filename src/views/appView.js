import './app-view.css';
import App from '../controllers/app';
import Factory from './factory';

export default class AppView {
  async start() {
    document.title = 'Youtube Client';

    this.app = new App();

    const header = document.createElement('header');
    const form = document.createElement('div');
    this.input = document.createElement('input');
    this.button = document.createElement('button');
    const main = document.createElement('main');
    const footer = document.createElement('footer');

    form.classList.add('form');
    this.input.type = 'text';
    this.button.innerHTML = 'Search';

    document.body.appendChild(header);
    document.querySelector('header').appendChild(form);
    document.querySelector('div').appendChild(this.input);
    document.querySelector('div').appendChild(this.button);
    document.body.appendChild(main);
    document.body.appendChild(footer);
    const div = document.createElement('div');
    div.classList.add('items');
    document.querySelector('main').appendChild(div);

    this.button.addEventListener('click', async () => {
      this.loadSearchResults();
    });
    document.body.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.loadSearchResults();
      }
    });
  }

  async loadSearchResults() {
    if (this.input.value.length === 0) {
      return;
    }
    document.querySelectorAll('.item').forEach((element) => {
      element.remove();
    });
    document.querySelectorAll('.pageBut').forEach((element) => {
      element.remove();
    });
    const obj = await this.app.ShowLog(this.input.value, false);
    const views = await this.app.ShowViews();
    const factory = new Factory(obj.items, views.items);
    await factory.generateObjects();
    const butArr = [];
    const butCount = document.querySelectorAll('.item').length / 4;
    for (let i = 1; i <= butCount; i += 1) {
      const pageBut = document.createElement('div');
      pageBut.number = i;
      butArr.push(pageBut);
      pageBut.addEventListener('click', () => {
        this.app.buttonPressed(pageBut, this.size, butArr);
      });
      document.querySelector('footer').appendChild(pageBut);
      pageBut.classList.add('pageBut');
      pageBut.classList.add(`but${i}`);
      pageBut.innerHTML = `${i}`;
      if (i === 1) {
        pageBut.classList.add('color');
      }
    }

    await this.app.slider(butArr);
    this.slider = document.querySelector('.items');
    this.size = document.querySelector('.item').offsetWidth;
    let nextPageLoaded = true;
    this.slider.addEventListener('scroll', async () => {
      if (nextPageLoaded && this.slider.scrollLeft / this.size > document.querySelectorAll('.item').length - 10) {
        nextPageLoaded = false;
        const appendData = await this.app.ShowLog(this.input.value, true);
        const appendViews = await this.app.ShowViews();
        const appendFactory = new Factory(appendData.items, appendViews.items);
        nextPageLoaded = await appendFactory.generateObjects();
      }
    });
  }
}
