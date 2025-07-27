class ChatbotService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api/chatbot';
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      return data;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  }

  async getGames() {
    try {
      const response = await fetch(`${this.baseURL}/games`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching games:', error);
      return { games: [] };
    }
  }
}

export const chatbotService = new ChatbotService();
