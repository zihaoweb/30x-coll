import { defineStore } from 'pinia';
import type { MemberInfoList } from '@/api/member/type';

// 成员信息
export const useMemberStore = defineStore({
  id: 'member',
  state: () => ({
    memberList: [] as MemberInfoList[],
    memberInfo: {} as MemberInfoList,
  }),
  actions: {
    setMemberList(memberList: MemberInfoList[]) {
      this.memberList = memberList;
    },
    setMemberInfo(memberInfo: MemberInfoList) {
      this.memberInfo = memberInfo;
    },
  },
  getters: {
    getMemberList(): MemberInfoList[] {
      return this.memberList;
    },
    getMemberInfo(): MemberInfoList {
      return this.memberInfo;
    },
  },
});

export default useMemberStore;
