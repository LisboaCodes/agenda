import axios from 'axios';

const evolutionApi = axios.create({
  baseURL: process.env.EVOLUTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.EVOLUTION_API_KEY || '',
  },
});

export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string
): Promise<void> => {
  try {
    await evolutionApi.post(`/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`, {
      number: phoneNumber,
      text: message,
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

export const getInstanceStatus = async (): Promise<any> => {
  try {
    const response = await evolutionApi.get(`/instance/connectionState/${process.env.EVOLUTION_INSTANCE_NAME}`);
    return response.data;
  } catch (error) {
    console.error('Error getting instance status:', error);
    throw error;
  }
};

export default evolutionApi;
