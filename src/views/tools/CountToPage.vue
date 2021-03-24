<template>
  <div class="count-to-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <h2>{{ getCacheData.docListTitle }}</h2>
      </el-col>
      <!-- 查询栏 -->
      <el-col :span="8">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="docListQuery"
          label-width="90px"
          class="search-form"
        >
          <el-form-item label="文档名称">
            <el-input v-model="docListQuery.params.documentName" placeholder="文档名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button v-show="addShow" type="primary" @click="toAddDocument">添加文档</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div v-show="documentList.length === 0" class="no-data">
      <img src="~@/assets/img/error-images/no-data.jpg" alt="image">
    </div>
    <el-row class="count-to-box" :gutter="20">
      <div v-for="(item, index) in documentList" :key="index">
        <el-col :span="4" class="doc">
          <el-card shadow="always" :body-style="{padding: '10px'}">
            <div slot="header" class="title">{{ item.documentName }}</div>
            <div class="box-cont">
              <a :href="item.documentUrl">
                <img :src="'https://play.min.io/jgc-file-flow-image/' + item.imageUrl" alt="logo">
              </a>
            </div>
            <div class="doc-opera">
              <el-button size="mini" @click="toDeleteDocument(item.documentId)">删除</el-button>
              <a :href="'https://play.min.io/jgc-file-flow-image/' + item.documentUrl">
                <el-button size="mini">下载</el-button>
              </a>
              <el-button size="mini" @click="docView(item)">预览</el-button>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <!-- 分页栏 -->
    <Pagination :total="total" :page.sync="docListQuery.paging.pageNumber" :limit.sync="docListQuery.paging.pageSize" @pagination="fetchDocList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deleteDocument, getDocumentList } from '@/api'

export default {
  name: 'CountToPage',
  components: { Pagination },
  data() {
    return {
      docListLoading: false,
      // 查询列表参数对象
      docListQuery: {
        paging: {
          pageNumber: 1,
          pageSize: 10,
          totalPage: 0,
          totalNumber: 0
        },
        params: {
          documentName: undefined,
          documentType: undefined,
          projectId: undefined,
          folderId: undefined
        }
      },
      total: 0,
      documentList: [],
      documentInfo: {
        documentId: undefined,
        title: undefined,
        imageUrl: undefined,
        documentUrl: undefined
      }
    }
  },
  computed: {
    getCacheData() {
      return this.$store.state.documentData
    },
    addShow() {
      const data = this.$store.state.documentData
      return data.folderId !== undefined || data.projectId !== undefined
    }
  },
  activated() {
    this.fetchDocList()
  },
  methods: {
    onSubmit() {
      this.docListQuery.paging.pageNumber = 1
      this.fetchDocList()
    },
    fetchDocList() {
      this.docListQuery.params.documentType = this.getCacheData.documentType
      this.docListQuery.params.projectId = this.getCacheData.projectId
      this.docListQuery.params.folderId = this.getCacheData.folderId
      getDocumentList(this.docListQuery).then(res => {
        if (res.code === 10000) {
          console.log(res)
          this.total = res.data.paging.totalNumber
          this.documentList = res.data.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    toAddDocument() {
      this.$router.push({ path: '/documents/add-doc' })
    },
    toDeleteDocument(documentId) {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDocument(documentId).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.fetchDocList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    docView(item) {
      const { href } = this.$router.resolve({ name: 'DocumentView', query: { documentUrl: item.documentUrl }})
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less">
.count-to-page {
  .doc {
    margin: 10px 0 10px 0;
    .doc-opera {
      align-content: center;
      margin: 10px 0 10px 0;
    }
  }
  .no-data {
    height: 300px;
    width: 400px;
    margin: 0 auto;
  }
  .box-cont {
    display: flex;
    height: 200px;
    box-sizing: border-box;
    opacity: 0.7;
  }
  .cont-wrapper {
    height: 300px;
    padding: 30px 50px 30px 50px;
    box-sizing: border-box;
    .cont-set-item {
      display: inline-block;
      width: 32%;
      margin-bottom: 10px;
      label {
        display: inline-block;
        vertical-align: middle;
        width: 40%;
      }
      .el-input {
        width: 50%;
      }
    }
    .cont-set-data {
      height: 100px;
      span {
        display: block;
        width: 270px;
        margin: 10px auto 0;
        font-size: 42px;
        text-align: center;
        color: #F6416C;
      }
    }
  }
}
</style>
