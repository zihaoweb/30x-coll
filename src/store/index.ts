import { defineStore } from 'pinia';
import type { BluetoothDeviceInfo } from '@/utils/helper';

interface StoreDeviceParams {
  isCollection: boolean;
  deviceId: string;
  serviceId: string;
  name: string;
  characteristicId: string;
  deviceList: BluetoothDeviceInfo[];
  connectBluetoothIns: any;
  wifiName: string;
  deviceType: string;
  reconnect: boolean;
}

export const useDeviceStore = defineStore({
  id: 'device',
  state: (): StoreDeviceParams => ({
    deviceId: '',
    isCollection: false,
    name: '',
    serviceId: '',
    characteristicId: '',
    deviceList: [],
    connectBluetoothIns: null,
    wifiName: '',
    deviceType: '',
    reconnect: false,
  }),
  actions: {
    setWifiName(wifiName: string) {
      this.wifiName = wifiName;
    },
    setReconnect(reconnect: boolean) {
      this.reconnect = reconnect;
    },
    setName(name: string) {
      this.name = name;
    },
    setDeviceType(deviceType: string) {
      this.deviceType = deviceType;
    },
    setConnectBluetoothIns(connectBluetoothIns: any) {
      this.connectBluetoothIns = connectBluetoothIns;
    },
    setDeviceId(deviceId: string) {
      this.deviceId = deviceId;
    },
    setIsCollection(isCollection: boolean) {
      this.isCollection = isCollection;
    },
    setDeviceList(deviceList: BluetoothDeviceInfo[]) {
      this.deviceList = deviceList;
    },
    setServiceId(serviceId: string) {
      this.serviceId = serviceId;
    },
    setCharacteristicId(characteristicId: string) {
      this.characteristicId = characteristicId;
    },
  },
  getters: {
    getWifiName(): string {
      return this.wifiName;
    },
    getReconnect(): boolean {
      return this.reconnect;
    },
    getName(): string {
      return this.name;
    },
    getDeviceType(): string {
      return this.deviceType;
    },
    getServiceId(): string {
      return this.serviceId;
    },
    getCharacteristicId(): string {
      return this.characteristicId;
    },
    getDeviceId(): string {
      return this.deviceId;
    },
    getIsCollection(): boolean {
      return this.isCollection;
    },
    getDeviceList(): any {
      return this.deviceList;
    },
    getConnectBluetoothIns(): any {
      return this.connectBluetoothIns;
    },
  },
});

export default useDeviceStore;
