import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  RESEND_CONTACT_SOURCE,
  resetResendContactPropertiesCache,
  syncResendContact,
} from '@/lib/unverified-answers/syncResendContact';

const contactsCreate = vi.fn();
const contactsUpdate = vi.fn();
const contactPropertiesList = vi.fn();
const contactPropertiesCreate = vi.fn();

vi.mock('@/lib/email/resendClient', () => ({
  getResendContactsClient: () => ({
    contacts: {
      create: contactsCreate,
      update: contactsUpdate,
    },
    contactProperties: {
      list: contactPropertiesList,
      create: contactPropertiesCreate,
    },
  }),
}));

describe('syncResendContact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetResendContactPropertiesCache();
    delete process.env.RESEND_UNVERIFIED_SEGMENT_ID;
    contactPropertiesList.mockResolvedValue({
      data: { data: [], object: 'list', has_more: false },
      error: null,
    });
    contactPropertiesCreate.mockResolvedValue({
      data: { id: 'prop-1', object: 'contact_property' },
      error: null,
    });
    contactsCreate.mockResolvedValue({ data: { id: 'contact-1' }, error: null });
    contactsUpdate.mockResolvedValue({ data: { id: 'contact-1' }, error: null });
  });

  it('creates missing contact properties then creates the contact', async () => {
    await syncResendContact({
      email: 'Principal@Firm.com',
      firmName: 'Northgate Financial',
      marketingConsent: true,
      resultStatus: 'counted',
      untraceable: 43,
      piDisclosure: 'no',
      piRenewalMonth: 'march',
    });

    expect(contactPropertiesList).toHaveBeenCalled();
    expect(contactPropertiesCreate).toHaveBeenCalled();
    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'principal@firm.com',
        unsubscribed: false,
        firstName: 'Northgate Financial',
        properties: expect.objectContaining({
          source: RESEND_CONTACT_SOURCE,
          firm_name: 'Northgate Financial',
          result_status: 'counted',
          untraceable: '43',
          marketing_consent: 'yes',
        }),
      }),
    );
    expect(contactsUpdate).not.toHaveBeenCalled();
  });

  it('marks the contact unsubscribed when marketing consent is false', async () => {
    await syncResendContact({
      email: 'principal@firm.com',
      firmName: null,
      marketingConsent: false,
      resultStatus: 'not_counted',
      untraceable: null,
      piDisclosure: 'not_sure',
      piRenewalMonth: 'not_sure',
    });

    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        unsubscribed: true,
        properties: expect.objectContaining({
          untraceable: '',
          marketing_consent: 'no',
        }),
      }),
    );
  });

  it('updates an existing contact when create fails', async () => {
    contactsCreate.mockResolvedValueOnce({
      data: null,
      error: { message: 'Contact already exists' },
    });

    await syncResendContact({
      email: 'principal@firm.com',
      firmName: 'Northgate Financial',
      marketingConsent: false,
      resultStatus: 'counted',
      untraceable: 12,
      piDisclosure: 'yes',
      piRenewalMonth: 'june',
    });

    expect(contactsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'principal@firm.com',
        firstName: 'Northgate Financial',
      }),
    );
  });

  it('adds an optional segment when RESEND_UNVERIFIED_SEGMENT_ID is set', async () => {
    process.env.RESEND_UNVERIFIED_SEGMENT_ID = 'seg_123';

    await syncResendContact({
      email: 'principal@firm.com',
      firmName: null,
      marketingConsent: false,
      resultStatus: 'counted',
      untraceable: 1,
      piDisclosure: 'no',
      piRenewalMonth: 'january',
    });

    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        segments: [{ id: 'seg_123' }],
      }),
    );
  });

  it('explains when the API key is send-only', async () => {
    contactPropertiesList.mockResolvedValueOnce({
      data: null,
      error: {
        name: 'restricted_api_key',
        message: 'This API key is restricted to only send emails',
        statusCode: 401,
      },
    });

    await expect(
      syncResendContact({
        email: 'principal@firm.com',
        firmName: null,
        marketingConsent: false,
        resultStatus: 'counted',
        untraceable: 1,
        piDisclosure: 'no',
        piRenewalMonth: 'january',
      }),
    ).rejects.toThrow(/RESEND_CONTACTS_API_KEY|Full access/);
  });
});
