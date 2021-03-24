<template>
  <div>
    <pdf :src="docUrl" />
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { downloadFile } from '@/api'

export default {
  name: 'DocumentView',
  components: {
    pdf
  },
  data() {
    return {
      docUrl: ''
    }
  },
  computed: {
    getDocumentUrl() {
      return this.$route.query.documentUrl
    }
  },
  created() {
    this.getPdfCode()
  },
  methods: {
    getPdfCode() {
      if (this.getDocumentUrl !== undefined) {
        downloadFile(this.getDocumentUrl).then(res => {
          console.log(res)
          this.docUrl = this.getFileUrl(res)
        })
      }
    },
    getFileUrl(file) {
      let url = null
      debugger
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) {
          this.$message({
            type: 'error',
            message: '解析文件异常'
          })
        }
      } else if (window.URL !== undefined) { // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) {
          this.$message({
            type: 'error',
            message: '解析文件异常'
          })
        }
      }
      return url
    }
  }
}
</script>

<style scoped>

</style>
