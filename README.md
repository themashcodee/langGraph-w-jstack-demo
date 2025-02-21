# Employee Management AI Agent Demo

## Overview

A personal project exploring AI-powered employee management using JStack, LangGraph, and LangSmith. This demo showcases how to build an intelligent agent that can query and analyze employee data through natural language interactions.

https://github.com/user-attachments/assets/ad9ea353-d4d4-4507-88ab-c5828fb31f26



## Features

- **AI-Powered Assistant**: Natural language interface for querying employee data
- **Employee Analytics**: Get insights about salary distributions, demographics, and more
- **Structured Data Querying**: Complex database queries simplified through conversation

## Technologies Used

- [JStack](https://jstack.app/): A modern TypeScript framework for building type-safe APIs
- [LangGraph](https://github.com/langchain-ai/langgraph-js): Framework for building stateful applications with LLMs
- [LangSmith](https://smith.langchain.com/): Debug, test, evaluate, and monitor LLM applications
- [Next.js](https://nextjs.org/): React framework for the web interface
- [Drizzle ORM](https://orm.drizzle.team/): TypeScript ORM for PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/employee-management-ai-demo.git
   cd employee-management-ai-demo
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Set up environment variables:

   Create a `.env` file with:

   ```
   DATABASE_URL='****'
   LANGSMITH_TRACING=true
   LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
   LANGSMITH_API_KEY="****"
   LANGSMITH_PROJECT="****"
   OPENAI_API_KEY="****"
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

   Visit `http://localhost:3000` to interact with the AI assistant.

## Usage Example

You can ask the AI assistant questions like:

- "What's the average salary in the marketing department?"
- "Show me employees hired in the last 6 months"
- "Compare compensation between different departments"

## Learning Resources

- [JStack Documentation](https://jstack.app/)
- [LangGraph Guide](https://github.com/langchain-ai/langgraph-js)
- [LangSmith Documentation](https://docs.smith.langchain.com/)

## License

MIT

---

This is a personal project created for learning and demonstration purposes.
