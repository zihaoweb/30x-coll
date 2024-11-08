import { defineStore } from 'pinia';
import { getRecordList } from '@/api/record';
import type { GetRecordListResult } from '@/api/record/types';

interface RecordState {
  recordList: GetRecordListResult[];
  hasUnreadMessage: boolean;
  hasRecord: boolean;
}

export const useRecordStore = defineStore({
  id: 'record',
  state: (): RecordState => ({
    recordList: [],
    hasUnreadMessage: false,
    hasRecord: false,
  }),
  actions: {
    async init() {
      try {
        const data = await getRecordList({ accid: uni.getStorageSync('uuid') });
        if (data.length > 0) {
          data.forEach((item) => {
            if (item.readed === 'N') {
              console.log('有未读消息');
              this.hasUnreadMessage = true;
            }
          });
          data.sort((a, b) => Number(b.collect_sta_tm) - Number(a.collect_sta_tm));
          this.recordList = data;
          this.hasRecord = true;
        }
        else {
          this.hasRecord = false;
        }
      }
      catch (error) {
        console.log(error);
      }
    },
    setUnreadMessage(status: boolean) {
      this.hasUnreadMessage = status;
    },
  },
  getters: {
    getHasRecord(): boolean {
      return this.hasRecord;
    },
    getRecordList(): GetRecordListResult[] {
      return this.recordList;
    },
    getHasUnreadMessage(): boolean {
      return this.hasUnreadMessage;
    },
  },
});

export default useRecordStore;
