import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    documentData: {
      documentType: undefined,
      projectId: undefined,
      folderId: undefined,
      docListTitle: ''
    }
  },
  modules: {
    app,
    tagsView
  }
})

export default store
