import Dexie, { Table } from "dexie";

interface MediasToBeUploaded {
  blob: string;
  name: string;
  uploaded?: boolean;
  mediaId?: string;
}

interface MediasToBeChecked {
  mediaDownloadUrl: string;
}

//
// Declare Database
//
export class MediaDatabase extends Dexie {
  public mediasToBeUploaded!: Table<MediasToBeUploaded, string>; // id is number in this case
  public mediasToBeChecked!: Table<MediasToBeChecked, string>; // id is number in this case
  public constructor() {
    super("MediaDatabase");
    this.version(1).stores({
      mediasToBeUploaded: "&blob,name,mediaId",
      mediasToBeChecked: "&mediaDownloadUrl",
    });
  }
}
