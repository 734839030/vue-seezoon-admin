<template>
  <!-- 查询表单 -->
  <a-form
    ref="searchForm"
    :labelCol="labelCol"
    :model="searchForm"
    :wrapperCol="wrapperCol"
    layout="inline"
  >
    <a-form-item label="名称" name="name">
      <a-input v-model:value="searchForm.name" :maxlength="100" placeholder="请输如名称" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button v-auth="'sys:dept:query'" type="primary" @click="handleQuery()">查询</a-button>
        <a-button type="default" @click="$refs.searchForm.resetFields()">重置</a-button>
        <a-button v-auth="'sys:dept:save'" type="default" @click="$refs.dataFormModal.open('添加')"
          >添加
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-row :gutter="16" class="mt-4">
    <a-col :span="4">
      <a-card size="small" title="部门">
        <a-tree :load-data="loadDeptData" :tree-data="deptTreeData" @select="onDeptTreeSelect" />
      </a-card>
    </a-col>
    <a-col :span="20">
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="pagination"
        :row-key="(record) => record.id"
        bordered
        size="small"
        @change="handleTableChange"
      >
        <template #action="{ record }">
          <a v-auth="'sys:dept:update'" @click="$refs.dataFormModal.open('编辑', record.id)"
            >编辑</a
          >
          <a-divider type="vertical" />
          <a-popconfirm
            placement="left"
            title="确定删除本部门及下级部门？"
            @confirm="handleDelete('/sys/dept/delete', record.id)"
          >
            <a v-auth="'sys:dept:delete'">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-col>
  </a-row>
  <data-form-modal
    ref="dataFormModal"
    @refreshDeptTree="loadDeptData"
    @refreshQuery="handleQuery"
  />
</template>
<script>
  import DataFormModal from './DataFormModal.vue';
  import { queryTableMixin } from '../../../mixins/common/query-table-mixin';
  import { deptTree } from '../../../api/sys';

  export default {
    name: 'MainTable',
    components: { DataFormModal },
    mixins: [queryTableMixin],
    data() {
      return {
        url: '/sys/dept/query',
        columns: [
          {
            title: '部门名称',
            dataIndex: 'name',
            fixed: 'left',
            width: 180,
          },
          {
            title: '父部门',
            dataIndex: 'parentName',
            ellipsis: true,
          },
          {
            title: '联系人',
            dataIndex: 'contactUser',
            width: 120,
          },
          {
            title: '联系电话',
            dataIndex: 'telephone',
            width: 180,
          },
          {
            title: '序号',
            dataIndex: 'sort',
            width: 80,
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
          },
          {
            title: '修改时间',
            dataIndex: 'updateTime',
            ellipsis: true,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 120,
            slots: { customRender: 'action' },
          },
        ],
        // 部门树
        deptTreeData: [],
      };
    },
    mounted() {
      this.handleQuery();
      // 加载部门树
      this.loadDeptData();
    },
    methods: {
      handleDeleteCb(id) {
        this.searchForm.parentId =
          id === this.searchForm.parentId ? null : this.searchForm.parentId;
        this.loadDeptData();
      },
      onDeptTreeSelect(selectedKeys, { node }) {
        this.searchForm.parentId = node.selected ? undefined : node.dataRef.value;
        this.$refs.dataFormModal.dataForm.parentId = node.selected ? undefined : node.dataRef.value;
        this.handleQuery();
      },
      //加载部门树
      loadDeptData(treeNode) {
        return new Promise((resolve) => {
          if (treeNode && treeNode.dataRef.children) {
            resolve();
            return;
          }
          deptTree(treeNode ? treeNode.dataRef.value : 0, true).then((data) => {
            if (!treeNode) {
              this.deptTreeData = data;
            } else {
              treeNode.dataRef.children = data;
            }
            resolve();
          });
        });
      },
    },
  };
</script>
