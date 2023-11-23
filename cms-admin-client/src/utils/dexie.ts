import Dexie, { Table } from "dexie";

interface Media {
  id: string;
  name: string;
  uploaded?: boolean;
  mediaId?: string;
}

//
// Declare Database
//
export class MediaDatabase extends Dexie {
  public medias!: Table<Media, string>; // id is number in this case
  public constructor() {
    super("MediaDatabase");
    this.version(1).stores({
      medias: "id,name,uploaded,mediaId",
    });
  }
}
