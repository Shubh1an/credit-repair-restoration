import environment from "../environments/environment";
import { ClientRoutesConstants } from "../shared/constants";

export class UrlUtils {
  static getBaseUrl(): string {
    return environment.baseURL;
  }
  static getPartnerKey(): string {
    return window.location?.href
      .replace(window.location?.origin + "/", "")
      ?.split("/")[0];
  }
  static isPartnerKeyInvalid(): boolean {
    const baseURL = this.getPartnerKey();
    return (
      !baseURL ||
      "/" + baseURL === ClientRoutesConstants.notFound ||
      !(baseURL?.length >= 2)
    );
  }
}
