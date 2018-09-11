import { browser } from '@/utils/utils';
import http from '@/utils/request.js';
import toast from '@/services/toast';

export default {
  download: function() {
    if (browser.android) {
      http
        .get('/home/channelVersion', {})
        .then(res => {
          var url = res.data.wapAppUrl;
          window.location = url;
        })
        .catch(err => {
          toast.toast(err.message);
        });
      // window.location =
      // 'http://sit.cp.2ncai.com/_upload_file/app/Android_V1.0.5_6_activities_20170814_1101.apk';
    } else {
    }
  }
};
