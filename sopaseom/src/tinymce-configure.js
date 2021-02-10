/**
 *
 * @param {import('tinymce').Editor} editor
 */
const examplePlugin = (editor) => {
  const openDialog = () =>
    editor.windowManager.open({
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

// * @param {string} content 초기 내용
/**
 * Tinymce 초기화 객체를 생성합니다.
 * @returns {object} Tinymce 초기화 객체
 */
export default ({ height = 800 } = {}) => ({
  content_css: [
    '//fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap',
    '//fonts.googleapis.com/css2?family=Indie+Flower&family=Nanum+Gothic:wght@400;700',
  ],
  // menubar: 'file edit view insert format tools table tc help',
  language: 'ko_KR',
  content_style: "body { font-family: 'Noto Sans KR'; color: #2b3e4a }",
  font_formats:
    'Noto Sans KR=Noto Sans KR, sans-serif;Noto Serif KR=Noto Serif KR, serif;나눔고딕=Nanum Gothic, sans-serif',
  // a11y_advanced_options: true,
  fontsize_formats: '11px 12px 14px 16px 18px 21px 24px 30px 36px 48px',
  formats: {
    fw100: { inline: 'span', styles: { fontWeight: '100' } },
    fw200: { inline: 'span', styles: { fontWeight: '200' } },
    fw300: { inline: 'span', styles: { fontWeight: '300' } },
    fw400: { inline: 'span', styles: { fontWeight: '400' } },
    fw500: { inline: 'span', styles: { fontWeight: '500' } },
    fw600: { inline: 'span', styles: { fontWeight: '600' } },
    fw700: { inline: 'span', styles: { fontWeight: '700' } },
    fw800: { inline: 'span', styles: { fontWeight: '800' } },
    fw900: { inline: 'span', styles: { fontWeight: '900' } },
  },
  style_formats: [
    { title: 'Thin', format: 'fw100' },
    { title: 'Extra Light', format: 'fw200' },
    { title: 'Light', format: 'fw300' },
    { title: 'Regular', format: 'fw400' },
    { title: 'Medium', format: 'fw500' },
    { title: 'Semi Bold', format: 'fw600' },
    { title: 'Bold.', format: 'fw700' },
    { title: 'Extra Bold', format: 'fw800' },
    { title: 'Black.', format: 'fw900' },
  ],
  relative_urls: false,
  height,
  max_width: 700,
  // inline: true,
  plugins: [
    'ExamplePlugin',
    'hr',
    'advlist autolink lists link image charmap print preview anchor',
    // 'advlist autolink lists link charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar1: ` undo redo | fontselect | formatselect | fontsizeselect | bold italic underline forecolor backcolor | 
     alignleft aligncenter alignright alignjustify | 
     bullist numlist outdent indent | removeformat | help`,
  setup(/* editor */) {
    window.tinymce.PluginManager.add('ExamplePlugin', examplePlugin);
    // editor.on('init', () => {
    //   editor.setContent(content);
    // });
  },
  // images_upload_handler(blobInfo, success, failure) {
  //   console.log('# imagesUploadHandler');
  //   console.log(blobInfo);
  //   failure('no implementation');
  // },
});
