import {
  VuetifyTiptap,
  VuetifyViewer,
  createVuetifyProTipTap,
} from "vuetify-pro-tiptap";
import { MediaDescriptorAdminService } from "@/openapi";
import {
  BaseKit,
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  TextAlign,
  FontFamily,
  FontSize,
  SubAndSuperScript,
  BulletList,
  OrderedList,
  TaskList,
  Indent,
  Link,
  Image,
  Video,
  Table,
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,
  Clear,
  Fullscreen,
  History,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";
import { MediaDatabase } from "@/utils/dexie";
export const vuetifyProTipTap = createVuetifyProTipTap({
  lang: "zhHans",
  components: {
    VuetifyTiptap,
    VuetifyViewer,
  },
  extensions: [
    BaseKit.configure({
      placeholder: {
        placeholder: "此处输入内容...",
      },
    }),
    Bold,
    Italic,
    Underline,
    Strike,
    Code.configure({ divider: true }),
    Heading,
    TextAlign,
    FontFamily,
    FontSize,
    Color,
    Highlight.configure({ divider: true }),
    SubAndSuperScript.configure({ divider: true }),
    Clear.configure({ divider: true }),
    BulletList,
    OrderedList,
    TaskList,
    Indent.configure({ divider: true }),
    Link,
    Image.configure({
      async upload(file: File) {
        const blob = URL.createObjectURL(file);
        const mediaDB = new MediaDatabase();
        const id = await mediaDB.medias.add({ id: blob, name: file.name });
        console.log(id);
        return blob;
      },
    }),
    Video,
    Table.configure({ divider: true }),
    Blockquote,
    HorizontalRule,
    CodeBlock.configure({ divider: true }),
    History.configure({ divider: true }),
    Fullscreen,
  ],
});
