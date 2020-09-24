/**
 * 
 * @param {import('tinymce').Editor} editor 
 */
const examplePlugin = (editor) => {
  const openDialog = () => editor.windowManager.open({
    title: 'Example plugin',
    body: {
      type: 'panel',
      items: [
        {
          type: 'input',
          name: 'title',
          label: 'Title',
        },
      ],
    },
    buttons: [
      {
        type: 'cancel',
        text: '닫기',
      },
      {
        type: 'submit',
        text: '저장',
        primary: true,
      },
    ],
    onSubmit(api) {
      const data = api.getData();
      // Insert content when the window form is submitted
      editor.insertContent(`Title: ${data.title}`);
      api.close();
    },
  });

  // Add a button that opens a window
  editor.ui.registry.addButton('example', {
    text: 'My button',
    onAction() {
      // Open window
      openDialog();
    },
  });

  // Adds a menu item, which can then be included in any menu via the menu/menubar configuration
  editor.ui.registry.addMenuItem('example', {
    text: 'Example plugin',
    onAction() {
      // Open window
      openDialog();
    },
  });

  return {
    getMetadata() {
      return {
        name: 'Example plugin',
        url: 'http://exampleplugindocsurl.com',
      };
    },
  };
};

/**
 * Tinymce 초기화 객체를 생성합니다.
 * @param {string} content 초기 내용
 * @returns {object} Tinymce 초기화 객체
 */
export default (/* content */) => ({
  content_css: ['//fonts.googleapis.com/css2?family=Indie+Flower&family=Noto+Sans+KR:wght@300;700&family=Noto+Serif+KR:wght@300;600&family=Nanum+Gothic:wght@400;700'],
  // menubar: 'file edit view insert format tools table tc help',
  language: 'ko_KR',
  content_style: "body { font-family: 'Noto Sans KR'; }",
  font_formats: 'Noto Sans KR=Noto Sans KR, sans-serif;Noto Serif KR=Noto Serif KR, serif;나눔고딕=Nanum Gothic, sans-serif',
  // a11y_advanced_options: true,
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
  height: 600,
  // inline: true,
  plugins: [
    'ExamplePlugin', 'hr',
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar1: `example image | undo redo | fontselect | formatselect | fontsizeselect | bold italic underline forecolor backcolor | 
     alignleft aligncenter alignright alignjustify | 
     bullist numlist outdent indent | removeformat | help`,
  setup(/* editor */) {
    window.tinymce.PluginManager.add('ExamplePlugin', examplePlugin);
    // editor.on('init', () => {
    //   editor.setContent(content);
    // });
  },
  images_upload_handler(blobInfo, success, failure) {
    console.log(blobInfo);
    failure('no implementation');
  },
});
