import {Logger, getLoggerFor} from '@thundr-be/sai-helpers';
import {AccessMode} from '@thundr-be/sai-helpers';
import {Authorizer, Principal, Ticket} from '@thundr-be/sai-interfaces';
import { Quad} from 'n3';
/**
 * Mock authorizer granting all specified access modes
 * to any client.
 *
 * NOTE: DO NOT USE THIS IN PRODUCTION
 */
export class UcpPatternAuthorizer extends Authorizer {
  protected readonly logger: Logger = getLoggerFor(this);

  /**
     *
     * TODO: need constructor that contains the stores for odrl Policies (the ones that are added by the Resource Owner) and one for the ODRL rules (the ones that given a request + context and all the policies can make a decision)
     */
  constructor() {
    super();

  }

  /**
   * Authorizes the client for specified request
   * @param {Principal} client - authenticated client
   * @param {Ticket} request - request to be authorized
   * @return {Promise<Set<AccessMode>>} - granted access modes
   */
  public async authorize(client: Principal, request: Ticket): Promise<Set<AccessMode>> {
    const odrlPolicies : Quad[] = []
    const odrlRules: string[] = []
    const accessModes: AccessMode[] = await calculateAccessModes({client, request}, odrlPolicies, odrlRules)
    return new Set(accessModes);
  }
}

async function calculateAccessModes(context: { client: Principal; request: Ticket; }, odrlPolicies: Quad[], odrlRules: string[]): Promise<AccessMode[]> {
  // go from context to a request that contains all context


  return []
}

`
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix : <http://example.org/> .
@prefix acl: <http://www.w3.org/ns/auth/acl#>.

# Policy
:usagePolicy 
  a odrl:Agreement ;
  odrl:permission :permission.

:permission
  a odrl:Permission ;
  odrl:action odrl:use ;
  odrl:target <https://tree.linkeddatafragments.org/sytadel/ldes/ais> ;
  odrl:assignee <https://ruben.verborgh.org/profile/#me> ;
  odrl:assigner <https://woslabbi.pod.knows.idlab.ugent.be/profile/card#me> .

# translated Principal and Ticket to context
:context
	:resourceOwner <https://woslabbi.pod.knows.idlab.ugent.be/profile/card#me>;
	:requestingParty <https://ruben.verborgh.org/profile/#me>;
	:target <https://tree.linkeddatafragments.org/sytadel/ldes/ais>;
	:requestPermission acl:Read.

# an ODRL Rule {context, ODRL Policy}=> {decision}.
{ 
  	?permission a odrl:Permission;
      	odrl:action odrl:use ; #list in?
      	odrl:target ?targetResource ;
      	odrl:assignee ?requestedParty;
      	odrl:assigner ?resourceOwner .   
  
  	?context 
    	  :resourceOwner ?resourceOwner;
      	:requestingParty ?requestedParty;
      	:target ?targetResource;
      	:requestPermission acl:Read.
} =>
{
   :response :accessModes acl:Read.
}.`
