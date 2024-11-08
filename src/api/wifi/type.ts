export interface GetWifiParams {
  dev_sn: string;
  type: string;
}

export interface SetWifiParams {
  dev_sn: string;
  wifi_name: string;
}

export interface GetWifiResult {
  dev_sn: string;
  type: string;
}
