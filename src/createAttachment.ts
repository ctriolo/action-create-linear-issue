import { Attachment, LinearClient } from "@linear/sdk";

/**
 * Creates an attachment using the provided issue id and github action inputs
 * @param linearClient LinearClient instance
 * @param issueId Issue to attach the URL to
 * @returns The newly created attachment
 */
const createAttachment = async (
  linearClient: LinearClient,
  input: {
    issueId: string;
    title: string;
    url: string;
  },
): Promise<Attachment | null> => {
  const attachmentPayload = await linearClient.createAttachment(input);
  if (!attachmentPayload.success) {
    return null;
  }

  const attachment = await attachmentPayload.attachment;
  if (!attachment) {
    return null;
  }

  return attachment;
};

export default createAttachment;
