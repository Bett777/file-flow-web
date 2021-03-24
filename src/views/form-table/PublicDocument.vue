<template>
  <el-row class="folder-public" :gutter="20">
    <div style="padding: 14px;">
      <el-button size="big" type="primary" @click="handleCreate">添加文件夹</el-button>
    </div>
    <el-col :span="4" class="doc">
      <el-card shadow="always" :body-style="{padding: '10px'}">
        <div style="padding: 14px;">
          <span style="color: darkcyan">所有文档</span>
        </div>
        <div class="box-cont">
          <a @click="toAllDocumentList">
            <img src="~@/assets/img/doc-images/folder.jpeg" alt="logo">
          </a>
        </div>
        <div class="doc-opera">
          <el-button size="mini" disabled>删除</el-button>
          <el-button size="mini" disabled>编辑</el-button>
        </div>
      </el-card>
    </el-col>
    <div v-for="(item, index) in folderList" :key="index">
      <el-col :span="4" class="doc">
        <el-card shadow="always" :body-style="{padding: '10px'}">
          <div style="padding: 14px;">
            <span>{{ item.folderName }}</span>
          </div>
          <div class="box-cont">
            <a @click="toDocumentList(item)">
              <img src="~@/assets/img/doc-images/folder.jpeg" alt="logo">
            </a>
          </div>
          <div class="doc-opera">
            <el-button size="mini" @click="toDeleteFolder(item.folderId)">删除</el-button>
            <el-button size="mini" @click="handleEdit(item)">编辑</el-button>
          </div>
        </el-card>
      </el-col>
    </div>
    <!-- 新增/编辑 弹出栏 -->
    <el-dialog
      title="编辑"
      :visible.sync="formVisible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="folderInfo"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="项目名称：" prop="folderName">
          <el-input v-model="folderInfo.folderName" maxlength="15" show-word-limit />
        </el-form-item>
        <div class="footer-item">
          <el-button @click="cancleForm">取 消</el-button>
          <el-button type="primary" :disabled="isSubmit" @click="submitForm()">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import { getFolderList, insertFolder, updateFolder, deleteFolder } from '@/api'

export default {
  name: 'PublicDocument',
  data() {
    return {
      folderList: [],
      folderInfo: {
        folderId: undefined,
        folderName: undefined
      },
      // 防止多次连续提交表单
      isSubmit: false,
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      formRules: {
        folderName: [
          { required: true, message: '请输入文件名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getFolderList()
  },
  methods: {
    // 新建数据
    handleCreate() {
      this.formVisible = true
      this.folderInfo.folderId = undefined
      this.folderInfo.folderName = undefined
    },
    // 编辑数据
    handleEdit(row) {
      this.formVisible = true
      this.folderInfo.folderId = row.folderId
      this.folderInfo.folderName = row.folderName
    },
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.formVisible = false
      this.$refs.dialogForm.resetFields()
    },
    // 新增/编辑表单取消提交
    cancleForm() {
      this.$refs.dialogForm.resetFields()
      this.formVisible = false
    },
    getFolderList() {
      getFolderList().then(res => {
        if (res.code === 10000) {
          this.folderList = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 新增/编辑表单确认提交
    submitForm() {
      this.isSubmit = true
      if (this.folderInfo.folderId === undefined) {
        insertFolder(this.folderInfo).then(res => {
          if (res.code === 10000) {
            this.formVisible = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getFolderList()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.isSubmit = false
        }).catch(() => {
          this.formVisible = true
        })
      } else {
        updateFolder(this.folderInfo).then(res => {
          if (res.code === 10000) {
            this.formVisible = false
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.getFolderList()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.isSubmit = false
        }).catch(() => {
          this.formVisible = true
        })
      }
    },
    toDeleteFolder(param) {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 此处可添加--删除接口
        deleteFolder(param).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getFolderList()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toDocumentList(item) {
      this.$store.state.documentData.documentType = 2
      this.$store.state.documentData.docListTitle = '公共文档: ' + item.folderName
      this.$store.state.documentData.folderId = item.folderId
      this.$store.state.documentData.projectId = undefined
      this.$router.push({ path: '/documents/project-doc' })
    },
    toAllDocumentList() {
      this.$store.state.documentData.documentType = 2
      this.$store.state.documentData.folderId = undefined
      this.$store.state.documentData.docListTitle = '公共文档: ' + '所有文档'
      this.$store.state.documentData.projectId = undefined
      this.$router.push({ path: '/documents/project-doc' })
    }
  }
}
</script>

<style lang="less">
.folder-public {
  .doc-opera {
    align-content: center;
    margin: 10px 0 10px 0;
  }
}
</style>
