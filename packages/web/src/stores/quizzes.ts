import { defineStore } from 'pinia'

const apiKey = process.env.VUE_APP_X_API_KEY;

export const useQuizzesStore = defineStore('quizzes', {
  state: () => ({
    quizzes: [],
  }),
  actions: {
    async fetchQuizzes() {
      const url = new URL('https://or2-msq-epm-gnai5-t1iylu.oa.r.appspot.com/api/quizzes');
    
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey,
        },
      });
    
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    
      return await response.json();
    },

    async requestQuizzes() {
      let quizzesRetrieved = false;
      let quizzes;

      // while (!clothesRetrieved) {
        try {
          quizzes = await this.fetchQuizzes();

          if (quizzes.clothes.length > 0) {
            quizzesRetrieved = true;
          }
        } catch (error) {
          console.error('Error fetching weather recommendation:', error);
        }
      // }
      console.log('quizzes', quizzes, quizzesRetrieved);

      const dataQuizzes = await this.fetchQuizzes();
      console.log('dataQuizzes', dataQuizzes);
      this.quizzes = dataQuizzes;
    },
  },
})
