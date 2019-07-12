import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
}

const i18n = new VueI18n({
  locale: 'zh', // 设置默认语言为中文
  messages // set locale messages
})
export default i18n
