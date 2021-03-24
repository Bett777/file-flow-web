<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="项目名称">
          <el-input v-model="listQuery.params.projectName" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="项目组">
          <el-select v-model="listQuery.params.groupId" placeholder="所有">
            <el-option :value="1" label="A组" />
            <el-option :value="2" label="B组" />
            <el-option :value="3" label="C组" />
            <el-option :value="null" label="所有" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="handleCreate">新建项目</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
      >
        <el-table-column prop="projectCode" label="项目编号" align="center" width="120" sortable />
        <el-table-column prop="projectName" label="项目名称" align="center" />
        <el-table-column prop="path" label="访问地址" align="center" />
        <el-table-column prop="groupName" label="项目组" align="center" />
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="toDocumentList(scope.row)">文档列表</el-button>
            <el-button size="mini" :disabled="scope.row.forbid" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.paging.pageNumber" :limit.sync="listQuery.paging.pageSize" @pagination="fetchData" />
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
          :model="dialogForm"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="项目编号：" prop="projectCode">
            <el-input v-model="dialogForm.projectCode" maxlength="15" show-word-limit />
          </el-form-item>
          <el-form-item label="项目名称：" prop="projectName">
            <el-input v-model="dialogForm.projectName" maxlength="15" show-word-limit />
          </el-form-item>
          <el-form-item label="访问地址：" prop="path">
            <el-input v-model="dialogForm.path" maxlength="255" show-word-limit />
          </el-form-item>
          <el-form-item label="项目组：" prop="groupId">
            <el-select v-model="dialogForm.groupId">
              <el-option :value="1" label="A组" />
              <el-option :value="2" label="B组" />
              <el-option :value="3" label="C组" />
            </el-select>
          </el-form-item>
          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="submitForm()">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getTableList, insertProject, updateProject, deleteProject } from '@/api'
import Pagination from '../../components/Pagination'

export default {
  name: 'Table',
  components: { Pagination },
  data() {
    return {
      // 数据列表加载动画
      listLoading: false,
      // 查询列表参数对象
      listQuery: {
        paging: {
          pageNumber: 1,
          pageSize: 10,
          totalPage: 0,
          totalNumber: 0
        },
        params: {
          projectName: undefined,
          projectCode: undefined,
          groupId: undefined
        }
      },
      // 新增/编辑提交表单对象
      dialogForm: {
        projectId: undefined,
        projectCode: undefined,
        projectName: undefined,
        path: undefined,
        groupId: undefined,
        groupName: undefined
      },
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules: {
        projectCode: [
          { required: true, message: '请输入项目编码', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入项目路径', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择项目组', trigger: 'blur' }
        ]
      },
      // 防止多次连续提交表单
      isSubmit: false,
      // 导入数据 弹出框显示/隐藏
      importVisible: false,
      // 导出文件格式
      filesFormat: '.txt, .csv, .xls, .xlsx',
      // 导出数据 弹出框显示/隐藏
      exportVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 新建数据
    handleCreate() {
      this.formVisible = true
      this.dialogForm.projectId = undefined
      this.dialogForm.projectName = undefined
      this.dialogForm.projectCode = undefined
      this.dialogForm.path = undefined
      this.dialogForm.groupId = undefined
      this.dialogForm.groupName = undefined
    },
    // 编辑数据
    handleEdit(index, row) {
      console.log(index, row)
      this.formVisible = true
      this.dialogForm.projectId = row.projectId
      this.dialogForm.projectCode = row.projectCode
      this.dialogForm.projectName = row.projectName
      this.dialogForm.path = row.path
      this.dialogForm.groupId = row.groupId
      this.dialogForm.groupName = row.groupName
    },
    // 删除数据
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 此处可添加--删除接口
        deleteProject(row.projectId).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
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
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.formVisible = false
      this.$refs.dialogForm.resetFields()
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      // 获取数据列表接口
      // eslint-disable-next-line no-undef
      getTableList(this.listQuery).then(res => {
        console.log(res)
        if (res.code === 10000) {
          this.total = res.data.paging.totalNumber
          this.tableData = res.data.data
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 查询数据
    onSubmit() {
      this.listQuery.paging.pageNumber = 1
      this.fetchData()
    },
    // 导入数据
    handleImport() {
      this.importVisible = true
    },
    // 新增/编辑表单确认提交
    submitForm() {
      this.isSubmit = true
      const groupMap = new Map()
      groupMap.set(1, 'A组')
      groupMap.set(2, 'B组')
      groupMap.set(3, 'C组')
      this.dialogForm.groupName = groupMap.get(this.dialogForm.groupId)
      if (this.dialogForm.projectId === undefined) {
        insertProject(this.dialogForm).then(res => {
          if (res.code === 10000) {
            this.formVisible = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.fetchData()
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
        updateProject(this.dialogForm).then(res => {
          if (res.code === 10000) {
            this.formVisible = false
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.fetchData()
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
    // 新增/编辑表单取消提交
    cancleForm() {
      this.$refs.dialogForm.resetFields()
      this.formVisible = false
    },
    toDocumentList(row) {
      this.$store.state.documentData.docListTitle = row.projectName
      this.$store.state.documentData.documentType = 1
      this.$store.state.documentData.projectId = row.projectId
      this.$store.state.documentData.folderId = undefined
      this.$router.push({ path: '/documents/project-doc' })
    }
  }
}
</script>

<style lang="less">
.table-classic-wrapper {
  .el-card {
    min-height: 656px;
  }
  .control-btns {
    margin-bottom: 20px;
  }
  .search-form {
    padding-top: 18px;
    margin-bottom: 15px;
    background-color: #f7f8fb;
  }
  .el-table thead {
    font-weight: 600;
    th {
      background-color: #f2f3f7;
    }
  }
  .dialog-form {
    .el-input {
      width: 380px;
    }
    .footer-item {
      margin-top: 50px;
      text-align: right;
    }
  }
  .upload-box,
  .export-data {
    width: 300px;
    margin: 0 auto 30px;
  }
  .upload-box {
    width: 156px;
    .files-upload {
      color: #20a0ff;
    }
  }
  .hints {
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
}
</style>
