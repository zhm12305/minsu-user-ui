<template>
  <vxe-modal title="附件上传" v-model="visible" width="25%" showFooter show-zoom resize @close="handleClose">
    <el-upload
      align="center"
      class="upload-demo"
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="20"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :headers="headers"
      ref="fileUpload"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        请上传
        <template> 大小不超过 <b style="color: #f56c6c">{{ maxFileSize }}MB</b></template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
        的文件
      </div>
    </el-upload>

    <div slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
      <el-button v-if="!allFilesUploaded" size="mini" type="primary" @click="visible = false">关 闭</el-button>
      <el-button v-if="allFilesUploaded" size="mini" type="primary" @click="handleClose">上传完成, 关闭</el-button>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  name: 'FileUploadModal',
  props: {
    uploadFileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: Array,
      default: () => ['doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'zip']
    },
    maxFileSize: {
      type: Number,
      default: 50
    },
    headers: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false,
      fileList: [],
      allFilesUploaded: false,
      number: 0,
      uploadList: []
    };
  },
  methods: {
    handleClose() {
      this.fileList = [];
      this.allFilesUploaded = false;
      this.visible = false;
      this.$emit('close');
    },
    handleBeforeUpload(file) {
      const fileName = file.name.split('.');
      const fileExt = fileName[fileName.length - 1];
      const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
      if (!isTypeOk) {
        this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
        return false;
      }
      if (file.size / 1024 / 1024 > this.maxFileSize) {
        this.$modal.msgError(`上传文件大小不能超过 ${this.maxFileSize} MB!`);
        return false;
      }
      this.$modal.loading("正在上传文件，请稍候...");
      this.number++;
      return true;
    },
    handleUploadError() {
      this.$modal.msgError("上传文件失败，请重试");
      this.$modal.closeLoading();
    },
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, url: res.fileName, size: this.formatFileSize(file.size) });
        this.$emit('upload-success', { fileName: res.fileName, fileSize: this.formatFileSize(file.size) });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
      this.allFilesUploaded = true;
      this.$modal.msgSuccess("上传成功");
    },
    formatFileSize(size) {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.fileList = this.fileList.map(item => {
          item.name = item.name.split('/').pop();
          return item;
        });
        this.uploadList = [];
        this.number = 0;
        this.$emit('input', this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    listToString(list, separator = ',') {
      let strs = "";
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs !== '' ? strs.substr(0, strs.length - 1) : '';
    }
  }
};
</script>
