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
        text: 'Close',
      },
      {
        type: 'submit',
        text: 'Save',
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

export default {
  height: 500,
  menubar: false,
  plugins: [
    'ExamplePlugin',
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar: `example | undo redo | formatselect | bold italic backcolor | 
     alignleft aligncenter alignright alignjustify | 
     bullist numlist outdent indent | removeformat | help`,
  setup() {
    window.tinymce.PluginManager.add('ExamplePlugin', examplePlugin);
  },
};
