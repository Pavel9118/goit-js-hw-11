import axios from 'axios';

export default class ImgApi {
    constructor() {
      this.page = 1;
      this.searchQuery = 'qqq';
      
    }
  
    async fetchImg() {
      const BASE_URL = 'https://pixabay.com/api/';
      const params = new URLSearchParams({
        key: '37033231-47a0b5740644e1a01359c9bee',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      });

      const res = await axios.get(`${BASE_URL}?${params}`);
      return res.data;
    }
  
    incrementPage() {
      this.page += 1;
    }
  
    resetPage() {
      this.page = 1;
    }
  
    get query() {
      return this.searchQuery;
    }
  
    set query(query) {
      this.searchQuery = query;
    }
  }