import { YubinBangoCore, Addr } from "yubinbango-core-strict";

class PostalCode {
  getAddr(postalCode: string): Promise<Addr> {
    return new Promise<Addr>((reslve) => {
      new YubinBangoCore(postalCode, (_addr) => {
        reslve(_addr);
      });
    });
  }
}

const PostalCodeService = new PostalCode();

export { PostalCodeService };
