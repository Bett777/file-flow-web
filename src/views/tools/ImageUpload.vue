<template>
  <div class="avatar-upload">
    <el-form ref="docForm" :model="documentInfo" :rules="rules" label-width="230px" class="form-list">
      <el-form-item label="文档名称: " prop="documentName" class="name-input">
        <el-input v-model="documentInfo.documentName" maxlength="15" show-word-limit placeholder="请输入" />
      </el-form-item>
      <el-form-item label="上传文档: " class="name-input" required>
        <el-card shadow="always" :body-style="{padding: '0px'}">
          <div class="content-box">
            <el-upload ref="upload" :show-file-list="true" :http-request="toUploadFile" :on-remove="removeFile" action="" drag multiple>
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="文档封面: " required>
        <el-row :gutter="0">
          <div>点击图片右上角单选框选择</div>
          <div v-for="(item, index) in imageList" :key="index">
            <el-col :span="3" class="image-card" style="position:relative;">
              <el-card :body-style="{ padding: '5px', margin: 0, opacity: 0.7}">
                <img :src="'https://play.min.io/jgc-file-flow-image/' + item" class="image" alt="logo">
              </el-card>
              <div class="checkbox" style="position:absolute;top:0;right:0;z-index:1000">
                <el-radio v-model="selectImage" :label="index+1" />
              </div>
            </el-col>
          </div>
          <el-upload list-type="picture-card" :show-file-list="false" :http-request="toUploadImage" action="" multiple>
            <i class="el-icon-plus" />
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item>
        <router-link :to="{ path: '/documents/project-doc' }" class="submit-box">
          <el-button size="big">取消</el-button>
        </router-link>
        <el-button size="big" type="primary" @click="submitDocForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadFile, getImageList, addDocument } from '@/api'

export default {
  name: 'AvatarUpload',
  data() {
    return {
      documentInfo: {
        documentId: undefined,
        projectId: undefined,
        folderId: undefined,
        documentName: '',
        documentType: undefined,
        documentUrl: undefined,
        imageUrl: undefined
      },
      imageList: [],
      selectImage: undefined,
      rules: {
        documentName: [
          { required: true, message: '文档名称不能为空', trigger: 'blur' }
        ],
        documentType: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      filesFormat: '.jpg, .jpeg, .gif, .png, .bmp'
    }
  },
  activated() {
    this.findImageList()
    this.documentInfo.documentId = undefined
    this.documentInfo.projectId = undefined
    this.documentInfo.folderId = undefined
    this.documentInfo.documentName = ''
    this.documentInfo.documentType = undefined
    this.documentInfo.documentUrl = undefined
    this.documentInfo.imageUrl = undefined
    this.$refs.upload.clearFiles()
  },
  methods: {
    toUploadFile(fileObj) {
      const formData = new FormData()
      formData.append('file', fileObj.file)
      uploadFile(formData).then(res => {
        if (res.code === 10000) {
          this.documentInfo.documentUrl = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    toUploadImage(fileObj) {
      const formData = new FormData()
      formData.append('file', fileObj.file)
      uploadFile(formData).then(res => {
        if (res.code === 10000) {
          this.findImageList()
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    removeFile() {
      this.documentInfo.documentUrl = undefined
    },
    findImageList() {
      getImageList().then(res => {
        if (res.code === 10000) {
          this.imageList = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    submitDocForm() {
      this.documentInfo.imageUrl = this.imageList[this.selectImage - 1]
      this.documentInfo.projectId = this.$store.state.documentData.projectId
      this.documentInfo.folderId = this.$store.state.documentData.folderId
      this.documentInfo.documentType = this.$store.state.documentData.documentType
      addDocument(this.documentInfo).then(res => {
        if (res.code === 10000) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.$router.push({ path: '/documents/project-doc' })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.avatar-upload {
  .content-box {
    height: 220px;
    .el-upload {
      display: block;
    }
    .icon-small {
      padding: 8px 24px;
      .el-icon-upload {
        font-size: 14px;
        margin-right: 3px;
      }
    }
  }
  .form-list {
    margin: 0 auto;
    .name-input {
      width: 70%;
    }
    .image-card {
      margin: 0 10px 10px 0;
    }
  }
  .submit-box {
    margin: 0 40px 0 0;
  }
}
</style>
