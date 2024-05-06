<template>
  <el-button v-popover:popover type="primary">
    Export
    <el-popover ref="popover" placement="bottom" popper-class="button-popover" trigger="hover">
      <div class="button-list_column">
        <el-button type="primary" @click="downloadProcessAsBpmn">Export to Bpmn</el-button>
        <el-button type="primary" @click="downloadProcessAsXml">Export to XML</el-button>
        <el-button type="primary" @click="downloadProcessAsSvg">Export to SVG</el-button>
      </div>
    </el-popover>
  </el-button>
</template>

<script>
import { downloadFile, setEncoded } from "@utils/files";
import { mapGetters } from "vuex";

export default {
  name: "BpmnExports",
  computed: {
    ...mapGetters(["getModeler"])
  },
  methods: {
    async downloadProcess(type, name = "diagram") {
      try {
        if (!this.getModeler) return this.$message.error("Flowchart engine initialization failed");
        const modeler = this.getModeler;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await modeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`);
          }
          const { href, filename } = setEncoded(type.toUpperCase(), name, xml);
          downloadFile(href, filename);
        } else {
          const { err, svg } = await modeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          const { href, filename } = setEncoded("SVG", name, svg);
          downloadFile(href, filename);
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
    },
    downloadProcessAsBpmn() {
      this.downloadProcess("bpmn");
    },
    downloadProcessAsXml() {
      this.downloadProcess("xml");
    },
    downloadProcessAsSvg() {
      this.downloadProcess("svg");
    }
  }
};
</script>
