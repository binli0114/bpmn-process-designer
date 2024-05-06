<template>
  <el-button v-popover:popover type="primary">
    Preview
    <el-popover ref="popover" placement="bottom" popper-class="button-popover" trigger="hover">
      <div class="button-list_column">
        <el-button type="primary" @click="openXMLPreviewModel">XML</el-button>
        <el-button type="primary" @click="openJsonPreviewModel">JSON</el-button>
      </div>
    </el-popover>

    <el-dialog :title="modelTitle" :visible.sync="codeModelVisible" width="72vw" append-to-body destroy-on-close>
      <div class="preview-model">
        <highlightjs :code="codeString" :language="codeLanguage" />
      </div>
    </el-dialog>
  </el-button>
</template>

<script>
import { mapGetters } from "vuex";
import { catchError } from "@utils/printCatch";

export default {
  name: "BpmnPreviews",
  computed: {
    ...mapGetters(["getModeler"]),
    modelTitle() {
      return this.codeLanguage === "xml" ? "Preview XML" : "Preview JSON";
    }
  },
  data() {
    return {
      codeLanguage: "xml",
      codeString: "",
      codeModelVisible: false
    };
  },
  methods: {
    async openXMLPreviewModel() {
      try {
        if (!this.getModeler) return this.$message.error("Failed to initialize the process engine");
        this.codeLanguage = "xml";
        this.codeModelVisible = true;
        const { xml } = await this.getModeler.saveXML({ format: true, preamble: true });
        this.codeString = xml;
      } catch (e) {
        catchError(e);
      }
    },
    async openJsonPreviewModel() {
      try {
        if (!this.getModeler) return this.$message.error("Failed to initialize the process engine");
        this.codeLanguage = "json";
        this.codeModelVisible = true;
        const { xml } = await this.getModeler.saveXML({ format: true, preamble: true });
        const jsonStr = await this.getModeler.get("moddle").fromXML(xml);
        this.codeString = JSON.stringify(jsonStr, null, 2);
      } catch (e) {
        catchError(e);
      }
    }
  }
};
</script>
