interface Actions {
  url: string;
  name: string;
}

interface Avatar {
  avatar_url?: string;
  action_url?: string;
}

interface SubText {
  text?: string;
  action_url?: string;
}

interface RemoteNotificationMessage {
  header: string;
  schema: string;
  text: string;
  url: string;
  extra_data?: string;
  actions?: Actions[];
  avatar?: Avatar;
  subtext?: SubText;
}

export interface RemoteNotification {
  n_id: string;
  n_category: string;
  created_on: number;
  seen_on?: number;
  interacted_on?: number;
  message: RemoteNotificationMessage;
}

export interface Notification extends RemoteNotification {
  markClicked: () => void;
}

export interface ResponseNotification {
  results: RemoteNotification[];
  unread: number;
}
