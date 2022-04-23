import {ApplicationRegistrationStrategy} from './ApplicationRegistrationStrategy';
import {APP_CLIENTID, MOCK_APPLICATION, MOCK_REQUEST,
  MOCK_RESOURCE, MOCK_SOCIAL_AGENT, WEBID_ALICE} from '../../../../util/test/MockData';
import {AuthorizationAgent} from '@janeirodigital/interop-authorization-agent';
import {AccessMode} from '@laurensdeb/authorization-agent-helpers';

const MOCK_FIND_APPLICATION_REGISTRATION = jest.fn();

const MOCK_AUTHORIZATION_AGENT_FACTORY = {
  getAuthorizationAgent: jest.fn(),
};

describe('An ApplicationRegistrationStrategy', () =>{
  const strategy = new ApplicationRegistrationStrategy(MOCK_AUTHORIZATION_AGENT_FACTORY);

  beforeEach(() => {
    MOCK_AUTHORIZATION_AGENT_FACTORY.getAuthorizationAgent.mockImplementation(async () => {
      return {
        findApplicationRegistration: MOCK_FIND_APPLICATION_REGISTRATION,
      } as unknown as AuthorizationAgent;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should authorize an Application\'s request to the application\'s registration', async () =>{
    MOCK_FIND_APPLICATION_REGISTRATION.mockResolvedValueOnce({
      iri: MOCK_RESOURCE,
      registeredAgent: APP_CLIENTID,
    });

    const result = await strategy.authorize(MOCK_REQUEST, MOCK_APPLICATION);
    expect(result).toEqual(new Set([AccessMode.read]));

    expect(MOCK_AUTHORIZATION_AGENT_FACTORY.getAuthorizationAgent).toHaveBeenCalled();
    expect(MOCK_AUTHORIZATION_AGENT_FACTORY.getAuthorizationAgent).toHaveBeenCalledWith(WEBID_ALICE);

    expect(MOCK_FIND_APPLICATION_REGISTRATION).toHaveBeenCalled();
    expect(MOCK_FIND_APPLICATION_REGISTRATION).toHaveBeenCalledWith(APP_CLIENTID);
  });


  it('should not authorize an Application\'s request if no application registration exists', async () =>{
    MOCK_FIND_APPLICATION_REGISTRATION.mockResolvedValueOnce(undefined);

    const result = await strategy.authorize(MOCK_REQUEST, MOCK_APPLICATION);
    expect(result).toEqual(new Set());

    expect(MOCK_AUTHORIZATION_AGENT_FACTORY.getAuthorizationAgent).toHaveBeenCalled();
    expect(MOCK_AUTHORIZATION_AGENT_FACTORY.getAuthorizationAgent).toHaveBeenCalledWith(WEBID_ALICE);

    expect(MOCK_FIND_APPLICATION_REGISTRATION).toHaveBeenCalled();
    expect(MOCK_FIND_APPLICATION_REGISTRATION).toHaveBeenCalledWith(APP_CLIENTID);
  });

  it('should not authorize a Social Agent\'s request to an application\'s registration', async () =>{
    MOCK_FIND_APPLICATION_REGISTRATION.mockResolvedValueOnce({
      iri: MOCK_RESOURCE,
      registeredAgent: APP_CLIENTID,
    });

    const result = await strategy.authorize(MOCK_REQUEST, MOCK_SOCIAL_AGENT);
    expect(result).toEqual(new Set());

    expect(MOCK_AUTHORIZATION_AGENT_FACTORY.getAuthorizationAgent).toHaveBeenCalledTimes(0);

    expect(MOCK_FIND_APPLICATION_REGISTRATION).toHaveBeenCalledTimes(0);
  });
});
