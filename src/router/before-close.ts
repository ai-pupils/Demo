import { Modal } from 'iview';

const beforeClose: any = {
  before_close_normal: (resolve: any) => {
    Modal.confirm({
      title: '确定要关闭这一页吗',
      onOk: () => {
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      }
    });
  }
};

export default beforeClose;
