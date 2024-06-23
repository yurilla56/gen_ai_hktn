<template>
    <div class="quiz-checker">
      <div class="features">
        <div class="back-btn" @click="goToPage('')">
            <img alt="Quiz Checker" src="../../assets/images/arrow-back.svg" />
        </div>
        <div class="left-blocks">
          <div v-show="showBadge" class="badge"><img alt="Brilliant" src="../../assets/images/brilliant.png" /></div>
          <div class="avatar">
            <!-- <img v-if="imageSrc" :src="imageSrc" :alt="locationName" /> -->
            <div class="question-main--img">
              <img src="../../assets/images/question1-main.jpeg" alt="question" />
              <p>How to cook pizza?</p>
            </div>
          </div>
        </div>
        <div class="answers-block">
          <div class="answers">
            <img src="../../assets/images/question1-answer1.jpeg" alt="question" />
            <img src="../../assets/images/question1-answer2.jpeg" alt="question" />
            <img src="../../assets/images/question1-answer3.jpeg" alt="question" />
            <img src="../../assets/images/question1-answer1.jpeg" alt="question" />
          </div>
        </div>
      </div>
    </div>
  </template>
    
  <script setup lang="ts">
    import { onMounted, computed, ref } from 'vue'
    import { useQuizzesStore } from '../../stores/quizzes';
    import { useRouter } from 'vue-router'
    
    const router = useRouter()
    const quizzesStore = useQuizzesStore();
    const answers = computed(() => quizzesStore.quizzes);
    const showBadge = ref(false);
    
    const goToPage = (page) => {
      router.push(`/${page}`)
    }
    
    onMounted(async () => {  
      await quizzesStore.requestQuizzes();
      console.log('Quiz Checker Page Mounted', answers.value);
    })
  </script>
    
  <style scoped>
  .quiz-checker {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
  
      .back-btn {
          position: absolute;
          background: #EBEDF5;
          border-radius: 100%;
          padding: 30px 10px 10px 30px;
          left: -25px;
          top: -25px;
          cursor: pointer;
          z-index: 1;
      }
    
      .features {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
    
        .left-blocks {
          position: relative;
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
  
          .badge {
            position: absolute;
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: space-evenly;
            background: #2d0b6f7a;
            z-index: 1;
          }
        }
    
        .answers-block {
          height: 100%;
          display: flex;
          flex: 1;
          justify-content: space-evenly;
        }
  
        .answers {
          width: 100%;
          height: 100%;
          margin: 50px 40px;

          img {
            width: 40%;
            height: auto;
            object-fit: cover;
            margin: 10px;
          }
        }
      }

    .question-main--img {
      max-width: 100%;
      max-height: 80%;
      margin: 50px;
      justify-content: center;

      p {
        font-size: 3rem;
        font-weight: 600;
        color: #000;
        text-align: center;
      };
  
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  </style>
    