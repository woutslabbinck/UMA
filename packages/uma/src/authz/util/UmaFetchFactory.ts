import {AccessMode, FetchFactory, getLoggerFor} from '@thundr-be/sai-helpers';
import {fetch} from 'cross-fetch';
import {TokenFactory} from '../../token/TokenFactory';

/**
 *
 */
export class UmaFetchFactory extends FetchFactory {
  private readonly logger = getLoggerFor(this);
  /**
     * @param {TokenFactory} tokenFactory
     */
  constructor(private readonly tokenFactory: TokenFactory, private readonly asUrl: string) {
    super();
  }
  // eslint-disable-next-line valid-jsdoc
  /**
     * Returns an authenticated fetch for the client.
     */
  getAuthenticatedFetch(clientId: string): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
    const getJwtForRequest = this.getJwtForRequest.bind(this);
    const logger = this.logger;
    return async function fetchBoundToUMA(
        url: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> {
      return fetch(url, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          authorization: `Bearer ${await getJwtForRequest(url)}`,
        },
      }).then((res) => {
        logger.debug(`Requested resource '${url.toString()}'`);
        return res;
      });
    };
  }

  /**
   * Returns a JWT for authenticating the request.
   *
   * @param {RequestInfo} url
   * @return {Promise<string>}
   */
  private async getJwtForRequest(url: RequestInfo | URL): Promise<string> {
    return (await this.tokenFactory.serialize({
      sub: {iri: url.toString()},
      modes: new Set([AccessMode.read]),
      webId: this.asUrl,
    })).token;
  }
}
