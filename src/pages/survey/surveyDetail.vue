<template>
    <div class="survey-page">
        <div class="header-cont">
            <p>Flight Satisfactions Survey Reports</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button>            
                <router-link to="/reports-survey">
                    View Results Summary |
                </router-link>
            </button>
            <button>            
                <router-link to="/reports-survey/detail">
                    View Detailed Results |
                </router-link>
            </button>
            <button @click="logout">
                Exit
            </button>
        </div>
        <div class="main">
            <div class="user-info">
                <p>Time period: </p>
                <select
                    v-model="selectedMonth"
                    class="period-selector"
                >
                    <option value="">
                        All
                    </option>
                    <option
                        v-for="month in uniqueMonths"
                        :key="month"
                        :value="month"
                    >
                        {{ formatDate(month) }}
                    </option>
                </select>
            </div>
            <div class="tables">
                <table class="table_q">
                    <thead>
                      <tr class="table_header_q">
                        <th class="header_questions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr :style="{ 'text-align': shouldAlignLeft(index) ? 'start' : 'end', height: shouldInsertEmptyRow(index) ? '20px' : 'auto', backgroundColor: (index) % 2 === 0 ? 'transparent' : 'lightblue' }"
                        v-for="(question, index) in questions" :key="index"
                        class="table_row_questions"
                      >
                        <td>{{ question }}</td>
                      </tr>
                    </tbody>
                </table>
            <table class="table">
                <tr class="table_header">
                    <th colspan="1" />
                    <th colspan="2">
                        Gender
                    </th>
                    <th colspan="4">
                        Age
                    </th>
                    <th colspan="3">
                        Cabin Type
                    </th>
                    <th colspan="5">
                        Destination Airport
                    </th>
                </tr>
                <tr class="table_subheader">

                    <th>Total</th>

                    <th>Male</th>
                    <th>Female</th>

                    <th>18-24</th>
                    <th>25-39</th>
                    <th>40-59</th>
                    <th>60+</th>

                    <th>Economy</th>
                    <th>Business</th>
                    <th>First</th>

                    <th>AUH</th>
                    <th>BAH</th>
                    <th>DOH</th>
                    <th>RUH</th>
                    <th>CAI</th>
                </tr>
                <template v-for="(question, index) in questionKeys">
                    <tr :style="{ height: shouldInsertEmptyRow(index) ? '20px' : 'auto' }">
                      <td :colspan="shouldInsertEmptyRow(index) ? 16 : 1">
                        <div
                            v-for="answerOption in computedAnswerOptions"
                            :key="answerOption"
                            :style="{ width: getPercentage(question, answerOption) + '%', display: 'inline-block', height: '10px', backgroundColor: getColor(answerOption) }"
                            ></div>
                        </td>
                    </tr>
                  <tr v-for="answerOption in computedAnswerOptions" :key="answerOption"
                    :style="{ backgroundColor: (answerOption) % 2 === 0 ? 'transparent' : 'lightblue'}"
                  >
                    <td >{{ countTotal(question, answerOption) }}</td>
                    <td >{{ countMale(question, answerOption) }}</td>
                    <td >{{ countFemale(question, answerOption) }}</td>
                    <td >{{ countAgeRange(question, answerOption, 18, 24) }}</td>
                    <td >{{ countAgeRange(question, answerOption, 25, 39) }}</td>
                    <td >{{ countAgeRange(question, answerOption, 40, 59) }}</td>
                    <td >{{ countAgeRange(question, answerOption, 60, Infinity) }}</td>
                    <td>{{ countCabinType(question, answerOption, 'Economy') }}</td>
                    <td>{{ countCabinType(question, answerOption, 'Business') }}</td>
                    <td>{{ countCabinType(question, answerOption, 'First') }}</td>
                    <td>{{ countAirport(question, answerOption, 'AUH') }}</td>
                    <td>{{ countAirport(question, answerOption, 'BAH') }}</td>
                    <td>{{ countAirport(question, answerOption, 'DOH') }}</td>
                    <td>{{ countAirport(question, answerOption, 'RUH') }}</td>
                    <td>{{ countAirport(question, answerOption, 'CAI') }}</td>
                  </tr>
                </template>
            </table>
            </div>
            <div class="color_blocks">
                <div class="color_blocks">
                    <div class="color_block-green"></div>
                    <div>Outstanding</div>
                </div>
                <div class="color_blocks">
                    <div class="color_block-lightgreen"></div>
                    <div>Very Good</div>
                </div>
                <div class="color_blocks">
                    <div class="color_block-lightseagreen"></div>
                    <div>Good</div>
                </div>
                <div class="color_blocks">
                    <div class="color_block-pink"></div>
                    <div>Adequate</div>
                </div>
                <div class="color_blocks">
                    <div class="color_block-lightpink"></div>
                    <div>Needs Improvement</div>
                </div>
                <div class="color_blocks">
                    <div class="color_block-orange"></div>
                    <div>Poor</div>
                </div>
                <div class="color_blocks">
                    <div class="color_block-grey"></div>
                    <div>Don't know</div>
                </div>
                
            </div>
            <div class="options">
                <input type="checkbox" v-model="showGenderSelector" /> Gender 
                
                <div class="options_selector">
                  <select v-model="selectedGender" :disabled="!showGenderSelector" >
                    <option value="all">All Genders</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                
                <input type="checkbox" v-model="showAgeSelector" /> Age

                <div class="options_selector">
                  <select v-model="selectedAge" :disabled="!showAgeSelector">
                    <option value="all">All Ages</option>
                    <option value="18-24">18-24</option>
                    <option value="25-39">25-39</option>
                    <option value="40-59">40-59</option>
                    <option value="60+">60+</option>
                  </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PATHS } from '../../constants';

export default {
    name: 'SurveySummary',
    data() {
        return {
            selectedMonth: "",
            uniqueMonths: [],
            questions: [
              "Please rate our aircraft flown on AMONIC Airlines:", "Outstanding", "Very Good", "Good", "Adequate", "Needs Improvement", "Poor", "Don't know",
              "How would you rate our flight attendants:", "Outstanding", "Very Good", "Good", "Adequate", "Needs Improvement", "Poor", "Don't know",
              "How would you rate our inflight entertainment:", "Outstanding", "Very Good", "Good", "Adequate", "Needs Improvement", "Poor", "Don't know",
              "Please rate the ticket price for the trip you are taking:", "Outstanding", "Very Good", "Good", "Adequate", "Needs Improvement", "Poor", "Don't know",
            ],
            filterOptions: {
            gender: {
                enabled: false,
                value: ""
            },
            age: {
                enabled: false,
                value: ""
            }
        },
        showGenderSelector: false,
        showAgeSelector: false,
        selectedGender: 'all',
        selectedAge: 'all',
        };
    },
    computed: {
        computedAnswerOptions() {
          // Add the logic to get unique answer options here
          const uniqueOptions = new Set();
          this.surveys.forEach((survey) => {
            Object.keys(survey).forEach((question) => {
              if (question.startsWith('q') && survey[question] >= 1 && survey[question] <= 7) {
                uniqueOptions.add(survey[question]);
              }
            });
          });
          return Array.from(uniqueOptions).sort();
        },
        surveys() {
            return this.$store.state.survey.surveys;
        },
        uniqueMonths() {
            const months = new Set();
            this.surveys.forEach(survey => {
                if (survey.month) {
                    months.add(survey.month);
                }
            });
            return Array.from(months);
        },
        filteredData() {
          // Фильтрация данных в таблице в соответствии с выбранными опциями
          let filteredSurveys = this.surveys;

          if (this.selectedMonth) {
            filteredSurveys = filteredSurveys.filter(
              (survey) => survey.month === this.selectedMonth
            );
          }

          if (this.showGenderSelector && this.selectedGender !== 'all') {
            filteredSurveys = filteredSurveys.filter(
              (survey) => survey.gender === this.selectedGender
            );
          }

          if (this.showAgeSelector && this.selectedAge !== 'all') {
            filteredSurveys = filteredSurveys.filter(
              (survey) => {
                const ageRange = this.selectedAge.split('-');
                const minAge = parseInt(ageRange[0], 10);
                const maxAge = parseInt(ageRange[1], 10);
                return survey.age >= minAge && survey.age <= maxAge;
              }
            );
          }

          return filteredSurveys;
        },
        questionKeys() {
          // Получите ключи вопросов из данных опросов
          const questionKeys = new Set();
          this.surveys.forEach((survey) => {
            Object.keys(survey).forEach((question) => {
              if (question.startsWith('q') && survey[question] >= 1 && survey[question] <= 7) {
                questionKeys.add(question);
              }
            });
          });
          return Array.from(questionKeys).sort();
        },
        answerOptions() {
          // Получите уникальные варианты ответов из данных опросов
          const uniqueOptions = new Set();
          this.surveys.forEach((survey) => {
            Object.keys(survey).forEach((question) => {
              if (question.startsWith('q') && survey[question] >= 1 && survey[question] <= 7) {
                uniqueOptions.add(survey[question]);
              }
            });
          });
          return Array.from(uniqueOptions).sort();
        },
        filteredSurveysByGender() {
    if (this.showGenderSelector && this.selectedGender !== 'all') {
      return this.filteredData.filter((survey) => survey.gender === this.selectedGender);
    } else {
      return this.filteredData;
    }
  },
        
    },
    created() {
        this.$store.dispatch('survey/surveys');
    },
    methods: {
        getColor(answerOption) {
          switch (answerOption) {
            case 1:
              return 'green'; // "Outstanding"
            case 2:
              return 'LawnGreen'; // "Very Good"
            case 3:
              return 'lightgreen'; // "Good"
            case 4:
              return 'pink'; // "Adequate"
            case 5:
              return 'lightpink'; // "Needs Improvement"
            case 6:
              return 'orange'; // "Poor"
            case 7:
              return 'grey'; // "Don't know"
            default:
              return 'transparent';
          }
        },
        getPercentage(question, answerOption) {
          const total = this.countTotal(question, answerOption);
          const totalCount = this.filteredData.length;
          return (total / totalCount) * 100;
        },
        shouldInsertEmptyRow(index) {
          return (index + 1) % 7 === 0 && index < this.questionKeys.length - 1;
        },
        shouldAlignLeft(index) {
          return (index + 1) % 8 === 1; // Выравниваем по левой стороне каждую 8-ю строку, начиная с 1-й
        },
        getFilteredSurveys(question) {
          const filteredSurveys = this.filteredData; // используйте filteredData, а не this.surveys

          if (this.selectedMonth) {
            return filteredSurveys.filter(
              (survey) => survey.month === this.selectedMonth && survey[question]
            );
          }
      
          return filteredSurveys.filter((survey) => survey[question]);
        },
    
        countTotal(question, answerOption) {
          return this.getFilteredSurveys(question).filter(
            (survey) => survey[question] === answerOption
          ).length;
        },
    
        countGender(question, answerOption, gender) {
          return this.getFilteredSurveys(question).filter(
            (survey) =>
              survey.gender === gender &&
              survey[question] === answerOption
          ).length;
        },
    
        countMale(question, answerOption) {
          return this.getFilteredSurveys(question).filter(
            (survey) => survey.gender === 'M' && survey[question] === answerOption
          ).length;
        },
    
        countFemale(question, answerOption) {
          return this.getFilteredSurveys(question).filter(
            (survey) => survey.gender === 'F' && survey[question] === answerOption
          ).length;
        },
    
        countAgeRange(question, answerOption, min, max) {
            return this.getFilteredSurveys(question).filter(
              (survey) => {
                if (max === Infinity) {
                  return survey.age >= min && survey[question] === answerOption;
                } else {
                  return survey.age >= min && survey.age <= max && survey[question] === answerOption;
                }
              }
            ).length;
        },
    
        countCabinType(question, answerOption, cabinType) {
          return this.getFilteredSurveys(question).filter(
            (survey) =>
              survey.cabintype === cabinType &&
              survey[question] === answerOption
          ).length;
        },
    
        countAirport(question, answerOption, airport) {
          return this.getFilteredSurveys(question).filter(
            (survey) =>
              survey.arrival === airport &&
              survey[question] === answerOption
          ).length;
        },
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
        },
        formatDate(dateString) {
            if (!dateString) {
                return "";
            }
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString('en-US', options);
        },    
    },
}
</script>

<style lang="scss" scoped>
.question_column {
  text-align: left;
}

.answer_column {
  text-align: right;
}
.users-menu {
    width: 100vw;
    height: 100vh;
    border: solid 3px;
}
.header-cont {
    padding: 0 5px;
    border-bottom: solid 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0;
    }

    button {
      background-color: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }

}
.header-button{
    border-bottom: solid 3px;
    button {
      background-color: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
}
.main {
    margin: 35px 20px;
}
.user-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
}
.tables {
    display: flex;
    flex-direction: row;
}
.table {
    flex: 2;
    border-collapse: collapse;
    &_header {
        background: grey;
        border: 3px solid black;
        th {
            text-align: center;
            padding: 2px;
            border-left: 3px solid black;
        }
    }
    &_subheader {
        background: grey;
        border: 3px solid black;
        th {
            text-align: center;
            padding: 2px;
            border-left: 3px solid black;
        }
    }
    &_row {
        td {
            padding: 2px;
        }
    }
}
.table_q {
  flex: 1;
  border-collapse: collapse;
  &_header_q {
    th {
      text-align: start;
      padding: 2px;
    }
  }
}
.empty-row {
  height: 20px; /* Вы можете изменить высоту, если нужно */
}
.header_questions{
    height: 65px;
}
.options{
    display: flex;
    justify-content: center;
    &_selector {
        margin: 0 105px 0  25px;
    }
}

  .color_blocks {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    gap: 5px;
  }

  .color_block-green {
    background-color: green; // "Outstanding"
    height: 10px;
    width: 10px;
  }

  .color_block-lightgreen {
    background-color: LawnGreen; // "Very Good"
    height: 10px;
    width: 10px;
  }

  .color_block-lightseagreen {
    background-color: lightgreen; // "Good"
    height: 10px;
    width: 10px;
  }

  .color_block-pink {
    background-color: pink; // "Adequate"
    height: 10px;
    width: 10px;
  }

  .color_block-lightpink {
    background-color: lightpink; // "Needs Improvement"
    height: 10px;
    width: 10px;
  }

  .color_block-orange {
    background-color: orange; // "Poor"
    height: 10px;
    width: 10px;
  }

  .color_block-grey {
    background-color: grey; // "Don't know"
    height: 10px;
    width: 10px;
  }


</style>